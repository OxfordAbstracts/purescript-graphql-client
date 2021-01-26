-- | Schema codegen functions that are designed to be called by Javascript code
module GraphQL.Client.CodeGen.Js where

import Prelude

import Control.Promise (Promise, fromAff, toAff)
import Data.Argonaut.Core (Json)
import Data.Either (either)
import Data.Map as Map
import Data.Maybe (fromMaybe)
import Data.Nullable (Nullable, toMaybe)
import Foreign.Object (Object)
import GraphQL.Client.CodeGen.SchemaFromGqlToPurs (schemasFromGqlToPurs)
import GraphQL.Client.CodeGen.Types (GqlInput, JsResult)
import Text.Parsing.Parser (parseErrorMessage)

schemasFromGqlToPursJs :: InputOptionsJs -> Array GqlInput -> JsResult
schemasFromGqlToPursJs optsJs =
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
    , cache:
        toMaybe optsJs.cache <#> \{ get, set } -> 
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
    , cache ::
        Nullable
          { get :: String -> Promise (Nullable Json)
          , set :: { key :: String, val :: Json } -> Promise Unit
          }
    }