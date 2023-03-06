module Main where

import Prelude
import Data.Argonaut.Decode (class DecodeJson)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (logShow)
import Generated.Gql.Directives.Admin (Directives, cached)
import Generated.Gql.Schema.Admin (Query)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.Operation (OpQuery)
import GraphQL.Client.BaseClients.Affjax.Node (query_)
import GraphQL.Client.Types (class GqlQuery)
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { widgets } <-
      queryGql "widgets_cached"
        $ cached { refresh: false }
            { widgets: { id: 1 } =>> { name: unit }
            }
    logShow $ map _.name widgets

-- Run gql query
queryGql ::
  forall query returns.
  GqlQuery Directives OpQuery Query query returns =>
  DecodeJson returns =>
  String -> query -> Aff returns
queryGql = query_ "http://localhost:4000/graphql" (Proxy :: Proxy Query)
