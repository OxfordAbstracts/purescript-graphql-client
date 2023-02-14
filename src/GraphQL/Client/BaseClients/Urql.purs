-- | Creates GraphQL clients
module GraphQL.Client.BaseClients.Urql
  ( UrqlClient
  , UrqlClientOptions
  , UrqlLiveQueryClient
  , UrqlSubClient
  , UrqlSubClientOptions
  , createClient
  , createGlobalClientUnsafe
  , createLiveQueryClient
  , createSubscriptionClient
  , mutation_
  , query_
  )
  where

import Prelude

import Affjax (URL)
import Affjax.RequestHeader (RequestHeader, name, value)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson, printJsonDecodeError)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Effect.Class (liftEffect)
import Foreign (Foreign, unsafeToForeign)
import Foreign.Object (Object)
import Foreign.Object as Object
import GraphQL.Client.Operation (OpMutation, OpQuery)
import GraphQL.Client.Query (query, mutation)
import GraphQL.Client.Types (class QueryClient, class SubscriptionClient, class LiveQueryClient, class GqlQuery, Client(..))
import Type.Proxy (Proxy(..))

type UrqlClientOptions
  = { url :: URL
    , headers :: Array RequestHeader
    }

type UrqlSubClientOptions
  = { url :: URL
    , websocketUrl :: URL
    , headers :: Array RequestHeader
    }

-- | A client to make graphQL queries and mutations. 
-- | From the @urql/core npm module
foreign import data UrqlClient :: Type

-- | A client to make graphQL queries, mutations and subscriptions. 
-- | Requires a web socket graphQL server. 
-- | From the @urql/core npm module 
-- | Requires your server to implement GraphQL over WebSocket Protocol
-- | See https://github.com/enisdenjo/graphql-ws details
foreign import data UrqlSubClient :: Type

-- | A client to make graphQL live queries, mutations and subscriptions. 
-- | Requires an SSE capable graphQL server like GraphQL Helix or Yoga
-- | or Mesh with the https://the-guild.dev/graphql/mesh/docs/plugins/live-queries plugin .
-- | From the `@grafbase/url-exchange` npm module 
-- | Could be extended to provide more transports.
-- | See https://github.com/n1ru4l/graphql-live-query#list-of-compatible-transportsservers details
foreign import data UrqlLiveQueryClient :: Type

createClient ::
  forall directives querySchema mutationSchema subscriptionSchema.
  UrqlClientOptions -> Effect (Client UrqlClient directives querySchema mutationSchema subscriptionSchema)
createClient = clientOptsToForeign >>> createClientImpl >>> map Client

createGlobalClientUnsafe ::
  forall directives querySchema mutationSchema subscriptionSchema.
  UrqlClientOptions -> Effect (Client UrqlClient directives querySchema mutationSchema subscriptionSchema)
createGlobalClientUnsafe = clientOptsToForeign >>> createGlobalClientUnsafeImpl >>> map Client

createSubscriptionClient ::
  forall directives querySchema mutationSchema subscriptionSchema.
  UrqlSubClientOptions ->
  Effect (Client UrqlSubClient directives querySchema mutationSchema subscriptionSchema)
createSubscriptionClient = clientOptsToForeign >>> createSubscriptionClientImpl >>> map Client

createLiveQueryClient ::
  forall directives querySchema mutationSchema subscriptionSchema.
  UrqlClientOptions ->
  Effect (Client UrqlLiveQueryClient directives querySchema mutationSchema subscriptionSchema)
createLiveQueryClient = clientOptsToForeign >>> createLiveQueryClientImpl >>> map Client


clientOptsToForeign ::
  forall r.
  { headers :: Array RequestHeader
  | r
  } ->
  { headers :: Object String
  | r
  }
clientOptsToForeign opts =
  opts
    { headers = Object.fromFoldable $ map toTup opts.headers
    }
  where
  toTup header = Tuple (name header) (value header)

type UrqlClientOptionsForeign
  = { url :: URL
    , headers :: Object String
    }

type UrqlSubUrqlClientOptionsForeign
  = { url :: URL
    , websocketUrl :: URL
    , headers :: Object String
    }

foreign import createClientImpl :: UrqlClientOptionsForeign -> Effect UrqlClient

foreign import createGlobalClientUnsafeImpl :: UrqlClientOptionsForeign -> Effect UrqlClient

foreign import createSubscriptionClientImpl :: UrqlSubUrqlClientOptionsForeign -> Effect UrqlSubClient

foreign import createLiveQueryClientImpl :: UrqlClientOptionsForeign -> Effect UrqlLiveQueryClient

instance queryClient :: QueryClient UrqlClient Unit Unit where
  clientQuery _ c = queryForeign false c
  clientMutation _ c = queryForeign true c
  defQueryOpts = const unit
  defMutationOpts = const unit

instance queryClientSubscription :: QueryClient UrqlSubClient Unit Unit where
  clientQuery _ c = queryForeign false c
  clientMutation _ c = queryForeign true c
  defQueryOpts = const unit
  defMutationOpts = const unit

queryForeign ::
  forall client o.
  QueryClient client o o =>
  Boolean -> client -> String -> String -> Json -> Aff Json
queryForeign isMutation client name q_ vars = fromEffectFnAff $ fn (unsafeToForeign client) q vars
  where
  fn = if isMutation then mutationImpl else queryImpl

  opStr = if isMutation then "mutation" else "query"

  q = opStr <> " " <> name <> " " <> q_

foreign import queryImpl :: Foreign -> String -> Json -> EffectFnAff Json

foreign import mutationImpl :: Foreign -> String -> Json -> EffectFnAff Json

instance subcriptionClient :: SubscriptionClient UrqlSubClient Unit where
  clientSubscription _ = subscriptionImpl
  defSubOpts _ = unit
foreign import subscriptionImpl ::
  UrqlSubClient ->
  String ->
  Json ->
  (Json -> Effect Unit) ->
  Effect (Effect Unit)

instance liveQueryClient :: LiveQueryClient UrqlLiveQueryClient Unit where
  clientLiveQuery _ = liveQueryImpl
  defLiveOpts _ = unit
foreign import liveQueryImpl ::
  UrqlLiveQueryClient ->
  String ->
  Json ->
  (Json -> Effect Unit) ->
  Effect (Effect Unit)


-- | A create client and query shortcut that creates a global client and caches it for future calls. 
-- | `query` is a safer option for production environments and should generally be used
query_ ::
  forall directives schema query returns.
  GqlQuery directives OpQuery schema query returns =>
  DecodeJson returns =>
  URL -> Proxy schema -> String -> query -> Aff returns
query_ url _ name q = do
  client <-
    liftEffect
      $ createGlobalClientUnsafe
          { url
          , headers: []
          }
  query (client :: Client UrqlClient directives schema _ _) name q

mutation_ ::
  forall directives schema mutation returns.
  GqlQuery directives OpMutation schema mutation returns =>
  DecodeJson returns =>
  URL -> Proxy schema -> String -> mutation -> Aff returns
mutation_ url _ name q = do
  client <-
    liftEffect
      $ createGlobalClientUnsafe
          { url
          , headers: []
          }
  mutation (client :: Client UrqlClient directives _ schema _) name q
