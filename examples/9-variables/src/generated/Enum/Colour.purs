module Generated.Gql.Enum.Colour where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError(..), decodeJson)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (Either(..))
import Data.Function (on)
import GraphQL.Client.Args (class ArgGql)
import GraphQL.Client.ToGqlString (class GqlArgString)
import GraphQL.Hasura.Decode (class DecodeHasura)
import GraphQL.Hasura.Encode (class EncodeHasura)
import GraphQL.Client.Variables.TypeName (class VarTypeName)



 -- | colour description
data Colour 
  = RED
  | GREEN
  | BLUE
  | Yellow


instance eqColour :: Eq Colour where 
  eq = eq `on` show

instance ordColour :: Ord Colour where
  compare = compare `on` show

instance argToGqlColour :: ArgGql Colour Colour

instance gqlArgStringColour :: GqlArgString Colour where
  toGqlArgStringImpl = show

instance decodeJsonColour :: DecodeJson Colour where
  decodeJson = decodeJson >=> case _ of 
    "RED" -> pure RED
    "GREEN" -> pure GREEN
    "BLUE" -> pure BLUE
    "yellow" -> pure Yellow
    s -> Left $ TypeMismatch $ "Not a Colour: " <> s

instance encodeJsonColour :: EncodeJson Colour where 
  encodeJson = show >>> encodeJson

instance decdoeHasuraColour :: DecodeHasura Colour where 
  decodeHasura = decodeJson

instance encodeHasuraColour :: EncodeHasura Colour where 
  encodeHasura = encodeJson

instance varTypeNameColour :: VarTypeName Colour where 
  varTypeName _ = "Colour!"

instance showColour :: Show Colour where
  show a = case a of 
    RED -> "RED"
    GREEN -> "GREEN"
    BLUE -> "BLUE"
    Yellow -> "yellow"
