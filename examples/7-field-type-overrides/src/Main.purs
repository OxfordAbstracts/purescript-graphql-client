module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (logShow)
import Generated.Gql.Schema.Admin (Query)
import GraphQL.Client.Operation (OpQuery)
import GraphQL.Client.Query (query_)
import GraphQL.Client.Types (class GqlQuery)
import Type.Data.List (Nil')
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { widgets } <-
      queryGql "Widget jsons"
        { widgets: { special_string: unit } }
    logShow $ map (_.special_string) widgets

-- Run gql query
queryGql ::
  forall query returns.
  GqlQuery Nil' OpQuery Query query returns =>
  DecodeJson returns =>
  String -> query -> Aff returns
queryGql = query_ "http://localhost:4892/graphql" (Proxy :: Proxy Query)
