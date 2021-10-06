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
  )
   where

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
import Effect.Aff (Aff, error, throwError)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Foreign (Foreign, unsafeToForeign)
import Foreign.Generic (encode)
import Foreign.Object (Object)
import Foreign.Object as Object
import GraphQL.Client.BaseClients.Apollo.ErrorPolicy (ErrorPolicy(..))
import GraphQL.Client.BaseClients.Apollo.FetchPolicy (FetchPolicy)
import GraphQL.Client.ToGqlString (toGqlQueryString)
import GraphQL.Client.Types (class GqlQuery, class QueryClient, class SubscriptionClient, class WatchQueryClient, Client(..))

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
    QueryOpts
    MutationOpts
    where
  clientQuery opts = queryForeign false (encode opts)
  clientMutation opts =
    queryForeign true
      ( unsafeToForeign
          { errorPolicy: encode opts.errorPolicy
          , refetchQueries: encode opts.refetchQueries
          , update: toNullable opts.update
          , optimisticResponse: toNullable opts.optimisticResponse
          }
      )
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
  clientQuery opts = queryForeign false (encode opts)
  clientMutation opts =
    queryForeign true
      ( unsafeToForeign
          { errorPolicy: encode opts.errorPolicy
          , refetchQueries: encode opts.refetchQueries
          , update: toNullable opts.update
          , optimisticResponse: toNullable opts.optimisticResponse
          }
      )
  defQueryOpts = const defQueryOpts
  defMutationOpts = const defMutationOpts

instance subClientSubscription ::
  SubscriptionClient
    ApolloSubClient
    QueryOpts
    where
  clientSubscription opts = subscriptionImpl (encode opts)
  defSubOpts = const defQueryOpts


queryForeign ::
  forall q m client.
  QueryClient client q m =>
  Boolean -> Foreign -> client -> String -> String ->  Json ->  Aff Json
queryForeign isMutation opts client name q_ vars = fromEffectFnAff $ fn opts (unsafeToForeign client) q vars
  where
  fn = if isMutation then mutationImpl else queryImpl

  opStr = if isMutation then "mutation" else "query"

  q = opStr <> " " <> name <> " " <> q_

class IsApollo :: forall k. k -> Constraint
class IsApollo cl

instance isApolloClient :: IsApollo ApolloClient

instance isApolloSubClient :: IsApollo ApolloSubClient

-- Update the query results in the cache, using default encoding and decoding
updateCacheJson ::
  forall s m q qSchema c res.
  IsApollo c =>
  GqlQuery qSchema q res =>
  EncodeJson res =>
  DecodeJson res =>
  Client c qSchema m s -> q -> (res -> res) -> Effect Unit
updateCacheJson = updateCache encodeJson decodeJson

-- Update the query results in the cache
updateCache ::
  forall c qSchema q m s res.
  IsApollo c =>
  GqlQuery qSchema q res =>
  (res -> Json) ->
  (Json -> Either JsonDecodeError res) ->
  (Client c qSchema m s) ->
  q ->
  (res -> res) ->
  Effect Unit
updateCache encoder decoder client query f = do
  may <- readQuery decoder client query
  case may of
    Nothing -> pure unit
    Just res -> writeQuery encoder client query $ f res

-- | read a query result from the cache
readQuery ::
  forall c qSchema q m s res.
  IsApollo c =>
  GqlQuery qSchema q res =>
  (Json -> Either JsonDecodeError res) -> (Client c qSchema m s) -> q -> Effect (Maybe res)
readQuery decoder client query = do
  json <- toMaybe <$> readQueryImpl (unsafeToForeign client) (toGqlQueryString query)
  case map decoder json of
    Nothing -> pure Nothing
    Just (Left err) -> throwError $ error $ printJsonDecodeError err
    Just (Right res) -> pure $ Just res

-- | write a query result to the cache
writeQuery ::
  forall c qSchema q m s res.
  IsApollo c =>
  GqlQuery qSchema q res =>
  (res -> Json) -> (Client c qSchema m s) -> q -> res -> Effect Unit
writeQuery encoder client query newData = do
  writeQueryImpl (unsafeToForeign client) (toGqlQueryString query) (encoder newData)

instance clientWatchQuery ::
  WatchQueryClient
    ApolloClient
    QueryOpts
    where
  clientWatchQuery opts c = watchQueryImpl (encode opts) (unsafeToForeign c)
  defWatchOpts = const defQueryOpts

instance subClientWatchQuery :: 
  WatchQueryClient
    ApolloSubClient
    QueryOpts 
    where
  clientWatchQuery opts c = watchQueryImpl (encode opts) (unsafeToForeign c)
  defWatchOpts = const defQueryOpts

foreign import createClientImpl :: ApolloClientOptionsForeign -> Effect ApolloClient

foreign import createSubscriptionClientImpl :: ApolloSubApolloClientOptionsForeign -> Effect ApolloSubClient

foreign import queryImpl :: Foreign -> Foreign -> String ->    Json -> EffectFnAff Json

foreign import mutationImpl :: Foreign -> Foreign -> String ->  Json ->  EffectFnAff Json

foreign import readQueryImpl :: Foreign -> String -> Effect (Nullable Json)

foreign import writeQueryImpl :: Foreign -> String -> Json -> Effect Unit

foreign import subscriptionImpl ::
  Foreign ->
  ApolloSubClient ->
  String ->
  Json ->
  (Json -> Effect Unit) ->
  Effect (Effect Unit)

foreign import watchQueryImpl ::
  Foreign ->
  Foreign ->
  String ->
    Json ->

  (Json -> Effect Unit) ->
  Effect (Effect Unit)
