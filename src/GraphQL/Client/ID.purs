module GraphQL.Client.ID where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Data.Argonaut.Encode (class EncodeJson)
import Data.Generic.Rep (class Generic)
import Data.Newtype (class Newtype)
import GraphQL.Client.Args (class ArgGql)
import GraphQL.Client.ToGqlString (class GqlArgString)
import GraphQL.Hasura.Decode (class DecodeHasura)
import GraphQL.Hasura.Encode (class EncodeHasura)

newtype ID = ID String

derive instance eqID :: Eq ID
derive instance ordID :: Ord ID 
derive instance newtypeID :: Newtype ID _
derive instance genericID :: Generic ID _
derive newtype instance showID :: Show ID 
derive newtype instance gqlArgStringID :: GqlArgString ID
derive newtype instance decodeHasuraID :: DecodeHasura ID
derive newtype instance encodeHasuraID :: EncodeHasura ID
derive newtype instance decodeJsonID :: DecodeJson ID
derive newtype instance encodeJsonID :: EncodeJson ID
instance argToGqlID :: ArgGql ID ID
