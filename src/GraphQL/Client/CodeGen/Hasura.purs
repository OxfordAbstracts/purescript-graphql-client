module GraphQL.Client.CodeGen.Hasura where

import Prelude

import Data.FunctorWithIndex (mapWithIndex)
import Data.Tuple (Tuple(..))
import Foreign.Object as Object
import GraphQL.Client.CodeGen.SchemaFromGqlToPurs (InputOptionsJs, PursGql, schemaFromGqlToPursJs)

schemaFromGqlToPursJsHasura :: InputOptionsJs -> String -> { parseError :: String, result :: PursGql }
schemaFromGqlToPursJsHasura opts =
  schemaFromGqlToPursJs
    opts
      { outsideColumnTypes = Object.unions $ opts.outsideColumnTypes # mapWithIndex \gqlObjectName obj -> 
          Object.fromFoldable 
            [ Tuple gqlObjectName obj
            , Tuple (gqlObjectName <> "InsertInput") obj
            , Tuple (gqlObjectName <> "MinFields") obj
            , Tuple (gqlObjectName <> "MaxFields") obj
            , Tuple (gqlObjectName <> "SetInput") obj
            , Tuple (gqlObjectName <> "BoolExp") $ map (\o -> o { typeName = o.typeName <> "ComparisonExp"}) obj
            ]
      }
