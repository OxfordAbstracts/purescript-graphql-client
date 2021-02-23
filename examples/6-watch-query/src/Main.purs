module Main where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Milliseconds(..), delay, launchAff_)
import Effect.Class.Console (log, logShow)
import FRP.Event as FRP
import Generated.Gql.Schema.Admin (Query, Subscription, Mutation)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.BaseClients.Apollo (createSubscriptionClient, updateCacheJson, watchQueryEvent)
import GraphQL.Client.Query (mutationOpts)
import GraphQL.Client.Subscription (ignoreErrors)
import GraphQL.Client.Types (Client)

main :: Effect Unit
main = do
  client :: Client _ Query Mutation Subscription <-
    createSubscriptionClient
      { url: "http://localhost:4000/graphql"
      , authToken: Nothing
      , headers: []
      , websocketUrl: "ws://localhost:4000/subscriptions"
      }
  let
    myQuery = { posts: { author: unit, comment: unit } }
    event = ignoreErrors $ watchQueryEvent client "get_props" myQuery

  cancel <-
    FRP.subscribe event \e -> do
      log "Event recieved"
      logShow e

  let 
    addComment author comment = 
      let 
        update = updateCacheJson client myQuery \{ posts } ->
           {posts: posts <> [{author, comment}]}
      in
      void
        $ mutationOpts _ {update = Just update} client "make_post"
            { addPost: { author, comment } =>> { author: unit }
            }

  launchAff_ do
    delay $ Milliseconds 25.0
    addComment "joe bloggs" "good"

