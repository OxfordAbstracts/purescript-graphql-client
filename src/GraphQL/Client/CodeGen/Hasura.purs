module GraphQL.Client.CodeGen.Hasura where

import Prelude

import Data.FunctorWithIndex (mapWithIndex)
import Data.Tuple (Tuple(..))
import Foreign.Object as Object
import GraphQL.Client.CodeGen.SchemaFromGqlToPurs (FilesToWrite, GqlInput, InputOptionsJs, schemasFromGqlToPursJs)

schemaFromGqlToPursJsHasura :: InputOptionsJs -> Array GqlInput -> { parseError :: String, result :: FilesToWrite }
schemaFromGqlToPursJsHasura opts =
  schemasFromGqlToPursJs
    opts
      { fieldTypeOverrides = Object.unions $ opts.fieldTypeOverrides # mapWithIndex \gqlObjectName obj -> 
          Object.fromFoldable 
            [ Tuple gqlObjectName obj
            , Tuple (gqlObjectName <> "InsertInput") obj
            , Tuple (gqlObjectName <> "MinFields") obj
            , Tuple (gqlObjectName <> "MaxFields") obj
            , Tuple (gqlObjectName <> "SetInput") obj
            , Tuple (gqlObjectName <> "BoolExp") $ map (\o -> o { typeName = o.typeName <> "ComparisonExp"}) obj
            ]
      }
