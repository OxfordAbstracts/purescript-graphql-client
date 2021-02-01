-- | Creates GraphQL clients
module GraphQL.Client.BaseClients.Apollo
  ( ApolloClientOptions
  , ApolloSubClientOptions
  , ApolloClient
  , ApolloSubClient
  , createClient
  , createSubscriptionClient
  ) where

import Prelude

import Affjax (URL)
import Affjax.RequestHeader (RequestHeader, name, value)
import Data.Argonaut.Core (Json)
import Data.Maybe (Maybe(..))
import Data.Nullable (Nullable, toNullable)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Foreign (Foreign)
import Foreign.Generic (encode)
import Foreign.Object (Object)
import Foreign.Object as Object
import GraphQL.Client.BaseClients.Apollo.ErrorPolicy (ErrorPolicy(..))
import GraphQL.Client.BaseClients.Apollo.FetchPolicy (FetchPolicy)
import GraphQL.Client.Types (class QueryClient, class SubscriptionClient, Client(..))
import Unsafe.Coerce (unsafeCoerce)

type ApolloClientOptions
  = { url :: URL
    , authToken :: Maybe String
    , headers :: Array RequestHeader
    }

type ApolloSubClientOptions
  = { url :: URL
    , websocketUrl :: URL
    , authToken :: Maybe String
    , headers :: Array RequestHeader
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
  , headers :: Array RequestHeader
  | r
  } ->
  { authToken :: Nullable String
  , headers :: Object String 
  | r
  }
clientOptsToForeign opts =
  opts
    { authToken = toNullable opts.authToken
    , headers = Object.fromFoldable $ opts.headers <#> \h -> Tuple (name h) (value h)
    }

type ApolloClientOptionsForeign
  = { url :: URL
    , authToken :: Nullable String
    , headers :: Object String 
    }

type ApolloSubApolloClientOptionsForeign
  = { url :: URL
    , websocketUrl :: URL
    , authToken :: Nullable String
    , headers :: Object String 
    }

instance queryClient ::
  QueryClient
    ApolloClient
    { fetchPolicy :: Maybe FetchPolicy
    , errorPolicy :: ErrorPolicy
    }
    { errorPolicy :: ErrorPolicy
    } where
  clientQuery opts = queryForeign false (encode opts)
  clientMutation opts = queryForeign true (encode opts)
  defQueryOpts = const defQueryOpts
  defMutationOpts = const defMutationOpts

instance queryClientSubscription ::
  QueryClient
    ApolloSubClient
    { fetchPolicy :: Maybe FetchPolicy
    , errorPolicy :: ErrorPolicy
    }
    { errorPolicy :: ErrorPolicy
    } where
  clientQuery opts = queryForeign false (encode opts)
  clientMutation opts = queryForeign true (encode opts)
  defQueryOpts = const defQueryOpts
  defMutationOpts = const defMutationOpts

instance subClientSubscription ::
  SubscriptionClient
    ApolloSubClient
    { fetchPolicy :: Maybe FetchPolicy
    , errorPolicy :: ErrorPolicy
    }
    where
  clientSubscription opts = subscriptionImpl (encode opts)
  defSubOpts = const defQueryOpts

type QueryOpts
  = { fetchPolicy :: Maybe FetchPolicy
    , errorPolicy :: ErrorPolicy
    }

defQueryOpts :: QueryOpts
defQueryOpts =
  { fetchPolicy: Nothing
  , errorPolicy: All
  }

type MutationOpts
  = { errorPolicy :: ErrorPolicy
    }

defMutationOpts :: MutationOpts
defMutationOpts =
  { errorPolicy: All
  }

queryForeign ::
  forall q m client.
  QueryClient client q m =>
  Boolean -> Foreign -> client -> String -> String -> Aff Json
queryForeign isMutation opts client name q_ = fromEffectFnAff $ fn opts (unsafeCoerce client) q
  -- fromEffectFnAff $ fn (apolloOptionsToForeign opts) (unsafeCoerce client) q
  where
  fn = if isMutation then mutationImpl else queryImpl

  opStr = if isMutation then "mutation" else "query"

  q = opStr <> " " <> name <> " " <> q_

foreign import createClientImpl :: ApolloClientOptionsForeign -> Effect ApolloClient

foreign import createSubscriptionClientImpl :: ApolloSubApolloClientOptionsForeign -> Effect ApolloSubClient

foreign import queryImpl :: Foreign -> Foreign -> String -> EffectFnAff Json

foreign import mutationImpl :: Foreign -> Foreign -> String -> EffectFnAff Json

foreign import subscriptionImpl  ::     
    Foreign -> 
    ApolloSubClient ->
    String ->
    (Json -> Effect Unit) ->
    Effect (Effect Unit)