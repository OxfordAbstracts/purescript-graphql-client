-- | Creates GraphQL clients
module GraphQL.Client.BaseClients.Urql
  ( UrqlClientOptions
  , UrqlSubClientOptions
  , UrqlClient
  , UrqlSubClient
  , createClient
  , createGlobalClientUnsafe
  , createSubscriptionClient
  ) where

import Prelude

import Affjax (URL)
import Affjax.RequestHeader (RequestHeader, name, value)
import Data.Argonaut.Core (Json)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Foreign (Foreign, unsafeToForeign)
import Foreign.Object (Object)
import Foreign.Object as Object
import GraphQL.Client.Types (class QueryClient, class SubscriptionClient, Client(..))

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
