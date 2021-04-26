module GraphQL.Client.BaseClients.Affjax (AffjaxClient(..)) where

import Prelude

import Affjax (Error, Response, URL, defaultRequest, printError, request)
import Affjax.RequestBody as RequestBody
import Affjax.RequestHeader (RequestHeader(..))
import Affjax.ResponseFormat as ResponseFormat
import Data.Argonaut.Core (Json)
import Data.Argonaut.Encode (encodeJson)
import Data.Either (Either(..))
import Data.HTTP.Method as Method
import Data.Maybe (Maybe(..))
import Data.MediaType.Common (applicationJSON)
import Effect.Aff (Aff, error, throwError)
import GraphQL.Client.Types (class QueryClient)

data AffjaxClient
  = AffjaxClient URL (Array RequestHeader)

instance queryClient :: QueryClient AffjaxClient Unit Unit where
  clientQuery _ (AffjaxClient url headers) name q = throwLeft =<< queryPostForeign "query" url headers name q
  clientMutation _ (AffjaxClient url headers) name q = throwLeft =<< queryPostForeign "mutation" url headers name q
  defQueryOpts = const unit
  defMutationOpts = const unit

throwLeft :: forall r body. Either Error { body :: body | r } -> Aff body
throwLeft = case _ of
  Left err -> throwError $ error $ printError err
  Right { body } -> pure body

queryPostForeign ::
  String -> URL -> Array RequestHeader -> String -> String -> Aff (Either Error (Response Json))
queryPostForeign opStr url headers queryName q =
  request
    defaultRequest
      { withCredentials = true
      , url = url
      , method = Left Method.POST
      , responseFormat = ResponseFormat.json
      , content =
        Just
          $ RequestBody.Json
          $ encodeJson
              { query: opStr <> " " <> queryName <> " " <> q
              , variables: {}
              , operationName: queryName
              }
      , headers = headers <> [ ContentType applicationJSON ]
      }
