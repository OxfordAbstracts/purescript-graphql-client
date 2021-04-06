# purescript-graphql-client

<a href="https://pursuit.purescript.org/packages/purescript-graphql-client">
  <img src="https://pursuit.purescript.org/packages/purescript-graphql-client/badge"
       alt="purescript-graphql-client on Pursuit">
  </img>
</a>

A typesafe graphql client for purescript. 

This library will allow you to make graphql queries and type checks the query, arguments and response.

It includes functions for making graphql queries and codegen tools for making sure your GraphQL schema and Purescript schema are in sync. 

## Example

Here is a complete application using purescript-graphql-client, that makes a graphQL query and logs the result, without using schema codegen.

```purescript
module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Data.Symbol (SProxy(..))
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (logShow)
import GraphQL.Client.Args (type (==>), (=>>))
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

## Table of contents

- [purescript-graphql-client](#purescript-graphql-client)
  - [Example](#example)
  - [Table of contents](#table-of-contents)
  - [Getting started](#getting-started)
    - [Installation](#installation)
    - [Schema](#schema)
    - [In the browser](#in-the-browser)
    - [On the server](#on-the-server)
  - [Examples](#examples)
  - [API Documentation](#api-documentation)
  - [Guide](#guide)
    - [Making queries](#making-queries)
    - [Decoding and Encoding JSON](#decoding-and-encoding-json)
    - [Arguments](#arguments)
    - [Full responses](#full-responses)
    - [Apollo only features](#apollo-only-features)
  
## Getting started 

### Installation

Install purescript-graphql-client 

Either use spago (recommended)

and add graphql-client to your project packages.dhall
```
  in  upstream
  with graphql-client =
      { dependencies =
          [ "graphql-parser", "foreign", "foreign-generic", "strings-extra", "typelevel", "event"
          ]
      , repo =
          "https://github.com/OxfordAbstracts/purescript-graphql-client.git"
      , version =
          {- set this to the version of graphql-client you want -}
          "v2.2.2" 
      }

```
and install 

```
spago install graphql-client 
```

or bower

```
bower install purescript-graphql-client 
```

### Schema 

In order to use this library you will need a Purescript representation of your GraphQL schema. 

To get started you can convert your grapqhl schema into a purescript schema, using the codegen tool at https://gql-query-to-purs.herokuapp.com . If you are just testing this library out you can paste your graphql schema on the left, copy the purescript schema from the right and add it to your codebase. 

If you are looking for a production solution to schema codegen read the rest of this section. If you are just trying the library out, you can skip to the next section. 

It is possible to write the schema yourself but it is easier and safer to use the library's codegen tools.

There is an npm library that is a thin wrapper around this libraries schema codegen. First, install this package:

```
npm i -D purescript-graphql-client
```

Then add a script to generate your schema on build.
```js
const { generateSchema } = require('purescript-graphql-client')

generateSchema({
  dir: './src/generated', // Where you want the generated code to go
  modulePath: ['Generated', 'Gql'], // The name of the generated module
  url: 'http://localhost:4000/graphql' // Your graphql enppdint
})
```

A full example can be seen in `examples/2-codegen`

The full options for `generateSchema` can be seen in `codegen/schema/README.md`

You should run this script to build your schema as part of your build, before purescript compilation.

If you wish to generate multiple schemas, use `generateSchemas` 
```js
const { generateSchemas } = require('purescript-graphql-client')

generateSchemas({
  dir: './src/generated',
  modulePath: ['Generated', 'Gql']
}, [
  {
    url: 'http://localhost:4000/graphql',
    moduleName: 'MySchema' // The name of the module for this single schema
  }
])
```

A full example can be seen in `examples/2-codegen`

The full options for `generateSchemas` can be seen in `codegen/schema/README.md`

### In the browser 

To use purescript-graphql-client in the browser you have a few options for a base client. 

- Apollo (Supports subscriptions, watch queries and caching. More external dependencies. Recommended)
- Affjax (Queries and mutations only. No npm/external dependencies)
- Urql (Supports subscriptions, small external dependency)

You can also create your own base client by making your own data type an instance of `QueryClient`. Look in `GraphQL.Client.BaseClients.Affjax` for a simple example

To use Affjax you can simple create a base client using the `AffjaxClient` data constructor and 
passing it the url of your GraphQL endpoint and any request headers.

To use Apollo you will have to install the Apollo npm module. 
```
npm i -S @apollo/client
```

you can then create a client using `createClient`. eg.
```purescript
import MySchema (Query, Mutation)
import GraphQL.Client.BaseClients.Apollo (createClient)
import GraphQL.Client.Query (query)
import GraphQL.Client.Types (Client)
...

    client  :: Client _ Query Mutation Void <- createClient
      { url: "http://localhost:4000/graphql"
      , authToken: Nothing
      , headers: []
      }

    query client "my_query_name" 
      { things: 
        { prop_a: unit
        , prop_b: unit 
        }
      }
    
```
Look in `examples/4-mutation` for a complete example.


Use `createSubscriptionClient` if you want to make subscriptions. eg.

```purescript
import FRP.Event as FRP
import MySchema (Query, Subscription, Mutation)
import GraphQL.Client.BaseClients.Apollo (createSubscriptionClient)
import GraphQL.Client.Subscription (subscription)
import GraphQL.Client.Types (Client)
...

  client :: Client _ Query Mutation Subscription <-
    createSubscriptionClient
      { url: "http://localhost:4000/graphql"
      , authToken: Nothing
      , headers: []
      , websocketUrl: "ws://localhost:4000/subscriptions"
      }
  let
    event = subscription client "get_props" 
      { things: 
        { prop_a: unit
        , prop_b: unit
        } 
      }

  cancel <-
    FRP.subscribe event \e -> do
      log "Event recieved"
      logShow e
    
```

### On the server

To use this library server-side, you should use the Affjax base client and install xhr2

```
npm i -S xhr2
```

You can see an examples of this in `examples/1-simple` and `e2e/1-affjax` .

You can then write queries and mutations just as you would in the browser. 


## Examples 

To view examples of what can be done with this library look at the `examples` and `e2e` directories.

## API Documentation 

API documentation can be found at https://pursuit.purescript.org/packages/purescript-graphql-client

## Guide 

### Making queries
Once you are set up and have generated your purescript schema. You can write your queries. 

The easiest way to do this is to go to https://gql-query-to-purs.herokuapp.com/query and paste your 
graphql query on the left. I usually copy the GraphQL query directly from GraphiQl (GraphQL IDE). 

You have to the option to make the queries with either `unit`s to mark scalar values (leaf nodes) or symbol record puns. The symbol record puns are slightly less verbose and closer to GraphQL syntax but require you import the generated Symbols module. 

### Decoding and Encoding JSON 

By default, the library uses `decodeJson` from `Data.Argonaut.Decode` to decode Json responses
and `encodeJson` from `Data.Argonaut.Encode` to encode Json. This can be overridden by using the "WithDecoder" versions of functions. 

- `queryWithDecoder` 
- `mutationWithDecoder`
- `subscriptionWithDecoder`
- `queryOptsWithDecoder` 
- `mutationOptsWithDecoder`
- `subscriptionOptsWithDecoder`
  
With these you can set your own decoder. The library provides a decoder and encoder that works with [Hasura](https://hasura.io). eg. 

```purs
result <- queryWithDecoder decodeHasura client "query_to_hasura_service"
  { widget: 
    { prop1, prop2 }
  } 
```

### Arguments

Arguments can be added using the `Args` constructor or the `=>>` operator. I recommend using the [query codegen tool](https://gql-query-to-purs.herokuapp.com/query) to test this out and see how it works.

As GraphQL arguments may not have consistent type depending on conditions, the library provides tools to help handle this. 

`ArgL` and `ArgR` allow you to have different types different code branches in arguments. 

eg. 
```purs
let condition = true

result <- query client "args_of_differing_types"
  { widget: (if condition then ArgL { x: 1 } else ArgR { y: "something" })
    =>>
    { prop1, prop2 }
  } 
```
`IgnoreArg` can be used to ignore both the label and value on a record. 

This is most commonly used with `guardArg` to ignore an argument property unless a condition is met. 

eg.
```purs
let condition = true

result <- query client "only_set_arg_if"
  { widget: { x: guardArg condition 1} 
    =>>
    { prop1, prop2 }
  } 
```

GraphQL arrays can be written as purescript array if they are homogenous, but for mixed type arrays
you can use `AndArg` or the `++` operator. 

eg.
```purs

result <- query client "mixed_args_query"
  { widget: 
    { homogenous_array_prop: [1,2,3]
    , mixed_array_prop: 1 ++ "hello" 
    } 
    =>>
    { prop1, prop2 }
  } 
```

### Full responses 

If you wish to get the full response, as per the [GraphQL Spec](https://spec.graphql.org/June2018/#sec-Response) use the "FullRes" versions of the query functions

- `queryFullRes`
- `mutationFullRes`
- `subscriptionFullRes`

These will include all errors and extensions in the response, even if the response type checked. 

### Apollo only features 

With apollo you can make type checked cache updates. To see examples of this look at `examples/6-watch-query` and `examples/7-watch-query-optimistic`. You can also set many options for queries, mutations and subscriptions using , `queryOpts` , `mutationOpts`, `subscriptionOpts` respectively.
To see how these options work, I recommend looking at the [Apollo core docs](https://www.apollographql.com/docs/react/api/core/ApolloClient/)

The options are usually set using record updates or `identity` for default options. 

eg.
```purs 
        mutationOpts _ 
            { update = Just update 
            , fetchPolicy = Just NetworkOnly
            } 
            client 
            "make_post"
            { addPost: { author, comment } =>> { author: unit }
            }

```
