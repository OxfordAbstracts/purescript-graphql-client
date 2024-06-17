module Main where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Milliseconds(..), delay, launchAff_)
import Effect.Class.Console (log, logShow)
import Generated.Gql.Schema.Admin (Schema)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.BaseClients.Apollo (createSubscriptionClient, updateCacheJson)
import GraphQL.Client.Query (mutationOpts)
import GraphQL.Client.Types (Client)
import GraphQL.Client.WatchQuery (watchQuery)
import Halogen.Subscription as HS
import Type.Data.List (Nil')

main :: Effect Unit
main = do
  client :: Client _ Schema <-
    createSubscriptionClient
      { url: "http://localhost:4892/graphql"
      , authToken: Nothing
      , headers: []
      , websocketUrl: "ws://localhost:4892/subscriptions"
      }
  let
    myQuery = { posts: { author: unit, comment: unit } }
    event =  watchQuery client "get_props" myQuery

  cancel <-
    HS.subscribe event \e -> do
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
