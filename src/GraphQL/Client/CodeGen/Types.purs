module GraphQL.Client.CodeGen.Types
  ( InputOptions
  , PursGql
  , GqlEnum
  , GqlInput
  , FileToWrite
  , FilesToWrite
  , JsResult
  ) where

import Prelude hiding (between)

import Control.Promise (Promise)
import Data.Argonaut.Core (Json)
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff)

type InputOptions
  = { externalTypes ::
        Map String
          { moduleName :: String
          , typeName :: String
          }
    , fieldTypeOverrides ::
        Map String
          ( Map String
              { moduleName :: String
              , typeName :: String
              }
          )
    , dir :: String
    , isHasura :: Boolean
    , useNewtypesForRecords :: Boolean 
    , modulePath :: Array String
    , cache ::
        Maybe
          { get :: String -> Aff (Maybe Json)
          , set :: { key :: String, val :: Json } -> Aff Unit
          }
    }

defaultInputOptions :: InputOptions
defaultInputOptions =
  { externalTypes: mempty
  , fieldTypeOverrides: mempty
  , dir: ""
  , isHasura: false
  , useNewtypesForRecords: true
  , modulePath: []
  , cache: Nothing
  }



type GqlInput
  = { schema :: String, moduleName :: String }

type PursGql
  = { moduleName :: String
    , mainSchemaCode :: String
    , symbols :: Array String
    , enums :: Array GqlEnum
    }

type GqlEnum
  = { name :: String, values :: Array String }

type FilesToWrite
  = { schemas :: Array FileToWrite
    , enums :: Array FileToWrite
    , symbols :: FileToWrite
    }

type JsResult
  = Effect
      ( Promise
          { argsTypeError :: String
          , parseError :: String
          , result :: FilesToWrite
          }
      )

type FileToWrite
  = { path :: String
    , code :: String
    }
