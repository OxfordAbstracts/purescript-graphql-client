module GraphQL.Hasura.Array where

import Prelude

import Control.Alt ((<|>))
import Data.Argonaut.Core (stringify)
import Data.Argonaut.Decode (JsonDecodeError, decodeJson, parseJson)
import Data.Argonaut.Encode (encodeJson)
import Data.Either (Either)
import Data.Newtype (class Newtype, unwrap)
import Data.String.CodeUnits as String
import GraphQL.Client.Args (class ArgGql)
import GraphQL.Client.ToGqlString (class GqlArgString)
import GraphQL.Client.Variables.TypeName (class VarTypeName)
import GraphQL.Hasura.Decode (class DecodeHasura, decodeHasura)
import GraphQL.Hasura.Encode (class EncodeHasura, encodeHasura)
import Test.QuickCheck (class Arbitrary)

-- | A purescript type that maps to the hasura graphql `_text` type
newtype Hasura_text = Hasura_text (Array String)

derive instance Newtype Hasura_text _

instance EncodeHasura Hasura_text where
  encodeHasura a = encodeHasura $ toHasuraArrayEncoding a

instance DecodeHasura Hasura_text where
  decodeHasura a =
    (Hasura_text <$> decodeHasura a)
      <|>
        (Hasura_text <$> (toJsonArr =<< decodeJson a))
    where
    toJsonArr :: String -> Either JsonDecodeError (Array String)
    toJsonArr s = decodeJson =<< (parseJson ("[" <> String.slice 1 (-1) s <> "]"))

derive newtype instance Eq Hasura_text

derive newtype instance Arbitrary Hasura_text

instance Show Hasura_text where
  show (Hasura_text a) = "(Hasura_text " <> show a <> ")"

instance GqlArgString Hasura_text where
  toGqlArgStringImpl = toHasuraArrayEncoding >>> show

toHasuraArrayEncoding :: Hasura_text -> String
toHasuraArrayEncoding =
  unwrap
    >>> encodeJson
    >>> stringify
    >>> String.slice 1 (-1)
    >>> (\a -> "{" <> a <> "}")

instance ArgGql Hasura_text Hasura_text

instance VarTypeName Hasura_text where
  varTypeName _ = "_text"
