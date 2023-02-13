module GraphQL.Hasura.DecodeLiberal where

import Prelude

import Control.Alt ((<|>))
import Data.Argonaut.Core (Json, toObject)
import Data.Argonaut.Decode (JsonDecodeError(..), decodeJson)
import Data.Argonaut.Decode.Decoders (decodeJArray)
import Data.Array (mapMaybe)
import Data.Bifunctor (lmap)
import Data.Either (Either(..), hush)
import Data.Maybe (Maybe(..), maybe)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Data.Traversable (traverse)
import Foreign.Object (Object)
import Foreign.Object as Object
import GraphQL.Hasura.Decode (class DecodeHasura, decodeHasura)
import Prim.Row as Row
import Prim.RowList as RL
import Record as Record
import StringParser (Parser)
import StringParser as P
import Type.Proxy (Proxy(..))

type DecodeLiberalOptions
  = { strict :: Boolean }

-- | Decode json, with silent errors when possible
class DecodeHasuraLiberal a where
  decodeHasuraLiberalImpl :: DecodeLiberalOptions -> Json -> Either JsonDecodeError a

decodeLiberal :: forall a. DecodeHasuraLiberal a => Json -> Either JsonDecodeError a
decodeLiberal = decodeHasuraLiberalImpl { strict: false }

decodeStrict :: forall a. DecodeHasuraLiberal a => Json -> Either JsonDecodeError a
decodeStrict = decodeHasuraLiberalImpl { strict: true }

instance decodeHasuraLiberalImplArray :: DecodeHasuraLiberal a => DecodeHasuraLiberal (Array a) where
  decodeHasuraLiberalImpl opts j =
    if opts.strict then
      strict j
    else
      liberal j
    where
    liberal = decodeJArray >>> map (mapMaybe (decodeHasuraLiberalImpl opts >>> hush))

    strict json = decodeJArray json >>= traverse (decodeHasuraLiberalImpl opts)
else instance decodeHasuraLiberalImplMaybe :: DecodeHasuraLiberal a => DecodeHasuraLiberal (Maybe a) where
  decodeHasuraLiberalImpl opts j =
    if opts.strict then
      strict j
    else
      liberal j
    where
    liberal json = (Just <$> decodeHasuraLiberalImpl opts json) <|> pure Nothing

    strict = decodeJson >=> traverse (decodeHasuraLiberalImpl opts)
else instance decodeRecord ::
  ( DecodeHasuraLiberalFields row list
  , RL.RowToList row list
  ) =>
  DecodeHasuraLiberal (Record row) where
  decodeHasuraLiberalImpl opts json = case toObject json of
    Just object -> decodeHasuraLiberalImplFields opts object (Proxy :: Proxy list)
    Nothing -> Left $ TypeMismatch "Object"
else instance decodeOther :: DecodeHasura a => DecodeHasuraLiberal a where
  decodeHasuraLiberalImpl _ = decodeHasura

class DecodeHasuraLiberalFields (row :: Row Type) (list :: RL.RowList Type) | list -> row where
  decodeHasuraLiberalImplFields :: forall proxy. DecodeLiberalOptions -> Object Json -> proxy list -> Either JsonDecodeError (Record row)

instance decodeHasuraLiberalImplFieldsNil :: DecodeHasuraLiberalFields () RL.Nil where
  decodeHasuraLiberalImplFields _ _ _ = Right {}

instance decodeHasuraLiberalImplFieldsCons ::
  ( DecodeHasuraLiberalField value
  , DecodeHasuraLiberalFields rowTail tail
  , IsSymbol field
  , Row.Cons field value rowTail row
  , Row.Lacks field rowTail
  ) =>
  DecodeHasuraLiberalFields row (RL.Cons field value tail) where
  decodeHasuraLiberalImplFields opts object _ = do
    let
      _field = Proxy :: Proxy field

      fieldName = reflectSymbol _field

      fieldValue = Object.lookup fieldName object
    case decodeHasuraLiberalImplField opts fieldValue of
      Just fieldVal -> do
        val <- lmap (AtKey fieldName) fieldVal
        rest <- decodeHasuraLiberalImplFields opts object (Proxy :: Proxy tail)
        Right $ Record.insert _field val rest
      Nothing -> Left $ AtKey fieldName MissingValue

class DecodeHasuraLiberalField a where
  decodeHasuraLiberalImplField :: DecodeLiberalOptions -> Maybe Json -> Maybe (Either JsonDecodeError a)

instance decodeFieldMaybe ::
  DecodeHasuraLiberal a =>
  DecodeHasuraLiberalField (Maybe a) where
  decodeHasuraLiberalImplField _ Nothing = Just $ Right Nothing
  decodeHasuraLiberalImplField opts (Just j) = Just $ decodeHasuraLiberalImpl opts j
else instance decodeFieldId ::
  DecodeHasuraLiberal a =>
  DecodeHasuraLiberalField a where
  decodeHasuraLiberalImplField opts j = decodeHasuraLiberalImpl opts <$> j

maybeFail :: forall a. String -> Maybe a -> Parser a
maybeFail str = maybe (P.fail str) pure
