module GraphQL.Client.Query where

-- module GraphQL.Client.Query (class GqlQuery, query, queryWithDecoder, mutation, mutationWithDecoder) where

import Prelude

import Affjax (URL)
import Control.Monad.Except (catchError)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson, getField, printJsonDecodeError)
import Data.Array (filter, intercalate)
import Data.Char.Unicode (isAlphaNum)
import Data.Either (Either(..))
import Data.String.CodeUnits (fromCharArray, toCharArray)
import Effect.Aff (Aff, error, message, throwError)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Effect.Class (liftEffect)
import Foreign (Foreign)
import GraphQL.Client.Create (ClientTyped(..), GraphQlClient, GraphQlSubscriptionClient, createGlobalClientUnsafe)
import GraphQL.Client.QueryReturns (class QueryReturns)
import GraphQL.Client.ToGqlString (class GqlQueryString, toGqlQueryString, toGqlQueryStringFormatted)
import Type.Proxy (Proxy(..))
import Unsafe.Coerce (unsafeCoerce)

class
  ( QueryReturns schema query returns
  , GqlQueryString query
  ) <= GqlQuery schema query returns | schema query -> returns

instance queriable ::
  ( QueryReturns schema query returns
  , GqlQueryString query
  ) =>
  GqlQuery schema query returns

data Operation
  = Query
  | Mutation

opToString :: Operation -> String
opToString = case _ of
  Query -> "query"
  Mutation -> "mutation"

-- | Run a graphQL query with a custom decoder
queryWithDecoder ::
  forall client schema query returns a b.
  QueryClient client =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (ClientTyped client schema a b) -> 
  String -> 
  query -> 
  Aff returns
queryWithDecoder d (ClientTyped c) = runOperation Query d c (Proxy :: Proxy schema)

-- | Run a graphQL query
query ::
  forall client schema query returns a b.
  QueryClient client =>
  GqlQuery schema query returns =>
  DecodeJson returns =>
  (ClientTyped client schema a b) -> String -> query -> Aff returns
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
  query (client :: ClientTyped GraphQlClient schema _ _) name q

mutationWithDecoder ::
  forall client schema query returns a b.
  QueryClient client =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (ClientTyped client a schema b) -> 
  String -> 
  query -> 
  Aff returns
mutationWithDecoder d (ClientTyped c) = runOperation Mutation d c (Proxy :: Proxy schema)

mutation ::
  forall client schema mutation returns a b.
  QueryClient client =>
  GqlQuery schema mutation returns =>
  DecodeJson returns =>
  (ClientTyped client a schema b) -> String -> mutation -> Aff returns
mutation = mutationWithDecoder decodeJson

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
  mutation (client :: ClientTyped GraphQlClient _ schema _) name q

runOperation ::
  forall client schema query returns.
  QueryClient client =>
  GqlQuery schema query returns =>
  Operation -> (Json -> Either JsonDecodeError returns) -> client -> Proxy schema -> String -> query -> Aff returns
runOperation operation decodeFn client _ queryNameUnsafe q =
  addErrorInfo do
    let
      fn = case operation of
        Query -> clientQuery
        Mutation -> clientMutation
    json <- fn client queryName $ toGqlQueryString q
    case decodeData json of
      Left err ->
        throwError
          $ error case decodeJson json of
              Right ({ errors } :: { errors :: Array { message :: String } }) -> intercalate ", \n" $ map _.message errors
              _ ->
                " Response failed to decode from JSON: "
                  <> printJsonDecodeError err
      Right result -> pure result
  where
  queryName =
    queryNameUnsafe
      # toCharArray
      <#> (\ch -> if ch == ' ' then '_' else ch)
      # filter (isAlphaNum || eq '_')
      # fromCharArray
      # \s -> if s == "" then "unnamed_query" else s

  addErrorInfo =
    flip catchError \err -> do
      throwError
        $ error
        $ "GraphQL "
        <> opToString operation
        <> ".\nname: "
        <> show queryName
        <> ".\nerror: "
        <> message err
        <> ".\nquery: "
        <> toGqlQueryStringFormatted q

  decodeData :: Json -> Either JsonDecodeError returns
  decodeData json = do
    jsonObj <- decodeJson json
    data_ <- getField jsonObj "data"
    decodeFn data_

-- | A type class for making the graphql request. 
-- | If you wish to use a different underlying client, 
-- | you can create your own client, 
-- | make it an instance of `QueryClient`
-- | and pass it to query
class QueryClient c where
  clientQuery :: c -> String -> String -> Aff Json
  clientMutation :: c -> String -> String -> Aff Json

instance queryClient :: QueryClient GraphQlClient where
  clientQuery c = queryForeign Query c
  clientMutation c = queryForeign Mutation c

instance queryClientSubscription :: QueryClient GraphQlSubscriptionClient where
  clientQuery c = queryForeign Query c
  clientMutation c = queryForeign Mutation c

queryForeign ::
  forall client.
  QueryClient client =>
  Operation -> client -> String -> String -> Aff Json
queryForeign op client name q_ = fromEffectFnAff $ queryImpl (unsafeCoerce client) opStr q
  where
  opStr = opToString op

  q = opStr <> " " <> name <> " " <> q_

foreign import queryImpl :: Foreign -> String -> String -> EffectFnAff Json
