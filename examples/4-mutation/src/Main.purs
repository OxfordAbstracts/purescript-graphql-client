module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (logShow)
import Generated.Gql.Enum.Colour (Colour(..))
import Generated.Gql.Schema.Admin (Query, Mutation)
import Generated.Gql.Symbols (colour)
import GraphQL.Client.Args (onlyArgs, (=>>))
import GraphQL.Client.Query (class GqlQuery, mutation, query)
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { widgets } <-
      queryGql "Widget_1_colour"
        { widgets: { id: 1 } =>> { colour } }
    -- Will log [ RED ]
    logShow $ map _.colour widgets

    {set_widget_colour: affectedCount } <- mutationGql "Update_widget_colour"
      { set_widget_colour: onlyArgs { id: 1, colour: GREEN }
      }

    logShow affectedCount

    { widgets: updatedWidgets } <-
      queryGql "Widget_1_colour_updated"
        { widgets: { id: 1 } =>> { colour } }
    -- Will now log [ GREEN ]
    logShow $ map _.colour updatedWidgets

-- Run gql query
queryGql ::
  forall query returns.
  GqlQuery Query query returns =>
  DecodeJson returns =>
  String -> query -> Aff returns
queryGql = query (Proxy :: Proxy Query) "http://localhost:4000/graphql" []

-- Run gql query
mutationGql ::
  forall query returns.
  GqlQuery Mutation query returns =>
  DecodeJson returns =>
  String -> query -> Aff returns
mutationGql = mutation (Proxy :: Proxy Mutation) "http://localhost:4000/graphql" []
