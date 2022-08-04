-- | Creates GraphQL Apollo clients
module GraphQL.Client.BaseClients.Apollo
  ( ApolloClientOptions
  , ApolloSubClientOptions
  , ApolloClient
  , ApolloSubClient
  , MutationOpts
  , QueryOpts
  , createClient
  , createSubscriptionClient
  , class IsApollo
  , updateCacheJson
  , updateCache
  , readQuery
  , writeQuery
  ) where

import Prelude

import Affjax (URL)
import Affjax.RequestHeader (RequestHeader, name, value)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson, printJsonDecodeError)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Nullable (Nullable, toMaybe, toNullable)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (error, throwError)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Foreign (unsafeToForeign)
import Foreign.Object (Object)
import Foreign.Object as Object
import GraphQL.Client.BaseClients.Apollo.ErrorPolicy (ErrorPolicy(..))
import GraphQL.Client.BaseClients.Apollo.FetchPolicy (FetchPolicy)
import GraphQL.Client.ToGqlString (toGqlQueryString)
import GraphQL.Client.Types (class GqlQuery, class QueryClient, class SubscriptionClient, class WatchQueryClient, Client(..))
import Unsafe.Coerce (unsafeCoerce)

type ApolloClientOptions =
  { url :: URL
  , authToken :: Maybe String
  , headers :: Array RequestHeader
  }

type ApolloSubClientOptions =
  { url :: URL
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

type QueryOpts =
  { fetchPolicy :: Maybe FetchPolicy
  , errorPolicy :: ErrorPolicy
  }

defQueryOpts :: QueryOpts
defQueryOpts =
  { fetchPolicy: Nothing
  , errorPolicy: All
  }

type MutationOpts =
  { errorPolicy :: ErrorPolicy
  , refetchQueries :: Array String
  , update :: Maybe (Effect Unit)
  , optimisticResponse :: Maybe Json
  }

defMutationOpts :: MutationOpts
defMutationOpts =
  { errorPolicy: All
  , refetchQueries: []
  , update: Nothing
  , optimisticResponse: Nothing
  }

createClient
  :: forall querySchema mutationSchema subscriptionSchema
   . ApolloClientOptions
  -> Effect (Client ApolloClient querySchema mutationSchema subscriptionSchema)
createClient = clientOptsToForeign >>> createClientImpl >>> map Client

createSubscriptionClient
  :: forall querySchema mutationSchema subscriptionSchema
   . ApolloSubClientOptions
  -> Effect (Client ApolloSubClient querySchema mutationSchema subscriptionSchema)
createSubscriptionClient = clientOptsToForeign >>> createSubscriptionClientImpl >>> map Client

clientOptsToForeign
  :: forall r
   . { authToken :: Maybe String
     , headers :: Array RequestHeader
     | r
     }
  -> { authToken :: Nullable String
     , headers :: Object String
     | r
     }
clientOptsToForeign opts =
  opts
    { authToken = toNullable opts.authToken
    , headers = Object.fromFoldable $ opts.headers <#> \h -> Tuple (name h) (value h)
    }

type ApolloClientOptionsForeign =
  { url :: URL
  , authToken :: Nullable String
  , headers :: Object String
  }

type ApolloSubApolloClientOptionsForeign =
  { url :: URL
  , websocketUrl :: URL
  , authToken :: Nullable String
  , headers :: Object String
  }

instance queryClient ::
  QueryClient
    ApolloClient
    QueryOpts
    MutationOpts
  where
  clientQuery opts client name q_ vars =
    fromEffectFnAff $ queryImpl (queryOptsToJson opts) client q vars
    where
    q = "query " <> name <> " " <> q_
  clientMutation opts client name q_ vars =
    fromEffectFnAff $ mutationImpl (mutationOptsToJson opts) client q vars
    where
    q = "mutation " <> name <> " " <> q_
  defQueryOpts = const defQueryOpts
  defMutationOpts = const defMutationOpts

instance queryClientSubscription ::
  QueryClient
    ApolloSubClient
    { fetchPolicy :: Maybe FetchPolicy
    , errorPolicy :: ErrorPolicy
    }
    MutationOpts
  where
  clientQuery opts client name q_ vars =
    fromEffectFnAff $ queryImpl (queryOptsToJson opts) client q vars
    where
    q = "query " <> name <> " " <> q_
  clientMutation opts client name q_ vars =
    fromEffectFnAff $ mutationImpl (mutationOptsToJson opts) client q vars
    where
    q = "mutation " <> name <> " " <> q_

  defQueryOpts = const defQueryOpts
  defMutationOpts = const defMutationOpts

instance subClientSubscription ::
  SubscriptionClient
    ApolloSubClient
    QueryOpts
  where
  clientSubscription opts = subscriptionImpl (unsafeCoerce opts)
  defSubOpts = const defQueryOpts

queryOptsToJson :: QueryOpts -> QueryJsonOpts
queryOptsToJson opts =
  { errorPolicy: encodeJson opts.errorPolicy
  , fetchPolicy: encodeJson opts.fetchPolicy
  }

mutationOptsToJson :: MutationOpts -> MutationJsonOpts
mutationOptsToJson opts = opts
  { errorPolicy = encodeJson opts.errorPolicy
  , optimisticResponse = encodeJson opts.optimisticResponse
  , update = toNullable opts.update
  }

class IsApollo :: forall k. k -> Constraint
class IsApollo cl

instance isApolloClient :: IsApollo ApolloClient

instance isApolloSubClient :: IsApollo ApolloSubClient

-- Update the query results in the cache, using default encoding and decoding
updateCacheJson
  :: forall s m q qSchema c res
   . IsApollo c
  => GqlQuery qSchema q res
  => EncodeJson res
  => DecodeJson res
  => Client c qSchema m s
  -> q
  -> (res -> res)
  -> Effect Unit
updateCacheJson = updateCache encodeJson decodeJson

-- Update the query results in the cache
updateCache
  :: forall c qSchema q m s res
   . IsApollo c
  => GqlQuery qSchema q res
  => (res -> Json)
  -> (Json -> Either JsonDecodeError res)
  -> (Client c qSchema m s)
  -> q
  -> (res -> res)
  -> Effect Unit
updateCache encoder decoder client query f = do
  may <- readQuery decoder client query
  case may of
    Nothing -> pure unit
    Just res -> writeQuery encoder client query $ f res

-- | read a query result from the cache
readQuery
  :: forall c qSchema q m s res
   . IsApollo c
  => GqlQuery qSchema q res
  => (Json -> Either JsonDecodeError res)
  -> (Client c qSchema m s)
  -> q
  -> Effect (Maybe res)
readQuery decoder client query = do
  json <- toMaybe <$> readQueryImpl client (toGqlQueryString query)
  case map decoder json of
    Nothing -> pure Nothing
    Just (Left err) -> throwError $ error $ printJsonDecodeError err
    Just (Right res) -> pure $ Just res

-- | write a query result to the cache
writeQuery
  :: forall c qSchema q m s res
   . IsApollo c
  => GqlQuery qSchema q res
  => (res -> Json)
  -> (Client c qSchema m s)
  -> q
  -> res
  -> Effect Unit
writeQuery encoder client query newData = do
  writeQueryImpl client (toGqlQueryString query) (encoder newData)

instance clientWatchQuery ::
  WatchQueryClient
    ApolloClient
    QueryOpts
  where
  clientWatchQuery opts c = watchQueryImpl (queryOptsToJson opts) (unsafeToForeign c)
  defWatchOpts = const defQueryOpts

instance subClientWatchQuery ::
  WatchQueryClient
    ApolloSubClient
    QueryOpts
  where
  clientWatchQuery opts = watchQueryImpl
    { errorPolicy: encodeJson opts.errorPolicy
    , fetchPolicy: encodeJson opts.fetchPolicy
    }
  defWatchOpts = const defQueryOpts

foreign import createClientImpl :: ApolloClientOptionsForeign -> Effect ApolloClient

foreign import createSubscriptionClientImpl :: ApolloSubApolloClientOptionsForeign -> Effect ApolloSubClient

type QueryJsonOpts =
  { errorPolicy :: Json
  , fetchPolicy :: Json
  }

type MutationJsonOpts =
  { errorPolicy :: Json
  , refetchQueries :: Array String
  , optimisticResponse :: Json
  , update :: Nullable (Effect Unit)
  }

foreign import queryImpl
  ::forall client
  .  QueryJsonOpts
  -> client
  -> String
  -> Json
  -> EffectFnAff Json

foreign import mutationImpl
  :: forall client
   . MutationJsonOpts
  -> client
  -> String
  -> Json
  -> EffectFnAff Json

foreign import readQueryImpl
  :: forall client
   . client
  -> String
  -> Effect (Nullable Json)

foreign import writeQueryImpl
  :: forall client
   . client
  -> String
  -> Json
  -> Effect Unit

foreign import subscriptionImpl
  :: forall client
   . client
  -> ApolloSubClient
  -> String
  -> Json
  -> (Json -> Effect Unit)
  -> Effect (Effect Unit)

foreign import watchQueryImpl
  :: forall client
   . QueryJsonOpts
  -> client
  -> String
  -> Json
  -> (Json -> Effect Unit)
  -> Effect (Effect Unit)
