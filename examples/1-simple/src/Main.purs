module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Data.Symbol (SProxy(..))
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (infoShow, logShow)
import GraphQL.Client.Args (type (==>), (=>>))
import GraphQL.Client.Query (class GqlQuery, query_)
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    infoShow "START 1"
    { widgets } <-
      queryGql "Widget names with id 1"
        { widgets: { id: 1 } =>> { name } }
    infoShow widgets
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
    , widgets :: { id :: Int } ==> Array Widget
    }

type Widget
  = { name :: String
    , id :: Int
    }

-- Symbols 
prop :: SProxy "prop"
prop = SProxy

name :: SProxy "name"
name = SProxy