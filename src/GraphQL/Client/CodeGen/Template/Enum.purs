module GraphQL.Client.CodeGen.Template.Enum where

import Prelude

import Data.Foldable (intercalate)
import Data.String (toUpper)
import Data.String as String

template ::
  String ->
  { name :: String
  , values :: Array String
  , imports :: Array String
  , customCode :: {name :: String, values :: Array String} ->  String 
  } ->
  String
template modulePrefix { name, values, imports, customCode } =
    """module """ <> modulePrefix <> """Enum.""" <> name <> """ where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError(..), decodeJson)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (Either(..))
import Data.Function (on)
import GraphQL.Client.Args (class ArgGql)
import GraphQL.Client.ToGqlString (class GqlArgString)
import GraphQL.Hasura.Decode (class DecodeHasura)
import GraphQL.Hasura.Encode (class EncodeHasura)
""" <> intercalate "\n" imports <> """

data """ <> name <> """ 
  = """ <> enumCtrs <> """
""" <> customCode {name, values} <> """

instance eq""" <> name <> """ :: Eq """ <> name <> """ where 
  eq = eq `on` show

instance ord""" <> name <> """ :: Ord """ <> name <> """ where
  compare = compare `on` show

instance argToGql""" <> name <> """ :: ArgGql """ <> name <> """ """ <> name <> """

instance gqlArgString""" <> name <> """ :: GqlArgString """ <> name <> """ where
  toGqlArgStringImpl = show

instance decodeJson""" <> name <> """ :: DecodeJson """ <> name <> """ where
  decodeJson = decodeJson >=> case _ of 
""" <> decodeMember <> """
    s -> Left $ TypeMismatch $ "Not a """ <> name <> """: " <> s

instance encodeJson""" <> name <> """ :: EncodeJson """ <> name <> """ where 
  encodeJson = show >>> encodeJson

instance decdoeHasura""" <> name <> """ :: DecodeHasura """ <> name <> """ where 
  decodeHasura = decodeJson

instance encodeHasura""" <> name <> """ :: EncodeHasura """ <> name <> """ where 
  encodeHasura = encodeJson

instance show""" <> name <> """ :: Show """ <> name <> """ where
  show a = case a of 
""" <> showMember <> """
"""
  where
    enumCtrs = intercalate "\n  | " (map upper1st values)
    decodeMember =
      values
        <#> (\v -> "    \"" <> v <> "\" -> pure " <> upper1st v <> "")
        # intercalate "\n"
    showMember =
      values
        <#> (\v -> "    " <> upper1st v <> " -> \"" <> v <> "\"")
        # intercalate "\n"
    
upper1st :: String -> String
upper1st s = toUpper (String.take 1 s) <> String.drop 1 s