module GraphQL.Hasura.Array where

import Prelude

import Data.Newtype (class Newtype, unwrap)
import Data.String (joinWith)
import GraphQL.Client.Args (class ArgGql)
import GraphQL.Client.ToGqlString (class GqlArgString)
import GraphQL.Client.Variables.TypeName (class VarTypeName)
import GraphQL.Hasura.Decode (class DecodeHasura)
import GraphQL.Hasura.Encode (class EncodeHasura)


-- | A purescript type that maps to the hasura graphql `_text` type
newtype Hasura_text = Hasura_text (Array String)

derive instance Newtype Hasura_text _

derive newtype instance EncodeHasura Hasura_text

derive newtype instance DecodeHasura Hasura_text

derive newtype instance Eq Hasura_text

instance Show Hasura_text where 
  show a = "(Hasura_text " <> show a <> ")"

instance GqlArgString Hasura_text where 
  toGqlArgStringImpl = unwrap >>> map show >>> joinWith "," >>> (\s -> "{" <> s <> "}") >>> show

instance ArgGql Hasura_text Hasura_text

instance VarTypeName Hasura_text where 
  varTypeName _ = "_text"
