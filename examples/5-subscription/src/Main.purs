module Main where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Milliseconds(..), delay, launchAff_)
import Effect.Class.Console (log, logShow)
import Generated.Gql.Schema.Admin (Schema)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.BaseClients.Apollo (createSubscriptionClient)
import GraphQL.Client.Query (mutation)
import GraphQL.Client.Subscription (subscription)
import GraphQL.Client.Types (Client)
import Halogen.Subscription as HS

main :: Effect Unit
main = do
  client :: Client _ Schema <-
    createSubscriptionClient
      { url: "http://localhost:4892/graphql"
      , authToken: Nothing
      , headers: []
      , websocketUrl: "ws://localhost:4892/graphql"
      }
  let
    event = subscription client "get_props" { postAdded: { author: unit, comment: unit } }

  cancel <-
    HS.subscribe event \e -> do
      log "Event recieved"
      logShow e
  launchAff_ do
    delay $ Milliseconds 25.0
    void
      $ mutation client "make_post"
          { addPost: { author: "joe bloggs", comment: "great" } =>> { author: unit }
          }
    void
      $ mutation client "make_post"
          { addPost: { author: "joe bloggs", comment: "bad" } =>> { author: unit }
          }
