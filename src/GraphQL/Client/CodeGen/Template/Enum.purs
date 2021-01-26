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

import Foreign.Generic.Class (class Decode, decode)
import Data.Function (on)
import Data.String.Extra (snakeCase)
import Foreign (ForeignError(..), fail)
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
  toGqlArgStringImpl a = snakeCase (show a)

instance decode""" <> name <> """ :: Decode """ <> name <> """ where
  decode a = decode a >>= case _ of 
""" <> decodeMember <> """
    s -> fail $ ForeignError $ "Not a """ <> name <> """: " <> s

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
    
