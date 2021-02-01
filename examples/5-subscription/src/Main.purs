module Main where

import Prelude

import Data.Either (either)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Milliseconds(..), delay, launchAff_)
import Effect.Class.Console (info, infoShow, log, logShow)
import FRP.Event (subscribe)
import FRP.Event as FRP
import Generated.Gql.Schema.Admin (Query, Subscription)
import Global.Unsafe (unsafeStringify)
import GraphQL.Client.Args (onlyArgs, (=>>))
import GraphQL.Client.BaseClients.Apollo (createSubscriptionClient)
import GraphQL.Client.Query (mutation, query)
import GraphQL.Client.Subscription (subscription)
import GraphQL.Client.Types (Client)

main :: Effect Unit
main = do
  info "start sub main"
  client :: Client _ Query Void Subscription <-
    createSubscriptionClient
      { url: "http://localhost:4000/graphql"
      , authToken: Nothing
      -- , websocketUrl: "http://localhost:4000/subscription"
      , websocketUrl: "ws://localhost:4000/subscriptions"
      }

  let event = subscription client "get props" { postAdded: {author: unit, comment: unit} }

  cancel <- FRP.subscribe event \e -> do 
    info "Event"
    infoShow e
    logShow e
    -- info $ either unsafeStringify unsafeStringify e
    
  -- info cancel

  launchAff_ do
    delay $ Milliseconds 3000.0
    -- { widgets } <-
    --   query client "Widget_1_colour"
    --     { widgets: { id: 1 } =>> { colour: unit } }

    -- -- Will log [ RED ]
    -- logShow $ map _.colour widgets
    info "end sub main"
  -- subscribe (subscription client )
  -- launchAff_ do
  --   { widgets } <-
  --     query client "Widget_1_colour"
  --       { widgets: { id: 1 } =>> { colour } }

  --   -- Will log [ RED ]
  --   logShow $ map _.colour widgets

  --   { set_widget_colour: affectedCount } <-
  --     mutation client "Update_widget_colour"
  --       { set_widget_colour: onlyArgs { id: 1, colour: GREEN }
  --       }

  --   -- Will log 1
  --   logShow affectedCount

  --   { widgets: updatedWidgets } <-
  --     query client "Widget_1_colour_updated"
  --       { widgets: { id: 1 } =>> { colour } }

  --   -- Will now log [ GREEN ]
  --   logShow $ map _.colour updatedWidgets
