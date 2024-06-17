module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Data.Newtype (unwrap)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (logShow)
import Generated.Gql.Schema.Admin (Query)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.Operation (OpQuery)
import GraphQL.Client.Query (query_)
import GraphQL.Client.Types (class GqlQuery)
import GraphQL.Client.Union (GqlUnion(..))
import Type.Data.List (Nil')
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { character } <-
      queryGql "HanSolo"
        { character:
            { id: 1 } =>> GqlUnion
              { "Human": { height: unit }
              , "Droid": { name: unit }
              }
        }

    -- Will log [ (inj @"Human" { height: 1.8 }) ] as the union is a human.
    logShow $ unwrap character

-- Run gql query
queryGql
  :: forall query returns
   . GqlQuery Nil' OpQuery Query query returns
  => DecodeJson returns
  => String
  -> query
  -> Aff returns
queryGql = query_ "http://localhost:4892/graphql" (Proxy :: Proxy Query)
