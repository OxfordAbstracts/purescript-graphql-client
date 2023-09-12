module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (logShow)
import Generated.Gql.Schema.Admin.Enum.Colour (Colour(..))
import Generated.Gql.Schema.Admin (Query)
import Generated.Gql.Symbols (colour)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.Operation (OpQuery(..))
import GraphQL.Client.Query (query_)
import GraphQL.Client.Types (class Queriable)
import Type.Data.List (Nil')
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { widgets } <-
      queryGql "WidgetColoursWithId1"
        { widgets: { colour: RED } =>> { colour } }
        
    -- Will log [ RED ] as there is one red widget
    logShow $ map _.colour widgets

-- Run gql query
queryGql ::
  forall query returns.
  Queriable Nil' OpQuery Query query returns =>
  DecodeJson returns =>
  String -> query -> Aff returns
queryGql = query_ "http://localhost:4000/graphql" (Proxy :: Proxy Query)
