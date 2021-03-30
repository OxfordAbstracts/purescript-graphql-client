-- | Schema codegen functions that are designed to be called by Javascript code
module GraphQL.Client.CodeGen.Js where

import Prelude

import Control.Promise (Promise, fromAff, toAff)
import Data.Argonaut.Core (Json)
import Data.Either (either)
import Data.Function.Uncurried (Fn2, mkFn2)
import Data.Map as Map
import Data.Maybe (fromMaybe)
import Data.Nullable (Nullable, toMaybe)
import Foreign.Object (Object)
import GraphQL.Client.CodeGen.Schema (schemasFromGqlToPurs)
import GraphQL.Client.CodeGen.Types (GqlInput, JsResult)
import Text.Parsing.Parser (parseErrorMessage)

schemasFromGqlToPursJs :: Fn2 InputOptionsJs (Array GqlInput) JsResult
schemasFromGqlToPursJs = mkFn2 go
  where 
  go ::  InputOptionsJs -> Array GqlInput -> JsResult
  go optsJs =
    schemasFromGqlToPurs opts
      >>> map (either getError ({ result: _, parseError: "", argsTypeError: "" }))
      >>> fromAff
    where
    opts =
      { externalTypes: Map.fromFoldableWithIndex (defNull mempty optsJs.externalTypes)
      , fieldTypeOverrides: Map.fromFoldableWithIndex <$> Map.fromFoldableWithIndex (defNull mempty optsJs.fieldTypeOverrides)
      , dir: defNull "" optsJs.dir
      , modulePath: defNull [] optsJs.modulePath
      , isHasura: defNull false optsJs.isHasura
      , useNewtypesForRecords: defNull true optsJs.useNewtypesForRecords
      , enumImports: defNull [] optsJs.enumImports
      , customEnumCode: defNull (const "") optsJs.customEnumCode
      , cache:
          toMaybe optsJs.cache
            <#> \{ get, set } ->
                { get: map (toAff >>> map toMaybe) get
                , set: map toAff set
                }
      }

    getError err =
      { parseError: parseErrorMessage err
      , argsTypeError: mempty
      , result: mempty
      }

defNull :: forall a. a -> Nullable a -> a
defNull a = fromMaybe a <<< toMaybe

type InputOptionsJs
  = { externalTypes ::
        Nullable
          ( Object
              { moduleName :: String
              , typeName :: String
              }
          )
    , fieldTypeOverrides ::
        Nullable
          ( Object
              ( Object
                  { moduleName :: String
                  , typeName :: String
                  }
              )
          )
    , dir :: Nullable String
    , modulePath :: Nullable (Array String)
    , isHasura :: Nullable Boolean
    , useNewtypesForRecords :: Nullable Boolean
    , enumImports :: Nullable (Array String) 
    , customEnumCode :: Nullable ({name :: String, values :: Array String} ->  String)
    , cache ::
        Nullable
          { get :: String -> Promise (Nullable Json)
          , set :: { key :: String, val :: Json } -> Promise Unit
          }
    }
