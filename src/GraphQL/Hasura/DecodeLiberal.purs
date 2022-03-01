module GraphQL.Hasura.DecodeLiberal where

import Prelude
import Control.Alt ((<|>))
import Data.Argonaut.Core (Json, toObject)
import Data.Argonaut.Decode (JsonDecodeError(..))
import Data.Argonaut.Decode.Decoders (decodeJArray)
import Data.Array (mapMaybe)
import Data.Bifunctor (lmap)
import Data.Either (Either(..), hush)
import Data.Maybe (Maybe(..), maybe)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Foreign.Object (Object)
import Foreign.Object as Object
import GraphQL.Hasura.Decode (class DecodeHasura, decodeHasura)
import Prim.Row as Row
import Prim.RowList as RL
import Record as Record
import Text.Parsing.StringParser (Parser)
import Text.Parsing.StringParser as P
import Type.Proxy (Proxy(..))

-- | Decode json, with silent errors when possible
class DecodeHasuraLiberal a where
  decodeHasuraLiberal :: Json -> Either JsonDecodeError a

instance decodeHasuraLiberalArray :: DecodeHasuraLiberal a => DecodeHasuraLiberal (Array a) where
  decodeHasuraLiberal = decodeJArray >>> map (mapMaybe (decodeHasuraLiberal >>> hush))
else instance decodeHasuraLiberalMaybe :: DecodeHasuraLiberal a => DecodeHasuraLiberal (Maybe a) where
  decodeHasuraLiberal json = (Just <$> decodeHasuraLiberal json) <|> pure Nothing
else instance decodeRecord ::
  ( DecodeHasuraLiberalFields row list
  , RL.RowToList row list
  ) =>
  DecodeHasuraLiberal (Record row) where
  decodeHasuraLiberal json = case toObject json of
    Just object -> decodeHasuraLiberalFields object (Proxy :: Proxy list)
    Nothing -> Left $ TypeMismatch "Object"
else instance decodeOther :: DecodeHasura a => DecodeHasuraLiberal a where
  decodeHasuraLiberal = decodeHasura

class DecodeHasuraLiberalFields (row :: Row Type) (list :: RL.RowList Type) | list -> row where
  decodeHasuraLiberalFields :: forall proxy. Object Json -> proxy list -> Either JsonDecodeError (Record row)

instance decodeHasuraLiberalFieldsNil :: DecodeHasuraLiberalFields () RL.Nil where
  decodeHasuraLiberalFields _ _ = Right {}

instance decodeHasuraLiberalFieldsCons ::
  ( DecodeHasuraLiberalField value
  , DecodeHasuraLiberalFields rowTail tail
  , IsSymbol field
  , Row.Cons field value rowTail row
  , Row.Lacks field rowTail
  ) =>
  DecodeHasuraLiberalFields row (RL.Cons field value tail) where
  decodeHasuraLiberalFields object _ = do
    let
      _field = Proxy :: Proxy field

      fieldName = reflectSymbol _field

      fieldValue = Object.lookup fieldName object
    case decodeHasuraLiberalField fieldValue of
      Just fieldVal -> do
        val <- lmap (AtKey fieldName) fieldVal
        rest <- decodeHasuraLiberalFields object (Proxy :: Proxy tail)
        Right $ Record.insert _field val rest
      Nothing -> Left $ AtKey fieldName MissingValue

class DecodeHasuraLiberalField a where
  decodeHasuraLiberalField :: Maybe Json -> Maybe (Either JsonDecodeError a)

instance decodeFieldMaybe ::
  DecodeHasuraLiberal a =>
  DecodeHasuraLiberalField (Maybe a) where
  decodeHasuraLiberalField Nothing = Just $ Right Nothing
  decodeHasuraLiberalField (Just j) = Just $ decodeHasuraLiberal j
else instance decodeFieldId ::
  DecodeHasuraLiberal a =>
  DecodeHasuraLiberalField a where
  decodeHasuraLiberalField j = decodeHasuraLiberal <$> j

maybeFail :: forall a. String -> Maybe a -> Parser a
maybeFail str = maybe (P.fail str) pure
