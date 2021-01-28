-- | Creates GraphQL clients
module GraphQL.Client.Create
  ( ClientOptions
  , SubscriptionClientOptions
  , GraphQlClient
  , GraphQlSubscriptionClient
  , createClient
  , createGlobalClientUnsafe
  , createSubscriptionClient
  , ClientTyped(..)
  ) where

import Prelude
import Affjax (URL)
import Affjax.RequestHeader (RequestHeader, name, value)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Foreign.Object (Object)
import Foreign.Object as Object

newtype ClientTyped client querySchema mutationSchema subscriptionSchema
  = ClientTyped client

type ClientOptions
  = { url :: URL
    , headers :: Array RequestHeader
    }

type SubscriptionClientOptions
  = { url :: URL
    , websocketUrl :: URL
    , headers :: Array RequestHeader
    }

-- | A client to make graphQL queries and mutations
foreign import data GraphQlClient :: Type

-- | A client to make graphQL queries, mutations and subscriptions
foreign import data GraphQlSubscriptionClient :: Type

createClient ::
  forall querySchema mutationSchema subscriptionSchema.
  ClientOptions -> Effect (ClientTyped GraphQlClient querySchema mutationSchema subscriptionSchema)
createClient = clientOptsToForeign >>> createClientImpl >>> map ClientTyped

createGlobalClientUnsafe ::
  forall querySchema mutationSchema subscriptionSchema.
  ClientOptions -> Effect (ClientTyped GraphQlClient querySchema mutationSchema subscriptionSchema)
createGlobalClientUnsafe = clientOptsToForeign >>> createGlobalClientUnsafeImpl >>> map ClientTyped

createSubscriptionClient ::
  forall querySchema mutationSchema subscriptionSchema.
  SubscriptionClientOptions ->
  Effect (ClientTyped GraphQlSubscriptionClient querySchema mutationSchema subscriptionSchema)
createSubscriptionClient = clientOptsToForeign >>> createSubscriptionClientImpl >>> map ClientTyped

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

type ClientOptionsForeign
  = { url :: URL
    , headers :: Object String
    }

type SubscriptionClientOptionsForeign
  = { url :: URL
    , websocketUrl :: URL
    , headers :: Object String
    }

foreign import createClientImpl :: ClientOptionsForeign -> Effect GraphQlClient

foreign import createGlobalClientUnsafeImpl :: ClientOptionsForeign -> Effect GraphQlClient

foreign import createSubscriptionClientImpl :: SubscriptionClientOptionsForeign -> Effect GraphQlSubscriptionClient
