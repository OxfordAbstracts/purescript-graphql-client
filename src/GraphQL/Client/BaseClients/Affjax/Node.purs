module GraphQL.Client.BaseClients.Affjax.Node 
  (AffjaxNodeClient(..)
  , query_
  ) where

import Prelude

import Affjax.Node (Error, Response, URL, request)
import Affjax.RequestHeader (RequestHeader)
import Control.Monad.Error.Class (class MonadThrow)
import Effect.Aff (Error) as Aff
import Effect.Aff (Aff, error, message, throwError) 
import Data.Argonaut.Core (Json, stringify)
import Data.Argonaut.Decode (JsonDecodeError, decodeJson, printJsonDecodeError)
import Data.Argonaut.Decode.Class (class DecodeJson)
import Data.Array (intercalate)
import Data.Either (Either(..))
import Effect (Effect)
import Effect.Aff (Aff, error)
import Effect.Class (liftEffect)
import GraphQL.Client.BaseClients.Affjax.Internal (makeAffjaxGqlRequest, throwLeft)
import GraphQL.Client.Operation (OpMutation, OpQuery)
import GraphQL.Client.Query (addErrorInfo, decodeGqlRes, mutation, query)
import GraphQL.Client.SafeQueryName (safeQueryName)
import GraphQL.Client.ToGqlString (toGqlQueryString)
import GraphQL.Client.Types (class GqlQuery, class QueryClient, Client, clientQuery)
import GraphQL.Client.Variables (class VarsTypeChecked, getVarsJson, getVarsTypeNames)
import Type.Proxy (Proxy)

data AffjaxNodeClient
  = AffjaxNodeClient URL (Array RequestHeader)

instance queryClient :: QueryClient AffjaxNodeClient Unit Unit where
  clientQuery _ (AffjaxNodeClient url headers) name q vars = throwLeft =<< queryPostForeign "query" url headers name q vars
  clientMutation _ (AffjaxNodeClient url headers) name q vars = throwLeft =<< queryPostForeign "mutation" url headers name q vars
  defQueryOpts = const unit
  defMutationOpts = const unit

queryPostForeign ::
  String -> URL -> Array RequestHeader -> String -> String -> Json -> Aff (Either Error (Response Json))
queryPostForeign opStr url headers queryName q vars =
  request (makeAffjaxGqlRequest opStr url headers queryName q vars)

-- | A create client and query shortcut that creates a global client and caches it for future calls. 
-- | `query` is a safer option for production environments and should generally be used
query_ ::
  forall directives schema query returns.
  GqlQuery directives OpQuery schema query returns =>
  DecodeJson returns =>
  URL -> Proxy schema -> String -> query -> Aff returns
query_ url schema name q = runQuery decodeJson unit (AffjaxNodeClient url []) schema name q
  where
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

    decodeJsonData :: forall m a. MonadThrow Aff.Error m => (Json -> Either JsonDecodeError a) -> Json -> m a
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



-- mutation_ ::
--   forall directives schema mutation returns.
--   GqlQuery directives OpMutation schema mutation returns =>
--   DecodeJson returns =>
--   URL -> Proxy schema -> String -> mutation -> Aff returns
-- mutation_ url _ name q = do
--   client <-
--     liftEffect
--       $ createGlobalClientUnsafe
--           { url
--           , headers: []
--           }
--   mutation (client :: Client AffjaxNodeClient directives _ schema _) name q
