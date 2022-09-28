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
import Foreign.Object as Object
import GraphQL.Client.CodeGen.Schema (schemasFromGqlToPurs)
import GraphQL.Client.CodeGen.Types (GqlInput, JsResult)
import Parsing (parseErrorMessage)

schemasFromGqlToPursJs :: Fn2 InputOptionsJs (Array GqlInput) JsResult
schemasFromGqlToPursJs = mkFn2 go
  where
  go :: InputOptionsJs -> Array GqlInput -> JsResult
  go optsJs =
    schemasFromGqlToPurs opts
      >>> map (either getError ({ result: _, parseError: "", argsTypeError: "" }))
      >>> fromAff
    where
    opts =
      { externalTypes: Map.fromFoldableWithIndex (fromNullable mempty optsJs.externalTypes)
      , fieldTypeOverrides: Map.fromFoldableWithIndex <$> Map.fromFoldableWithIndex (fromNullable mempty optsJs.fieldTypeOverrides)
      , gqlScalarsToPursTypes: Map.fromFoldableWithIndex (fromNullable mempty optsJs.gqlScalarsToPursTypes)
      , nullableOverrides: Map.fromFoldableWithIndex <$> Map.fromFoldableWithIndex (fromNullable Object.empty optsJs.nullableOverrides)
      , dir: fromNullable "" optsJs.dir
      , modulePath: fromNullable [] optsJs.modulePath
      , isHasura: fromNullable false optsJs.isHasura
      , useNewtypesForRecords: fromNullable true optsJs.useNewtypesForRecords
      , enumImports: fromNullable [] optsJs.enumImports
      , customEnumCode: fromNullable (const "") optsJs.customEnumCode
      , idImport: toMaybe optsJs.idImport
      , enumValueNameTransform: toMaybe optsJs.enumValueNameTransform
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

fromNullable :: forall a. a -> Nullable a -> a
fromNullable a = fromMaybe a <<< toMaybe

type InputOptionsJs
  = { gqlScalarsToPursTypes :: Nullable (Object String)
    , externalTypes ::
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
    , nullableOverrides :: Nullable (Object (Object Boolean))
    , idImport ::
        Nullable
          { moduleName :: String
          , typeName :: String
          }
    , dir :: Nullable String
    , modulePath :: Nullable (Array String)
    , isHasura :: Nullable Boolean
    , useNewtypesForRecords :: Nullable Boolean
    , enumImports :: Nullable (Array String)
    , customEnumCode :: Nullable ({ name :: String, values :: Array { gql :: String, transformed :: String} } -> String)
    , cache ::
        Nullable
          { get :: String -> Promise (Nullable Json)
          , set :: { key :: String, val :: Json } -> Promise Unit
          }
    , enumValueNameTransform :: Nullable (String -> String)
    }
