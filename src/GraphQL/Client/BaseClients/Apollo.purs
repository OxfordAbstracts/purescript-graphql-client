-- | Creates GraphQL clients
module GraphQL.Client.BaseClients.Apollo
  ( ApolloClientOptions
  , ApolloSubClientOptions
  , ApolloClient
  , ApolloSubClient
  , FetchPolicy(..)
  , createClient
  , createSubscriptionClient
  ) where

import Prelude

import Affjax (URL)
import Data.Argonaut.Core (Json)
import Data.Maybe (Maybe)
import Data.Nullable (Nullable, toNullable)
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Foreign (Foreign)
import GraphQL.Client.Types (class QueryClient, Client(..))
import Unsafe.Coerce (unsafeCoerce)

type ApolloClientOptions
  = { url :: URL
    , authToken :: Maybe String
    }

type ApolloSubClientOptions
  = { url :: URL
    , websocketUrl :: URL
    , authToken :: Maybe String
    }

-- | Apollo client to make graphQL queries and mutations. 
-- | From the @apollo/client npm module
foreign import data ApolloClient :: Type

-- | Apollo client to make graphQL queries, mutations and subscriptions. 
-- | Requires a web socket graphQL server. 
-- | From the @apollo/client npm module 
foreign import data ApolloSubClient :: Type

createClient ::
  forall querySchema mutationSchema subscriptionSchema.
  ApolloClientOptions -> Effect (Client ApolloClient querySchema mutationSchema subscriptionSchema)
createClient = clientOptsToForeign >>> createClientImpl >>> map Client

createSubscriptionClient ::
  forall querySchema mutationSchema subscriptionSchema.
  ApolloSubClientOptions ->
  Effect (Client ApolloSubClient querySchema mutationSchema subscriptionSchema)
createSubscriptionClient = clientOptsToForeign >>> createSubscriptionClientImpl >>> map Client

clientOptsToForeign ::
  forall r.
  { authToken :: Maybe String
  | r
  } ->
  { authToken :: Nullable String
  | r
  }
clientOptsToForeign opts =
  opts
    { authToken = toNullable opts.authToken
    }

type ApolloClientOptionsForeign
  = { url :: URL
    , authToken :: Nullable String
    }

type ApolloSubApolloClientOptionsForeign
  = { url :: URL
    , websocketUrl :: URL
    , authToken :: Nullable String
    }

instance queryClient :: QueryClient ApolloClient {fetchPolicy :: Maybe FetchPolicy} {fetchPolicy :: Maybe FetchPolicy} where
  clientQuery c = queryForeign false c
  clientMutation c = queryForeign true c

instance queryClientSubscription :: QueryClient ApolloSubClient {fetchPolicy :: Maybe FetchPolicy} {fetchPolicy :: Maybe FetchPolicy} where
  clientQuery c = queryForeign false c
  clientMutation c = queryForeign true c

queryForeign ::
  forall opts client.
  QueryClient client opts opts =>
  Boolean -> {fetchPolicy :: Maybe FetchPolicy} -> client -> String -> String -> Aff Json
queryForeign isMutation opts client name q_ = 
  fromEffectFnAff $ fn (unsafeCoerce opts) (unsafeCoerce client) q
  -- fromEffectFnAff $ fn (apolloOptionsToForeign opts) (unsafeCoerce client) q
  where
  fn = if isMutation then mutationImpl else queryImpl

  opStr = if isMutation then "mutation" else "query"

  q = opStr <> " " <> name <> " " <> q_

foreign import createClientImpl :: ApolloClientOptionsForeign -> Effect ApolloClient

foreign import createSubscriptionClientImpl :: ApolloSubApolloClientOptionsForeign -> Effect ApolloSubClient

foreign import queryImpl :: ApolloQueryOptionsForeign -> Foreign -> String -> EffectFnAff Json

foreign import mutationImpl :: ApolloQueryOptionsForeign -> Foreign -> String -> EffectFnAff Json

apolloOptionsToForeign :: { fetchPolicy :: Maybe FetchPolicy } -> ApolloQueryOptionsForeign
apolloOptionsToForeign  o =
  { fetchPolicy: toNullable $ map fetchPolicyToForeign o.fetchPolicy
  }

type ApolloQueryOptionsForeign
  = { fetchPolicy :: Nullable String
    }
