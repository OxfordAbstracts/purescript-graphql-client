module GraphQL.Client.BaseClients.Affjax.Internal where

import Prelude

import Affjax (Error, Request, URL, defaultRequest, printError)
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

throwLeft :: forall r body. Either Error { body :: body | r } -> Aff body
throwLeft = case _ of
  Left err -> throwError $ error $ printError err
  Right { body } -> pure body

makeAffjaxGqlRequest
  :: String -> URL -> Array RequestHeader -> String -> String -> Json -> Request Json
makeAffjaxGqlRequest opStr url headers queryName q vars =
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
              , variables: vars
              , operationName: queryName
              }
    , headers = headers <> [ ContentType applicationJSON ]
    }
