module GraphQL.Client.CodeGen.Types
  ( FileToWrite
  , FilesToWrite
  , GqlEnum
  , GqlInput
  , GqlPath(..)
  , InputOptions
  , JsResult
  , PursGql
  , defaultInputOptions
  ) where

import Prelude hiding (between)

import Control.Promise (Promise)
import Data.Argonaut.Core (Json)
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff)

type InputOptions =
  { gqlScalarsToPursTypes :: Map String String
  , externalTypes ::
      Map String
        { moduleName :: String
        , typeName :: String
        }
  -- | override types by typename then fieldname
  , fieldTypeOverrides ::
      Map String
        ( Map String
            { moduleName :: String
            , typeName :: String
            }
        )
  -- | override nullability by typename then fieldname
  , nullableOverrides :: Map String (Map String Boolean)
  -- | override arg types by typename then fieldname then arg name
  , argTypeOverrides ::
      Map String
        ( Map String
            ( Map String
                { moduleName :: String
                , typeName :: String
                }
            )
        )
  , idImport ::
      Maybe
        { moduleName :: String
        , typeName :: String
        }
  , dir :: String
  , useNewtypesForRecords :: Boolean
  , modulePath :: Array String
  , enumImports :: Array String
  , customEnumCode :: { name :: String, values :: Array { gql :: String, transformed :: String } } -> String
  , cache ::
      Maybe
        { get :: String -> Aff (Maybe Json)
        , set :: { key :: String, val :: Json } -> Aff Unit
        }
  , enumValueNameTransform :: Maybe (String -> String)
  }

data GqlPath = SelectionSet GqlPath | Args GqlPath | Node String

defaultInputOptions :: InputOptions
defaultInputOptions =
  { externalTypes: Map.empty
  , gqlScalarsToPursTypes: Map.empty
  , fieldTypeOverrides: Map.empty
  , nullableOverrides: Map.empty
  , argTypeOverrides: Map.empty
  , idImport: Nothing
  , dir: ""
  , useNewtypesForRecords: true
  , modulePath: []
  , enumImports: []
  , customEnumCode: const ""
  , cache: Nothing
  , enumValueNameTransform: Nothing
  }

type GqlInput = { schema :: Json, moduleName :: String }

type GqlEnum = { name :: String, description :: Maybe String, values :: Array String }

type PursGql
  = { moduleName :: String
    , mainSchemaCode :: String
    , directives :: String
    , symbols :: Array String
    , enums :: Array GqlEnum
    }

type JsResult = Effect
  ( Promise
      { argsTypeError :: String
      , parseError :: String
      , result :: FilesToWrite
      }
  )

type FileToWrite =
  { path :: String
  , code :: String
  }
type FilesToWrite
  = { schemas :: Array FileToWrite
    , directives :: Array FileToWrite
    , enums :: Array FileToWrite
    , symbols :: FileToWrite
    }


