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
prop :: Proxy "prop"
prop = Proxy

name :: Proxy "name"
name = Proxy
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
    - [Query syntax](#query-syntax)
    - [Decoding and Encoding JSON](#decoding-and-encoding-json)
    - [Arguments](#arguments)
    - [Aliases](#aliases)
      - [Dynamically spread Aliases](#dynamically-spread-aliases)
    - [Variables](#variables)
    - [Full responses](#full-responses)
    - [Apollo only features](#apollo-only-features)
  - [Alternatives to this package](#alternatives-to-this-package)
    - [purescript-graphql-fundeps](#purescript-graphql-fundeps)
    - [purescript-graphqlclient](#purescript-graphqlclient)
  
## Getting started 

### Installation

Install purescript-graphql-client 

Either use spago (recommended)

```
spago install graphql-client
```

If you are using an older package set, you will have to add graphql-client to your project packages.dhall first
```
  in  upstream
  with graphql-client =
      { dependencies =
          [ "aff"
          , "aff-promise"
          , "affjax"
          , "argonaut-codecs"
          , "argonaut-core"
          , "arrays"
          , "bifunctors"
          , "control"
          , "datetime"
          , "effect"
          , "either"
          , "enums"
          , "exceptions"
          , "foldable-traversable"
          , "foreign"
          , "foreign-generic"
          , "foreign-object"
          , "functions"
          , "halogen-subscriptions"
          , "heterogeneous"
          , "http-methods"
          , "integers"
          , "lists"
          , "maybe"
          , "media-types"
          , "newtype"
          , "node-buffer"
          , "node-fs"
          , "nullable"
          , "numbers"
          , "ordered-collections"
          , "parsing"
          , "prelude"
          , "profunctor"
          , "profunctor-lenses"
          , "psci-support"
          , "quickcheck"
          , "record"
          , "spec"
          , "spec-discovery"
          , "string-parsers"
          , "strings"
          , "strings-extra"
          , "transformers"
          , "tuples"
          , "typelevel-prelude"
          , "unicode"
          ]
      , repo =
          "https://github.com/OxfordAbstracts/purescript-graphql-client.git"
      , version =
          {- set this to the version of graphql-client you want -}
          "v4.0.12"
      }
```

or install with bower

```
bower install purescript-graphql-client 
```

### Schema 

In order to use this library you will need a Purescript representation of your GraphQL schema. 

To get started you can convert your grapqhl schema into a purescript schema, using the codegen tool at https://gql-query-to-purs.herokuapp.com . If you are just testing this library out you can paste your graphql schema on the left, copy the purescript schema from the right and add it to your codebase. 

If you are looking for a production solution to schema codegen read the rest of this section. If you are just trying the library out, you can skip to the next section. 

It is possible to write the schema yourself but it is easier and safer to use the library's codegen tools.

There is an npm library that is a thin wrapper around this library's schema codegen. First, install this package:

```
npm i -D purescript-graphql-client
```

Then add a script to generate your schema on build. Run this script before compiling your purescript project.
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

To use Affjax you can create a base client using the `AffjaxClient` data constructor and 
pass it the url of your GraphQL endpoint and any request headers.

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
import Halogen.Subscription as HS
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
    HS.subscribe event \e -> do
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

### Query syntax
Once you are set up and have generated your purescript schema. You can write your queries. 

The easiest way to do this is to go to https://gql-query-to-purs.herokuapp.com/query and paste your 
graphql query on the left. I usually copy the GraphQL query directly from GraphiQL (GraphQL IDE). 

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

As GraphQL arguments may have mixed types, the library provides tools to help handle this. 

`ArgL` and `ArgR` allow you to have different types for different code branches in arguments. 

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
  { widget: { x: guardArg condition 1 } 
    =>>
    { prop1, prop2 }
  } 
```

GraphQL arrays can be written as purescript arrays if they are homogenous, but for mixed type arrays
you can use `AndArgs`/`andArg` or the `+++`/`++` operator. 

eg.
```purs

result <- query client "mixed_args_query"
  { widget: 
    { homogenous_array_prop: [1, 2, 3]
    , mixed_array_prop: 1 ++ "hello" 
    , mixed_array_prop2: [1, 2] +++ ["hello", "world"]
    } 
    =>>
    { prop1, prop2 }
  } 
```

### Aliases

It is possible to alias properties using the alias operator `:` from `GraphQL.Client.Alias`.

eg.

```purs
import GraphQL.Client.Alias ((:))
import Generated.Symbols (widgets) -- Or wherever your symbols module is
...

query client "my_alias_query"
  { widgets: { id: 1 } =>> { name } 
  , widgetWithId2: widgets : { id: 2 } =>> { name } 
  }
```

#### Dynamically spread Aliases

Sometimes it is useful to create aliased queries or mutations from a collection of size unknown at compile time. 

In a dynamic language you might fold a collection of users to create a graphql query like:

```gql 
mutation myUpdates {
  _1: update_users(where: {id : 1}, _set: { value: 10 }) { affected_rows }
  _2: update_users(where: {id : 2}, _set: { value: 15 }) { affected_rows }
  _3: update_users(where: {id : 3}, _set: { value: 20 }) { affected_rows }
}
```

To do this in this library there is there is the `Spread` constructor that creates these aliases for you and decodes the response as an array. 

eg.
```purs

import GraphQL.Client.Alias.Dynamic (Spread(..))
import Generated.Symbols (update_users) -- Or wherever your symbols module is

...
query client "update_multiple_users"
    $ Spread update_users
        [ { where: { id: 1}, _set: { value: 10 } }
        , { where: { id: 2}, _set: { value: 15 } }
        , { where: { id: 3}, _set: { value: 20 } }
        ]
        { affected_rows }
```

Look alias example in the examples directory for more details. 

### Variables

It is possible to define variables using the `Var` contructor 
and substitute them using the `withVars` function
eg.

```purs
import GraphQL.Client.Variable (Var(..))
import GraphQL.Client.Variables (withVars)
...

query client "widget_names_with_id_1"
        $ { widgets: { id: Var :: _ "idVar" Int } =>> { name }
          }
            `withVars`
              { idVar: 1 }
```
`withVars` uses `encodeJson` to turn the variables in json. If you 
wish to use a custom encoder, use `withVarsEncode`.

To provide custom types as variables you will have to make them an instance of `VarTypeName`. 
This type class specifies their graphql type. 

There is a full example in the examples directory.

### Full responses 

If you wish to get the full response, as per the [GraphQL Spec](https://spec.graphql.org/June2018/#sec-Response) use the "FullRes" versions of the query functions

- `queryFullRes`
- `mutationFullRes`
- `subscriptionFullRes`

These will include all errors and extensions in the response, even if a response of the correct type has been returned. 

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

## Alternatives to this package


### [purescript-graphql-fundeps](https://github.com/meeshkan/purescript-graphql-fundeps)

A much more lightweight graphql client. This package does not infer query types and does not support subscriptions or caching but allows writing in 
graphql syntax and has much less source code. Probably preferable if your query types are not too complex and you do not need subscriptions or caching.

### [purescript-graphqlclient](https://github.com/purescript-graphqlclient/purescript-graphqlclient)

A port of [elm-graphql](https://github.com/dillonkearns/elm-graphql/).

Although the names and scope of the 2 packages are very similar they are not connected and there are a few differences:
- This package uses record syntax to make queries whereas purescript-graphqlclient uses applicative/ado syntax
- This package allows use of Apollo if you wish (or other lower level graphQL clients)
- This package supports subscriptions, watch queries and client caching


