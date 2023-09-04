module GraphQL.Client.CodeGen.Template.Schema where

import Prelude

import Data.Foldable (intercalate)
import Data.Maybe (Maybe, maybe)
import Data.Monoid (guard)
import Data.String (Pattern(..), contains)
import Partial.Unsafe (unsafePartial)
import PureScript.CST.Types (Declaration)
import Tidy.Codegen (declImport, importClass, importType, module_, printModule)

template
  :: { name :: String
     , enums :: Array String
     , mainSchemaCode :: String
     , modulePrefix :: String
     , idImport :: Maybe { moduleName :: String, typeName :: String }
     }
  -> String
template { name, enums, idImport, modulePrefix, mainSchemaCode } = mainSchemaCode

--     """module """ <> modulePrefix <> """Schema.""" <> name <> """ where

-- import Data.Maybe (Maybe)
-- import Data.Newtype (class Newtype)
-- import GraphQL.Client.Args (class ArgGql, class RecordArg, NotNull)
-- """ <> guard (contains (Pattern "GqlUnion") declarations) "import GraphQL.Client.Union (GqlUnion)" <> """
-- import """ <> maybe defaultIdImport getImport idImport <> """
-- """ <> enumImports <> """

-- """ <> declarations <> """
-- """
--   where
--   enumImports =
--     enums 
--       <#> (\v -> "import " <> modulePrefix <> """Schema.""" <> name <> ".Enum."<> v <> " ("<> v <> ")")
--       # intercalate "\n"

--   getImport {moduleName, typeName} = 
--     moduleName <> " (" <> typeName <> ")"

--   defaultIdImport = "GraphQL.Client.ID (ID)"
