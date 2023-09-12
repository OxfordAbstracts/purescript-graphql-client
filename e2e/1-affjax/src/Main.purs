module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Maybe (isJust)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (logShow)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.Operation (OpQuery)
import GraphQL.Client.BaseClients.Affjax.Node (AffjaxNodeClient(..))
import GraphQL.Client.Query (query, queryFullRes)
import GraphQL.Client.Types (class Queriable, Client(..))
import Type.Data.List (Nil')
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { widgets } <-
      queryGql "Widget names with id 1"
        { widgets: { id: 1 } =>> { name } }
    logShow $ map _.name widgets
    fullResult <-
      queryFullRes decodeJson identity client "Widget names with id 1"
        { widgets: { id: 1 } =>> { name } }

    logShow fullResult.data_
    logShow $ isJust fullResult.errors
    logShow $ isJust fullResult.errors_json

-- Run gql query
queryGql
  :: forall query returns
   . Queriable Nil' OpQuery Schema query returns
  => DecodeJson returns
  => String
  -> query
  -> Aff returns
queryGql = query client

client
  :: Client AffjaxNodeClient
       { directives :: Proxy Nil'
       , query :: Schema
       , mutation :: Void
       , subscription :: Void
       }
client = (Client $ AffjaxNodeClient "http://localhost:4000/graphql" [])

-- Schema
type Schema =
  { prop :: String
  , widgets :: { id :: Int } -> Array Widget
  }

type Widget =
  { name :: String
  , id :: Int
  }

-- Symbols
prop :: Proxy "prop"
prop = Proxy

name :: Proxy "name"
name = Proxy
