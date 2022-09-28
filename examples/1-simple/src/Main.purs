module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (logShow)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.Query (query_)
import GraphQL.Client.Types (class GqlQuery)
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { widgets } <-
      queryGql "Widget names with id 1"
        { widgets: { id: 1 } =>> { name } }
    logShow $ map _.name widgets

-- Run gql query
queryGql ::
  forall query returns.
  GqlQuery Schema query returns =>
  DecodeJson returns =>
  String -> query -> Aff returns
queryGql = query_ "http://localhost:4000/graphql" (Proxy :: Proxy Schema) 

-- Schema
type Schema
  = { prop :: String
    , widgets :: { id :: Int } -> Array Widget
    }

type Widget
  = { name :: String
    , id :: Int
    }

-- Symbols 
prop :: Proxy "prop"
prop = Proxy

name :: Proxy "name"
name = Proxy