module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Data.Newtype (unwrap)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (logShow)
import Generated.Gql.Schema.Admin (Query)
import Generated.Gql.Schema.Admin.Enum.Colour (Colour(..))
import Generated.Gql.Symbols (colour)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.Query (query_)
import GraphQL.Client.Types (class GqlQuery)
import GraphQL.Client.Union (GqlUnion(..))
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { widgets } <-
      queryGql "WidgetColoursWithId1"
        { widgets: { colour: RED } =>> { colour } }
        
    -- Will log [ RED ] as there is one red widget
    logShow $ map _.colour widgets

    { character } <- 
      queryGql "HanSolo" 
        { character: GqlUnion 
            { "Human": { height: unit }
            , "Droid": { name: unit }
            }
        }

    -- Will log [ (inj @"Human" { height: 1.8 }) ] as the union is a human.
    logShow $ unwrap character

-- Run gql query
queryGql ::
  forall query returns.
  GqlQuery Query query returns =>
  DecodeJson returns =>
  String -> query -> Aff returns
queryGql = query_ "http://localhost:4000/graphql" (Proxy :: Proxy Query)
