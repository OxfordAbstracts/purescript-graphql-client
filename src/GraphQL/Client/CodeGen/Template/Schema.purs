module GraphQL.Client.CodeGen.Template.Schema where

import Prelude

import Data.Foldable (intercalate)

template ::
  { name :: String
  , enums :: Array String
  , mainSchemaCode :: String
  , modulePrefix :: String 
  } ->
  String
template { name, enums, mainSchemaCode, modulePrefix } =
    """module """ <> vals.modulePrefix <> """Schema.""" <> vals.name <> """ where

import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import GraphQL.Client.Args (class ArgGql, class RecordArg, type (==>), NotNull)
"""<> vals.enumImports <> """

""" <> vals.mainSchemaCode <> """
"""
  where
  vals =
    { name
    , modulePrefix
    , enumImports:
        enums 
          <#> (\v -> "import " <> vals.modulePrefix <> "Enum."<> v <> " ("<> v <> ")")
          # intercalate "\n"
    , mainSchemaCode
    }
