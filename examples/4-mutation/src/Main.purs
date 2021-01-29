module Main where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class.Console (logShow)
import Generated.Gql.Enum.Colour (Colour(..))
import Generated.Gql.Schema.Admin (Query, Mutation)
import Generated.Gql.Symbols (colour)
import GraphQL.Client.Args (onlyArgs, (=>>))
import GraphQL.Client.BaseClients.Apollo (createClient)
import GraphQL.Client.Query (mutation, query)
import GraphQL.Client.Types (Client)

main :: Effect Unit
main = do
  client :: Client _ Query Mutation Void <-
    createClient
      { url: "http://localhost:4000/graphql"
      , authToken: Nothing
      }
  launchAff_ do
    { widgets } <-
      query { fetchPolicy: Just NoCache } client "Widget_1_colour"
        { widgets: { id: 1 } =>> { colour } }

    -- Will log [ RED ]
    logShow $ map _.colour widgets

    { set_widget_colour: affectedCount } <-
      mutation client "Update_widget_colour"
        { set_widget_colour: onlyArgs { id: 1, colour: GREEN }
        }

    -- Will log 1
    logShow affectedCount

    { widgets: updatedWidgets } <-
      query client "Widget_1_colour_updated"
        { widgets: { id: 1 } =>> { colour } }

    -- Will now log [ GREEN ]
    logShow $ map _.colour updatedWidgets
