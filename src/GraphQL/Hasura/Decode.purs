module GraphQL.Hasura.Decode (class DecodeHasura, class DecodeHasuraFields, getFields, decodeHasura) where

import Prelude
import Control.Alt ((<|>))
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (JsonDecodeError(..), decodeJson)
import Data.Argonaut.Decode.Decoders (decodeJArray)
import Data.Array (fold, foldl, head, (!!))
import Data.Array as Array
import Data.Bifunctor (lmap)
import Data.Date (Date, canonicalDate)
import Data.DateTime (DateTime(..), Hour, Minute, Time(..), adjust)
import Data.Either (Either(..), note)
import Data.Enum (class BoundedEnum, toEnum)
import Data.Int (fromString, toNumber)
import Data.Int as Int
import Data.List (List)
import Data.List as List
import Data.List.NonEmpty as NonEmpty
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.String (Pattern(..), split, take)
import Data.String.CodeUnits (dropWhile, singleton)
import Data.Symbol (class IsSymbol, SProxy(..), reflectSymbol)
import Data.Time.Duration (Minutes(..), fromDuration)
import Data.Traversable (class Foldable, fold, traverse)
import Data.Typelevel.Undefined (undefined)
import Data.Variant (Variant, inj)
import Debug.Trace (spy, traceM)
import Foreign.Object (Object)
import Foreign.Object as Object
import Prim.Row as Row
import Prim.RowList (class RowToList, Cons, Nil, kind RowList)
import Record.Builder (Builder)
import Record.Builder as Builder
import Text.Parsing.Parser.Combinators (withErrorMessage)
import Text.Parsing.StringParser (Parser, fail, runParser, try)
import Text.Parsing.StringParser as P
import Text.Parsing.StringParser as PS
import Text.Parsing.StringParser.CodeUnits (anyDigit, char, eof)
import Text.Parsing.StringParser.Combinators (lookAhead, many, many1, many1Till, optionMaybe, withError)
import Text.Parsing.StringParser.Combinators as PC
import Type.Data.RowList (RLProxy(..))

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
  decodeHasura = runParserJson isoDateTime

instance decodeHasuraDate :: DecodeHasura Date where
  decodeHasura = decodeJson >=> decodeDateStr

instance decodeHasuraTime :: DecodeHasura Time where
  decodeHasura = decodeJson >=> decodeTimeStr

runParserJson :: forall a. Parser a -> Json -> Either JsonDecodeError a
runParserJson p = decodeJson >=> runParser p >>> lmap (show >>> TypeMismatch)

instance decodeHasuraRecord ::
  ( RowToList fields fieldList
  , DecodeHasuraFields fieldList () fields
  ) =>
  DecodeHasura (Record fields) where
  decodeHasura js = do
    o :: Object Json <- decodeJson js
    steps <- getFields fieldListP o
    pure $ Builder.build steps {}
    where
    fieldListP = RLProxy :: RLProxy fieldList

instance decodeHasuraJsonVariant ::
  ( RowToList variants rl
  , DecodeHasuraVariant rl variants
  ) =>
  DecodeHasura (Variant variants) where
  decodeHasura o = decodeHasuraVariant (RLProxy :: RLProxy rl) o

decodeDateStr :: String -> Err Date
decodeDateStr string = case split (Pattern "-") string of
  [ year, month, day ] -> do
    decodeDateParts year month day
  -- pure $ maybe dt $ adjust 
  _ -> notDecoded "Date" string

-- where
-- timeZoneStr = dropWhile (notEq '+' && notEq '-') string
-- tzHours = 
decodeTimeStr :: String -> Err Time
decodeTimeStr string = case Array.take 3 $ split (Pattern ":") string of
  [ hour, minute, secondsAndMs ] ->
    let
      sAndMsArr = split (Pattern ".") secondsAndMs
    in
      decodeTimeParts hour minute (fold $ head sAndMsArr) (fromMaybe "0" $ sAndMsArr !! 1)
  _ -> notDecoded "Time" string

decodeDateParts :: String -> String -> String -> Err Date
decodeDateParts year month day =
  canonicalDate
    <$> strToEnum "year" year
    <*> strToEnum "month" month
    <*> strToEnum "day" day

decodeTimeParts :: String -> String -> String -> String -> Err Time
decodeTimeParts hour minute second ms =
  Time
    <$> strToEnum "hour" hour
    <*> strToEnum "minute" minute
    <*> strToEnum "second" second
    <*> strToEnum "millisecond" (take 3 ms)

strToEnum :: forall a. Bounded a => BoundedEnum a => String -> String -> Err a
strToEnum label a =
  fromString a
    >>= toEnum
    # note (TypeMismatch $ "could not convert string to " <> label <> ": " <> a)

notDecoded :: forall a. String -> String -> Either JsonDecodeError a
notDecoded typeName input = Left $ TypeMismatch $ "Could not decode " <> typeName <> " from: " <> input

-- Records 
class DecodeHasuraFields (xs :: RowList) (from :: # Type) (to :: # Type) | xs -> from to where
  getFields ::
    RLProxy xs ->
    Object Json ->
    Err (Builder (Record from) (Record to))

instance decodeHasuraFieldsCons ::
  ( IsSymbol name
  , DecodeHasura ty
  , DecodeHasuraFields tail from from'
  , Row.Lacks name from'
  , Row.Cons name ty from' to
  ) =>
  DecodeHasuraFields (Cons name ty tail) from to where
  getFields _ obj = do
    value :: ty <- annnotateErr $ decodeHasura =<< readProp obj
    rest <- getFields tailP obj
    let
      first :: Builder (Record from') (Record to)
      first = Builder.insert nameP value
    pure $ first <<< rest
    where
    nameP = SProxy :: SProxy name

    tailP = RLProxy :: RLProxy tail

    name = reflectSymbol nameP

    annnotateErr = lmap (AtKey name)

    readProp = Object.lookup name >>> note (AtKey name MissingValue)

instance decodeHasuraFieldsNil ::
  DecodeHasuraFields Nil () () where
  getFields _ _ = pure identity

class DecodeHasuraVariant (xs :: RowList) (row :: # Type) | xs -> row where
  decodeHasuraVariant ::
    RLProxy xs ->
    Json ->
    Err (Variant row)

instance decodeHasuraVariantNil ::
  DecodeHasuraVariant Nil trash where
  decodeHasuraVariant _ _ = Left $ TypeMismatch "Unable to match any variant member."

instance decodeHasuraVariantCons ::
  ( IsSymbol name
  , DecodeHasura ty
  , Row.Cons name ty trash row
  , DecodeHasuraVariant tail row
  ) =>
  DecodeHasuraVariant (Cons name ty tail) row where
  decodeHasuraVariant _ o =
    do
      obj :: { type :: String, value :: Json } <- decodeHasura o
      if obj.type == name then do
        value :: ty <- decodeHasura obj.value
        pure $ inj namep value
      else
        (Left $ TypeMismatch $ "Did not match variant tag " <> name)
      <|> decodeHasuraVariant (RLProxy :: RLProxy tail) o
    where
    namep = SProxy :: SProxy name

    name = reflectSymbol namep

isoDateTime :: Parser DateTime
isoDateTime = do
  date <- isoDate
  charV 'T'
  time <- isoTime
  tzMay <-
    optionMaybe do
      sign <- (char '+' <|> char '-')
      hour <- int
      charV ':'
      minute <- int
      let
        tzInt = minute + hour * 60
      pure $ Minutes $ toNumber if sign == '-' then -tzInt else tzInt
  let
    resWoTz = DateTime date time
  pure $ fromMaybe resWoTz $ tzMay
    >>= \tz ->
        adjust tz resWoTz

-- let mult = if sign == '-' then -1 else 1
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
  (charV '.' <|> eof)
  ms <- optionMaybe $ enumTruncated 3 "ms"
  pure $ Time hours minutes seconds (fromMaybe bottom ms)

isoTz :: Parser Minutes
isoTz = do
  sign <- (char '+' <|> char '-')
  hour <- int
  charV ':'
  minute <- int
  let
    tzInt = minute + hour * 60
  pure $ Minutes $ toNumber if sign == '-' then -tzInt else tzInt

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
