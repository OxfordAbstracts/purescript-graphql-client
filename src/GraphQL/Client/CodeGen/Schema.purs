module GraphQL.Client.CodeGen.Schema where

import Prelude
import Substitute (substitute)
import Data.Foldable (intercalate)

template ::
  { name :: String
  , enums :: Array String
  , mainSchemaCode :: String
  } ->
  String
template { name, enums, mainSchemaCode } =
  substitute
    """module GeneratedGql.Schema.${name} where

import Data.Argonaut.Core (Json)
import Data.Date (Date)
import Data.DateTime (DateTime)
import Data.Time (Time)
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
    , enumImports:
        enums 
          <#> (\v -> substitute "import GeneratedGql.Enums.${v} (${v})" { v })
          # intercalate "\n"
    , mainSchemaCode
    }
