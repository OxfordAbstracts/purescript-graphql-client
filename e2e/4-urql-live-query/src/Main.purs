module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Maybe (isJust)
import Data.Time.Duration (Milliseconds(..), Seconds(..))
import Effect (Effect)
import Effect.Aff (Aff, delay, launchAff_)
import Effect.Class (liftEffect)
import Effect.Class.Console (logShow)
import Effect.Console (log)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.BaseClients.Urql (UrqlLiveQueryClient(..), createLiveQueryClient)
import GraphQL.Client.Directive (ApplyDirective, applyDir)
import GraphQL.Client.Directive.Definition (Directive)
import GraphQL.Client.Directive.Location (QUERY(..))
import GraphQL.Client.LiveQuery (liveQuery)
import GraphQL.Client.Operation (OpQuery)
import GraphQL.Client.Query (query, queryFullRes)
import GraphQL.Client.Types (class GqlQuery, Client(..))
import Halogen.Subscription as HS
import Type.Data.List (type (:>), Nil')
import Type.Proxy (Proxy(..))

type Directives =
    (   Directive "live" "" { }
         (QUERY :> Nil')
          :> Nil'
    )

live :: forall q args. args -> q -> ApplyDirective "live" args q 
live = applyDir (Proxy :: _ "live")

main :: Effect Unit
main = do

  client :: Client UrqlLiveQueryClient Directives Query _ _ <-
    createLiveQueryClient
      { url: "http://localhost:4000/graphql"
      , headers: [ ]
      }

  let
    event = liveQuery client "" $ live {} { greetings }

  handle <-
    HS.subscribe event \e -> do
      log "Live Query update received"
      logShow e

  launchAff_ do
    delay $ Milliseconds (3.0 * 1000.0)
    liftEffect $ HS.unsubscribe handle

-- Query
type Query
  = { greetings :: Array String
    }

-- Symbols
greetings :: Proxy "greetings"
greetings = Proxy
