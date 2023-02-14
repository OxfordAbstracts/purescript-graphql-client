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
import GraphQL.Client.Operation (OpQuery)
import GraphQL.Client.BaseClients.Affjax.Node (query_)
import GraphQL.Client.Types (class GqlQuery)
import GraphQL.Client.Variable (Var(..))
import GraphQL.Client.Variables (withVars)
import Type.Data.List (Nil')
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { widgets } <-
      queryGql "widget_colours_with_id1"
        $ { widgets: { colour: Var :: _ "colourVar" Colour } =>> { colour } }
            `withVars`
              { colourVar: RED }
    -- Will log [ RED ] as there is one red widget
    logShow $ map _.colour widgets

-- Run gql query
queryGql ::
  forall query returns.
  GqlQuery Nil' OpQuery Query query returns =>
  DecodeJson returns =>
  String -> query -> Aff returns
queryGql = query_ "http://localhost:4000/graphql" (Proxy :: Proxy Query)
