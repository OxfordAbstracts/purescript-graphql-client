module GraphQL.Client.Query
  ( addErrorInfo
  , decodeError
  , decodeErrorsMaybe
  , decodeGqlRes
  , getFullRes
  , mutation
  , mutationFullRes
  , mutationJson
  , mutationOpts
  , mutationOptsWithDecoder
  , mutationWithDecoder
  , mutation_
  , query
  , queryFullRes
  , queryJson
  , queryOpts
  , queryOptsWithDecoder
  , queryWithDecoder
  , query_
  )
  where

import Prelude

import Affjax (URL)
import Control.Monad.Error.Class (class MonadThrow)
import Control.Monad.Except (class MonadError, catchError)
import Data.Argonaut.Core (Json, stringify)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson, printJsonDecodeError)
import Data.Argonaut.Decode.Combinators (getField, (.:), (.:?))
import Data.Array (intercalate, mapMaybe)
import Data.Either (Either(..), hush)
import Data.Maybe (Maybe(..))
import Data.Traversable (traverse)
import Effect.Aff (Aff, Error, error, message, throwError)
import Effect.Class (liftEffect)
import Foreign.Object (Object)
import GraphQL.Client.BaseClients.Urql (UrqlClient, createGlobalClientUnsafe)
import GraphQL.Client.Operation (OpMutation, OpQuery)
import GraphQL.Client.SafeQueryName (safeQueryName)
import GraphQL.Client.ToGqlString (class GqlQueryString, toGqlQueryString, toGqlQueryStringFormatted)
import GraphQL.Client.Types (class GqlQuery, class QueryClient, Client(..), GqlError, GqlRes, GqlResJson(..), clientMutation, clientQuery, defMutationOpts, defQueryOpts)
import GraphQL.Client.Variables (class VarsTypeChecked, getVarsJson, getVarsTypeNames)
import Type.Proxy (Proxy(..))

-- | Run a graphQL query with a custom decoder and custom options
queryOptsWithDecoder ::
  forall client directives schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery directives OpQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (queryOpts -> queryOpts) ->
  (Client client directives schema a b) ->
  String ->
  query ->
  Aff returns
queryOptsWithDecoder d optsF (Client c) name q = 
  --  runQuery undef undef undef (Proxy :: Proxy schema) undef q
   runQuery d opts c (Proxy :: Proxy schema) name q
  where
  opts = optsF (defQueryOpts c)

-- | Run a graphQL query with custom options
queryOpts ::
  forall client directives schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery directives OpQuery schema query returns =>
  DecodeJson returns =>
  (queryOpts -> queryOpts) ->
  (Client client directives schema a b) ->
  String ->
  query ->
  Aff returns
queryOpts = queryOptsWithDecoder decodeJson

-- | Run a graphQL query with a custom decoder
queryWithDecoder ::
  forall client directives schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery directives OpQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (Client client directives schema a b) ->
  String ->
  query ->
  Aff returns
queryWithDecoder d (Client c) = runQuery d (defQueryOpts c) c (Proxy :: Proxy schema)

-- | Run a graphQL query
query ::
  forall client directives schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery directives OpQuery schema query returns =>
  DecodeJson returns =>
  (Client client directives schema a b) ->
  String ->
  query ->
  Aff returns
query = queryWithDecoder decodeJson

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

mutationWithDecoder ::
  forall client directives schema mutation returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery directives OpMutation schema mutation returns =>
  (Json -> Either JsonDecodeError returns) ->
  (Client client directives a schema b) ->
  String ->
  mutation ->
  Aff returns
mutationWithDecoder d (Client c) = runMutation d (defMutationOpts c) c (Proxy :: Proxy schema)

mutation ::
  forall client directives schema mutation returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery directives OpMutation schema mutation returns =>
  DecodeJson returns =>
  (Client client directives a schema b) ->
  String ->
  mutation ->
  Aff returns
mutation = mutationWithDecoder decodeJson
-- | Run a graphQL query with a custom decoder and custom options
mutationOptsWithDecoder ::
  forall client directives schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery directives OpMutation schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (mutationOpts -> mutationOpts) ->
  (Client client directives a schema b) ->
  String ->
  query ->
  Aff returns
mutationOptsWithDecoder d optsF (Client c) = runMutation d opts c (Proxy :: Proxy schema)
  where
  opts = optsF (defMutationOpts c)

-- | Run a graphQL query with a custom decoder and custom options
mutationOpts ::
  forall client directives schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery directives OpMutation schema query returns =>
  DecodeJson returns =>
  (mutationOpts -> mutationOpts) ->
  (Client client directives a schema b) ->
  String ->
  query ->
  Aff returns
mutationOpts = mutationOptsWithDecoder decodeJson

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

runQuery ::
  forall client directives schema query returns qOpts mOpts.
  QueryClient client qOpts mOpts =>
  GqlQuery directives OpQuery schema query returns =>
  VarsTypeChecked query =>
  (Json -> Either JsonDecodeError returns) ->
  qOpts ->
  client ->
  Proxy schema ->
  String ->
  query ->
  Aff returns
runQuery decodeFn opts client _ queryNameUnsafe q =
  addErrorInfo queryName q do
    json <- clientQuery opts client queryName (getVarsTypeNames q <> toGqlQueryString q) (getVarsJson q)
    decodeJsonData decodeFn json
  where
  queryName = safeQueryName queryNameUnsafe

runMutation ::
  forall client directives schema query returns qOpts mOpts.
  QueryClient client qOpts mOpts =>
  GqlQuery directives OpMutation schema query returns =>
  (Json -> Either JsonDecodeError returns) -> mOpts -> client -> Proxy schema -> String -> query -> Aff returns
runMutation decodeFn opts client _ queryNameUnsafe q =
  addErrorInfo queryName q do
    json <- clientMutation opts client queryName (getVarsTypeNames q <> toGqlQueryString q) (getVarsJson q)
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
              <> stringify json
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

-- | Run a graphQL query, getting the full response,
-- | According to https://spec.graphql.org/June2018/#sec-Response-Format
queryFullRes ::
  forall client directives schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery directives OpQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (queryOpts -> queryOpts) ->
  (Client client directives schema a b) ->
  String ->
  query ->
  Aff (GqlRes returns)
queryFullRes decodeFn optsF (Client client) queryNameUnsafe q =
  addErrorInfo queryName q do
    (GqlResJson json) :: GqlResJson schema query returns <- queryJson optsF (Client client) queryNameUnsafe q
    pure $ getFullRes decodeFn json
  where
  queryName = safeQueryName queryNameUnsafe

-- | Run a graphQL query, returning the response as json with phantom types
-- | The json will be of the format: https://spec.graphql.org/June2018/#sec-Response-Format
queryJson ::
  forall client directives schema query returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery directives OpQuery schema query returns =>
  (queryOpts -> queryOpts) ->
  (Client client directives schema a b) ->
  String ->
  query ->
  Aff (GqlResJson schema query returns)
queryJson optsF (Client client) queryNameUnsafe q =
  GqlResJson <$> clientQuery opts client queryName (toGqlQueryString q) (getVarsJson q)
  where
  opts = optsF (defQueryOpts client)
  queryName = safeQueryName queryNameUnsafe

-- | Run a graphQL mutation, getting the full response,
-- | According to https://spec.graphql.org/June2018/#sec-Response-Format
mutationFullRes ::
  forall client directives schema mutation returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery directives OpMutation schema mutation returns =>
  (Json -> Either JsonDecodeError returns) ->
  (mutationOpts -> mutationOpts) ->
  (Client client directives a schema b) ->
  String ->
  mutation ->
  Aff (GqlRes returns)
mutationFullRes decodeFn optsF (Client client) queryNameUnsafe q =
  addErrorInfo queryName q do
    (GqlResJson json) :: GqlResJson schema mutation returns <- mutationJson optsF (Client client) queryNameUnsafe q
    pure $ getFullRes decodeFn json
  where
  queryName = safeQueryName queryNameUnsafe

-- | Run a graphQL mutation, returning the response as json with phantom types
-- | The json will be of the format: https://spec.graphql.org/June2018/#sec-Response-Format
mutationJson ::
  forall client directives schema mutation returns a b queryOpts mutationOpts.
  QueryClient client queryOpts mutationOpts =>
  GqlQuery directives OpMutation schema mutation returns =>
  (mutationOpts -> mutationOpts) ->
  (Client client directives a schema b) ->
  String ->
  mutation ->
  Aff (GqlResJson schema mutation returns)
mutationJson optsF (Client client) queryNameUnsafe q =
  GqlResJson <$> clientMutation opts client queryName (toGqlQueryString q) (getVarsJson q)
  where
  opts = optsF (defMutationOpts client)

  queryName = safeQueryName queryNameUnsafe

getFullRes ::
  forall res.
  (Json -> Either JsonDecodeError res) ->
  Json ->
  GqlRes res
getFullRes decodeFn json =
  let
    data_ = decodeGqlRes decodeFn json

    errors = getErrors json

    extensions = getExtensions json
  in
    { data_
    , errors_json: errors
    , errors: map decodeErrorsMaybe errors
    , extensions
    }


getErrors :: Json -> Maybe (Array Json)
getErrors json = case decodeJson json of
  Right ({ errors } :: { errors :: _ }) -> Just errors
  _ -> Nothing

getExtensions :: Json -> Maybe (Object Json)
getExtensions json = case decodeJson json of
  Right ({ extensions } :: { extensions :: _ }) -> Just extensions
  _ -> Nothing

decodeErrorsMaybe :: Array Json -> Array GqlError
decodeErrorsMaybe = mapMaybe (decodeError >>> hush)

decodeError :: Json -> Either JsonDecodeError GqlError
decodeError json = do
  obj :: Object Json <- decodeJson json
  message <- decodeJson =<< obj .: "message"
  locations <- traverse decodeJson =<< obj .:? "locations"
  path <- traverse decodeJson =<< obj .:? "path"
  extensions <- traverse decodeJson =<< obj .:? "extensions"
  pure
    { message
    , locations
    , path
    , extensions
    }
