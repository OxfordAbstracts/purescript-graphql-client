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
    """module """ <> vals.modulePrefix <> """Enum.""" <> vals.name <> """ where

import Prelude

import Foreign.Generic.Class (class Decode, decode)
import Data.Function (on)
import Data.String.Extra (snakeCase)
import Foreign (ForeignError(..), fail)
import GraphQL.Client.Args (class ArgGql)
import GraphQL.Client.ToGqlString (class GqlArgString)

data """ <> vals.name <> """ 
  = """ <> vals.enumCtrs <> """

instance eq""" <> vals.name <> """ :: Eq """ <> vals.name <> """ where 
  eq = eq `on` show

instance ord""" <> vals.name <> """ :: Ord """ <> vals.name <> """ where
  compare = compare `on` show

instance argToGql""" <> vals.name <> """ :: ArgGql """ <> vals.name <> """ """ <> vals.name <> """

instance gqlArgString""" <> vals.name <> """ :: GqlArgString """ <> vals.name <> """ where
  toGqlArgStringImpl a = snakeCase (show a)

instance decode""" <> vals.name <> """ :: Decode """ <> vals.name <> """ where
  decode a = decode a >>= case _ of 
    """ <> vals.decodeMember <> """
    s -> fail $ ForeignError $ "Not a """ <> vals.name <> """: " <> s

instance show""" <> vals.name <> """ :: Show """ <> vals.name <> """ where
  show a = case a of 
    """ <> vals.showMember <> """
"""
  where
  vals =
    { name
    , modulePrefix
    , enumCtrs: intercalate "\n  | " values
    , decodeMember:
        values
          <#> (\v -> "\"" <> v <> "\" -> pure " <> v <> "")
          # intercalate "\n    "
    , showMember:
        values
          <#> (\v -> "" <> v <> " -> \"" <> v <> "\"")
          # intercalate "\n    "
    }
