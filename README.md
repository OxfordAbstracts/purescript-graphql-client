# purescript-graphql-client

<a href="https://pursuit.purescript.org/packages/purescript-graphql-client">
  <img src="https://pursuit.purescript.org/packages/purescript-graphql-client/badge"
       alt="purescript-graphql-client on Pursuit">
  </img>
</a>

A typesafe graphql client for purescript. 

This library will allow you to make graphql queries with type checking for the query, arguments and return value. 

## Example

Here is a complete application using purescript-graphql-client, that makes 2 graphQL queries and logs the results.

```purescript
module Main where

import Prelude
import Data.Argonaut.Decode (class DecodeJson)
import Data.Symbol (SProxy(..))
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (log, logShow)
import GraphQL.Client.Args (type (==>), (=>>))
import GraphQL.Client.Query (class GqlQuery, query)
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    simpleResult <- queryGql "Get gql prop" { prop }
    log $ simpleResult.prop
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
queryGql = query (Proxy :: Proxy Schema) "http://localhost:4000/graphql" []

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
```

You can see this full example with graphQL server in the example directory.

To keep schemas in sync, this library includes codegen functionality that introspects a graphql server and generates the code for the purescript schema type. You have schema and query codegen tools at this site: https://gql-query-to-purs.herokuapp.com/