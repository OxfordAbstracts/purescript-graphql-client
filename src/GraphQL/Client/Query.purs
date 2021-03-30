module GraphQL.Client.Query
  ( query
  , queryWithDecoder
  , queryOptsWithDecoder
  , queryOpts
  , query_
  , mutation
  , mutationWithDecoder
  , mutationOptsWithDecoder
  , mutationOpts
  , mutation_
  , decodeGqlRes
  ) 
  where

import Prelude

import Affjax (URL)
import Control.Monad.Error.Class (class MonadThrow)
import Control.Monad.Except (class MonadError, catchError)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson, getField, printJsonDecodeError)
import Data.Array (intercalate)
import Data.Either (Either(..))
import Effect.Aff (Aff, Error, error, message, throwError)
import Effect.Class (liftEffect)
import Global.Unsafe (unsafeStringify)
import GraphQL.Client.BaseClients.Urql (UrqlClient, createGlobalClientUnsafe)
import GraphQL.Client.SafeQueryName (safeQueryName)
import GraphQL.Client.ToGqlString (class GqlQueryString, toGqlQueryString, toGqlQueryStringFormatted)
import GraphQL.Client.Types (class GqlQuery, class QueryClient, Client(..), clientMutation, clientQuery, defMutationOpts, defQueryOpts)
import Type.Proxy (Proxy(..))

-- | Run a graphQL query with a custom decoder and custom options
queryOptsWithDecoder ::
  forall client schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (queryOpts -> queryOpts) ->
  (Client client schema a b) ->
  String ->
  query ->
  Aff returns
queryOptsWithDecoder d optsF (Client c) = runQuery d opts c (Proxy :: Proxy schema)
  where 

  opts = optsF (defQueryOpts c)


-- | Run a graphQL query with custom options
queryOpts ::
  forall client schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery schema query returns =>
  DecodeJson returns =>
  (queryOpts -> queryOpts) ->
  (Client client schema a b) ->
  String ->
  query ->
  Aff returns
queryOpts = queryOptsWithDecoder decodeJson


-- | Run a graphQL query with a custom decoder
queryWithDecoder ::
  forall client schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (Client client schema a b) ->
  String ->
  query ->
  Aff returns
queryWithDecoder d (Client c) = runQuery d (defQueryOpts c) c (Proxy :: Proxy schema)

-- | Run a graphQL query
query ::
  forall client schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery schema query returns =>
  DecodeJson returns =>
  (Client client schema a b) ->
  String ->
  query ->
  Aff returns
query = queryWithDecoder decodeJson

-- | A create client and query shortcut that creates a global client and caches it for future calls. 
-- | `query` is a safer option for production environments and should generally be used
query_ ::
  forall schema query returns.
  GqlQuery schema query returns =>
  DecodeJson returns =>
  URL -> Proxy schema -> String -> query -> Aff returns
query_ url schema name q = do
  client <-
    liftEffect
      $ createGlobalClientUnsafe
          { url
          , headers: []
          }
  query (client :: Client UrqlClient schema _ _) name q


mutationWithDecoder ::
  forall client schema mutation returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery schema mutation returns =>
  (Json -> Either JsonDecodeError returns) ->
  (Client client a schema b) ->
  String ->
  mutation ->
  Aff returns
mutationWithDecoder d (Client c) = runMutation d (defMutationOpts c) c (Proxy :: Proxy schema)

mutation ::
  forall client schema mutation returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery schema mutation returns =>
  DecodeJson returns =>
  (Client client a schema b) ->
  String ->
  mutation ->
  Aff returns
mutation = mutationWithDecoder decodeJson

-- | Run a graphQL query with a custom decoder and custom options
mutationOptsWithDecoder ::
  forall client schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (mutationOpts -> mutationOpts) ->
  (Client client a schema b) ->
  String ->
  query ->
  Aff returns
mutationOptsWithDecoder d optsF (Client c) = runMutation d opts c (Proxy :: Proxy schema)
  where 
  opts = optsF (defMutationOpts c)

-- | Run a graphQL query with a custom decoder and custom options
mutationOpts ::
  forall client schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery schema query returns =>
  DecodeJson returns =>
  (mutationOpts -> mutationOpts) ->
  (Client client a schema b) ->
  String ->
  query ->
  Aff returns
mutationOpts = mutationOptsWithDecoder decodeJson

mutation_ ::
  forall schema mutation returns.
  GqlQuery schema mutation returns =>
  DecodeJson returns =>
  URL -> Proxy schema -> String -> mutation -> Aff returns
mutation_ url schema name q = do
  client <-
    liftEffect
      $ createGlobalClientUnsafe
          { url
          , headers: []
          }
  mutation (client :: Client UrqlClient _ schema _) name q

runQuery :: 
  forall client schema query returns qOpts mOpts.
  QueryClient client qOpts mOpts =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) -> qOpts -> client -> Proxy schema -> String -> query -> Aff returns
runQuery decodeFn opts client _ queryNameUnsafe q =
  addErrorInfo queryName q do
    json <- clientQuery opts client queryName $ toGqlQueryString q
    decodeJsonData decodeFn json
  where
  queryName = safeQueryName queryNameUnsafe

runMutation :: 
  forall client schema query returns qOpts mOpts.
  QueryClient client qOpts mOpts =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) -> mOpts -> client -> Proxy schema -> String -> query -> Aff returns
runMutation  decodeFn opts client _ queryNameUnsafe q =
  addErrorInfo queryName q do
    json <- clientMutation opts client queryName $ toGqlQueryString q
    decodeJsonData decodeFn json
  where
  queryName = safeQueryName queryNameUnsafe

decodeJsonData :: forall m a. MonadThrow Error m => (Json -> Either JsonDecodeError a) -> Json -> m a
decodeJsonData decodeFn json = case decodeGqlRes decodeFn json of
  Left err ->
    throwError
      $ error case decodeJson json of
          Right ({ errors } :: { errors :: Array { message :: String } }) -> intercalate ", \n" $ map _.message errors
          _ ->
            " Response failed to decode from JSON: "
              <> printJsonDecodeError err
              <> "\n Full response: "
              <> unsafeStringify json
  Right result -> pure result

decodeGqlRes :: forall a. (Json -> Either JsonDecodeError a) -> Json -> Either JsonDecodeError a
decodeGqlRes decodeFn json = do
  jsonObj <- decodeJson json
  data_ <- getField jsonObj "data"
  decodeFn data_

addErrorInfo ::
  forall m a q.
  MonadError Error m =>
  GqlQueryString q =>
  String -> q -> m a -> m a
addErrorInfo queryName q =
  flip catchError \err -> do
    throwError
      $ error
      $ "GraphQL "
      <> ".\nname: "
      <> show queryName
      <> ".\nerror: "
      <> message err
      <> ".\nquery: "
      <> toGqlQueryStringFormatted q

