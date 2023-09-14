module GraphQL.Client.Args.AllowedMismatch where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Data.Argonaut.Encode (class EncodeJson)
import Data.Newtype (class Newtype)
import GraphQL.Client.ToGqlString (class GqlArgString)
import GraphQL.Hasura.Decode (class DecodeHasura)
import GraphQL.Hasura.Encode (class EncodeHasura)


-- | Allow a type does not match the schema to be used in a query as an argument.
newtype AllowedMismatch :: forall k. k -> Type -> Type
newtype AllowedMismatch schemaType arg = AllowedMismatch arg


derive instance Newtype (AllowedMismatch schemaType arg) _

derive newtype instance DecodeJson arg => DecodeJson (AllowedMismatch schemaType arg)
derive newtype instance EncodeJson arg => EncodeJson (AllowedMismatch schemaType arg)
derive newtype instance DecodeHasura arg => DecodeHasura (AllowedMismatch schemaType arg)
derive newtype instance EncodeHasura arg => EncodeHasura (AllowedMismatch schemaType arg)
derive newtype instance Eq arg => Eq (AllowedMismatch schemaType arg)
derive newtype instance GqlArgString arg => GqlArgString (AllowedMismatch schemaType arg)


