module GraphQL.Client.CodeGen.Template.Enum where

import Prelude

import Data.Foldable (intercalate)

template ::
  String ->
  { name :: String
  , values :: Array String
  } ->
  String
template modulePrefix { name, values } =
    """module """ <> modulePrefix <> """Enum.""" <> name <> """ where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError(..), decodeJson)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (Either(..))
import Data.Function (on)
import Data.String.Extra (snakeCase)
import GraphQL.Client.Args (class ArgGql)
import GraphQL.Client.ToGqlString (class GqlArgString)

data """ <> name <> """ 
  = """ <> enumCtrs <> """

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

instance show""" <> name <> """ :: Show """ <> name <> """ where
  show a = case a of 
""" <> showMember <> """
"""
  where
    enumCtrs = intercalate "\n  | " values
    decodeMember =
      values
        <#> (\v -> "    \"" <> v <> "\" -> pure " <> v <> "")
        # intercalate "\n"
    showMember =
      values
        <#> (\v -> "    " <> v <> " -> \"" <> v <> "\"")
        # intercalate "\n"
    
