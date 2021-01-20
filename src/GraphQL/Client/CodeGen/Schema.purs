module GraphQL.Client.CodeGen.Schema where

import Prelude
import Substitute (substitute)
import Data.Foldable (intercalate)

template ::
  { name :: String
  , enums :: Array String
  , mainSchemaCode :: String
  , modulePrefix :: String 
  } ->
  String
template { name, enums, mainSchemaCode, modulePrefix } =
  substitute
    """module ${modulePrefix}Schema.${name} where

import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import GraphQL.Client.Args (class ArgGql, class RecordArg, type (==>), NotNull)
${enumImports}

${mainSchemaCode}
"""
    substVals
  where
  substVals =
    { name
    , modulePrefix
    , enumImports:
        enums 
          <#> (\v -> substitute "import ${modulePrefix}Enums.${v} (${v})" { v, modulePrefix })
          # intercalate "\n"
    , mainSchemaCode
    }
