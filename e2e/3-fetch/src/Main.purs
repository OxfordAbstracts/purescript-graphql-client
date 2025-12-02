module Main where

import Prelude

import Data.Argonaut.Decode (decodeJson)
import Data.Either (Either(..))
import Data.Maybe (isJust)
import Effect (Effect)
import Effect.Aff (launchAff_)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.BaseClients.Fetch (FetchClient(..))
import GraphQL.Client.Query (query, queryFullRes)
import GraphQL.Client.Types (Client(..))
import Test.Spec.Assertions (shouldEqual)
import Type.Data.List (Nil')
import Type.Proxy (Proxy(..))

foreign import setupMsw :: Effect Unit

type Schema =
  { prop :: String
  , widgets :: { id :: Int } -> Array Widget
  }

type Widget =
  { name :: String
  , id :: Int
  }

client
  :: Client (FetchClient {})
       { directives :: Proxy Nil'
       , query :: Schema
       , mutation :: Void
       , subscription :: Void
       }
client = (Client $ FetchClient "http://localhost/graphql" {})

main :: Effect Unit
main = do
  setupMsw
  launchAff_ do
    { widgets } <-
      query client "Widget names with id 1"
        { widgets: { id: 1 } =>> { name: Proxy @"name" } }

    widgets `shouldEqual` [ { name: "one" } ]

    fullResult <-
      queryFullRes decodeJson identity client "Widget names with id 1"
        { widgets: { id: 1 } =>> { name: Proxy @"name" } }

    fullResult.data_ `shouldEqual` (Right { widgets: [ { name: "one" } ] })
    isJust fullResult.errors `shouldEqual` false
    isJust fullResult.errors_json `shouldEqual` false

