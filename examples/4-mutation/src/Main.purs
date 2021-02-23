module Main where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class.Console (logShow)
import Generated.Gql.Enum.Colour (Colour(..))
import Generated.Gql.Schema.Admin (Query, Mutation)
import Generated.Gql.Symbols (colour, id)
import GraphQL.Client.Args (onlyArgs, (=>>))
import GraphQL.Client.BaseClients.Apollo (createClient, updateCacheJson)
import GraphQL.Client.BaseClients.Apollo.FetchPolicy (FetchPolicy(..))
import GraphQL.Client.Query (mutationOpts, query, queryOpts)
import GraphQL.Client.Types (Client)

main :: Effect Unit
main = do
  client :: Client _ Query Mutation Void <-
    createClient
      { url: "http://localhost:4000/graphql"
      , authToken: Nothing
      , headers: []
      }
  launchAff_ do
    let getWidgets = { widgets: { id: 1 } =>> { colour, id } }
    { widgets } <-
      query client "Widget_1_colour"
        getWidgets

    -- Will log [ RED ]
    logShow $ map _.colour widgets

    { set_widget_colour: affectedCount } <-
      mutationOpts 
        _ { update = Just $ cacheUpdate client getWidgets } 
        client 
        "Update_widget_colour"
        { set_widget_colour: onlyArgs { id: 1, colour: GREEN }
        }

    -- Will log 1
    logShow affectedCount

    { widgets: updatedWidgets } <-
      query client "Widget_1_colour_updated" getWidgets

    -- Will now log [ GREEN ]
    logShow $ map _.colour updatedWidgets

    { widgets: updatedWidgetsWithoutCache } <-
      queryOpts _ {fetchPolicy = Just NoCache } client "Widget_1_colour_no_cache" getWidgets

    -- Will also log [ GREEN ]
    logShow $ map _.colour updatedWidgetsWithoutCache

    where 
    cacheUpdate client =
      updateCacheJson client \{ widgets } ->
        { widgets: widgets <#>  \w -> w { colour = if w.id == Just 1 then GREEN else w.colour }
        }

  
