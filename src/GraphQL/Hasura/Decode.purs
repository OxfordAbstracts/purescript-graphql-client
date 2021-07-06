module GraphQL.Hasura.Decode (class DecodeHasura, class DecodeHasuraFields, class DecodeHasuraField, decodeHasura, decodeHasuraFields, decodeHasuraField) where

import Prelude
import Control.Alt ((<|>))
import Data.Argonaut.Core (Json, toObject)
import Data.Argonaut.Decode (JsonDecodeError(..), decodeJson)
import Data.Argonaut.Decode.Decoders (decodeJArray)
import Data.Foldable (foldl)
import Data.Bifunctor (lmap)
import Data.Date (Date, canonicalDate)
import Data.DateTime (DateTime(..), Time(..), adjust)
import Data.Either (Either(..))
import Data.Enum (class BoundedEnum, toEnum)
import Data.Int (toNumber)
import Data.Int as Int
import Data.List.NonEmpty as NonEmpty
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.String.CodeUnits (singleton)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Data.Time.Duration (Minutes(..))
import Data.Traversable (class Foldable, traverse)
import Foreign.Object (Object)
import Foreign.Object as Object
import Prim.Row as Row
import Prim.RowList as RL
import Record as Record
import Text.Parsing.StringParser (Parser, fail, runParser)
import Text.Parsing.StringParser as P
import Text.Parsing.StringParser.CodeUnits (anyDigit, char, eof)
import Text.Parsing.StringParser.Combinators (many1, optionMaybe)
import Type.Proxy (Proxy(..))

type Err a
  = Either JsonDecodeError a

class DecodeHasura a where
  decodeHasura :: Json -> Either JsonDecodeError a

instance decodeHasuraBoolean :: DecodeHasura Boolean where
  decodeHasura = decodeJson

instance decodeHasuraString :: DecodeHasura String where
  decodeHasura = decodeJson

instance decodeHasuraInt :: DecodeHasura Int where
  decodeHasura = decodeJson

instance decodeHasuraNumber :: DecodeHasura Number where
  decodeHasura = decodeJson

instance decodeHasuraJson :: DecodeHasura Json where
  decodeHasura = decodeJson

instance decodeHasuraArray :: DecodeHasura a => DecodeHasura (Array a) where
  decodeHasura = decodeJArray >=> traverse decodeHasura

instance decodeHasuraMaybe :: DecodeHasura a => DecodeHasura (Maybe a) where
  decodeHasura = decodeJson >=> traverse decodeHasura

instance decodeHasuraDateTime :: DecodeHasura DateTime where
  decodeHasura = runJsonParser isoDateTime

instance decodeHasuraDate :: DecodeHasura Date where
  decodeHasura = runJsonParser isoDate

instance decodeHasuraTime :: DecodeHasura Time where
  decodeHasura = runJsonParser isoTime

runJsonParser :: forall a. Parser a -> Json -> Either JsonDecodeError a
runJsonParser p = decodeJson >=> runParser p >>> lmap (show >>> TypeMismatch)

instance decodeRecord
  :: ( DecodeHasuraFields row list
     , RL.RowToList row list
     )
  => DecodeHasura (Record row) where
  decodeHasura json =
    case toObject json of
      Just object -> decodeHasuraFields object (Proxy :: Proxy list)
      Nothing -> Left $ TypeMismatch "Object"

class DecodeHasuraFields (row :: Row Type) (list :: RL.RowList Type) | list -> row where
  decodeHasuraFields :: forall proxy. Object Json -> proxy list -> Either JsonDecodeError (Record row)

instance decodeHasuraFieldsNil :: DecodeHasuraFields () RL.Nil where
  decodeHasuraFields _ _ = Right {}

instance decodeHasuraFieldsCons
  :: ( DecodeHasuraField value
     , DecodeHasuraFields rowTail tail
     , IsSymbol field
     , Row.Cons field value rowTail row
     , Row.Lacks field rowTail
     )
  => DecodeHasuraFields row (RL.Cons field value tail) where
    decodeHasuraFields object _ = do
      let
        _field = Proxy :: Proxy field
        fieldName = reflectSymbol _field
        fieldValue = Object.lookup fieldName object

      case decodeHasuraField fieldValue of
        Just fieldVal -> do
          val <- lmap (AtKey fieldName) fieldVal
          rest <- decodeHasuraFields object (Proxy :: Proxy tail)
          Right $ Record.insert _field val rest

        Nothing ->
          Left $ AtKey fieldName MissingValue

class DecodeHasuraField a where
  decodeHasuraField :: Maybe Json -> Maybe (Either JsonDecodeError a)

instance decodeFieldMaybe
  :: DecodeHasura a
  => DecodeHasuraField (Maybe a) where
  decodeHasuraField Nothing = Just $ Right Nothing
  decodeHasuraField (Just j) = Just $ decodeHasura j

else instance decodeFieldId
  :: DecodeHasura a
  => DecodeHasuraField a where
  decodeHasuraField j = decodeHasura <$> j


isoDateTime :: Parser DateTime
isoDateTime = do
  date <- isoDate
  charV 'T'
  time <- isoTime
  tzMay <- optionMaybe isoTz
  let
    resWoTz = DateTime date time
  pure $ fromMaybe resWoTz $ tzMay
    >>= \tz ->
        adjust tz resWoTz

isoDate :: Parser Date
isoDate = do
  year <- enum "year"
  charV '-'
  month <- enum "month"
  charV '-'
  day <- enum "day"
  pure $ canonicalDate year month day

isoTime :: Parser Time
isoTime = do
  hours <- enum "hours"
  charV ':'
  minutes <- enum "minutes"
  charV ':'
  seconds <- enum "seconds"
  ms <- optionMaybe $ (charV '.' <|> eof) *> enumTruncated 3 "ms"
  pure $ Time hours minutes seconds (fromMaybe bottom ms)

isoTz :: Parser Minutes
isoTz = do
  sign <- (char '+' <|> char '-')
  hour <- int
  charV ':'
  minute <- int
  let
    tzInt = minute + hour * 60
  pure $ Minutes $ toNumber if sign == '-' then tzInt else -tzInt

charV :: Char -> Parser Unit
charV = void <<< char

enum :: forall e. BoundedEnum e => String -> Parser e
enum fail = int >>= (toEnum >>> maybeFail fail)

enumTruncated :: forall e. BoundedEnum e => Int -> String -> Parser e
enumTruncated max fail = intTruncated max >>= (toEnum >>> maybeFail fail)

int :: Parser Int
int = many1 (anyDigit) >>= digitsToInt

intTruncated :: Int -> Parser Int
intTruncated max = many1 (anyDigit) <#> NonEmpty.take max >>= digitsToInt

digitsToInt :: forall f. Foldable f => f Char -> Parser Int
digitsToInt =
  foldl (\s c -> s <> singleton c) ""
    >>> \str -> case Int.fromString str of
        Nothing -> fail $ "Failed to parse Int from: " <> str
        Just i -> pure i

maybeFail :: forall a. String -> Maybe a -> Parser a
maybeFail str = maybe (P.fail str) pure
