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
import GraphQL.Client.CodeGen.Types (GqlInput, JsResult, QualifiedType)
import Parsing (parseErrorMessage)
import Untagged.Union (type (|+|), toEither1)

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
      { gqlToPursTypes: Map.fromFoldableWithIndex (fromQualifiedTypeJs <$> fromNullable Object.empty optsJs.gqlToPursTypes)
      , fieldTypeOverrides: Map.fromFoldableWithIndex <$> Map.fromFoldableWithIndex (map fromQualifiedTypeJs <$> fromNullable Object.empty optsJs.fieldTypeOverrides)
      , argTypeOverrides: (map (map fromQualifiedTypeJs <<< Map.fromFoldableWithIndex) <<< Map.fromFoldableWithIndex) <$> Map.fromFoldableWithIndex (fromNullable Object.empty optsJs.argTypeOverrides)
      , nullableOverrides: Map.fromFoldableWithIndex <$> Map.fromFoldableWithIndex (fromNullable Object.empty optsJs.nullableOverrides)
      , dir: fromNullable "" optsJs.dir
      , modulePath: fromNullable [] optsJs.modulePath
      , useNewtypesForRecords: fromNullable true optsJs.useNewtypesForRecords
      , enumImports: fromNullable [] optsJs.enumImports
      , customEnumCode: fromNullable (const "") optsJs.customEnumCode
      , idImport: map fromQualifiedTypeJs $ toMaybe optsJs.idImport
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

fromQualifiedTypeJs :: QualifiedTypeJs -> QualifiedType
fromQualifiedTypeJs = toEither1 >>> either identity { typeName: _, moduleName: "" }

type InputOptionsJs =
  { gqlToPursTypes ::
      Nullable
        ( Object QualifiedTypeJs
        )
  , fieldTypeOverrides ::
      Nullable
        ( Object
            ( Object QualifiedTypeJs
            )
        )
  , argTypeOverrides ::
      Nullable
        ( Object
            ( Object
                ( Object QualifiedTypeJs
                )
            )
        )
  , nullableOverrides :: Nullable (Object (Object Boolean))
  , idImport :: Nullable QualifiedTypeJs
  , dir :: Nullable String
  , modulePath :: Nullable (Array String)
  , useNewtypesForRecords :: Nullable Boolean
  , enumImports :: Nullable (Array String)
  , customEnumCode :: Nullable ({ name :: String, values :: Array { gql :: String, transformed :: String } } -> String)
  , cache ::
      Nullable
        { get :: String -> Promise (Nullable Json)
        , set :: { key :: String, val :: Json } -> Promise Unit
        }
  , enumValueNameTransform :: Nullable (String -> String)
  }

type QualifiedTypeJs = QualifiedType |+| String