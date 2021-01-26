module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (logShow)
import Generated.Gql.Enum.Colour (Colour(..))
import Generated.Gql.Schema.Admin (Query)
import Generated.Gql.Symbols (colour)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.Query (class GqlQuery, query)
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { widgets } <-
      queryGql "Widget colours with id 1"
        { widgets: { colour: RED } =>> { colour } }
        
    -- Will log ["RED"]
    logShow $ map _.colour widgets

-- Run gql query
queryGql ::
  forall query returns.
  GqlQuery Query query returns =>
  DecodeJson returns =>
  String -> query -> Aff returns
queryGql = query (Proxy :: Proxy Query) "http://localhost:4000/graphql" []
