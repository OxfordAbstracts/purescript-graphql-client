module GraphQL.Client.Query (class GqlQuery, query, queryWithDecoder) where

import Prelude

import Affjax (Error, Response, URL, defaultRequest, printError, request)
import Affjax.RequestBody as RequestBody
import Affjax.RequestHeader (RequestHeader(..))
import Affjax.ResponseFormat as ResponseFormat
import Control.Monad.Except (catchError)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson, getField, printJsonDecodeError)
import Data.Array (intercalate)
import Data.Either (Either(..))
import Data.HTTP.Method as Method
import Data.Maybe (Maybe(..))
import Data.MediaType.Common (applicationJSON)
import Effect.Aff (Aff, error, message, throwError)
import Foreign.NullOrUndefined (undefined)
import GraphQL.Client.QueryReturns (class QueryReturns)
import GraphQL.Client.ToGqlString (class GqlQueryString, toGqlQueryString, toGqlQueryStringFormatted)
import Type.Proxy (Proxy)
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

query ::
  forall returns query schema.
  GqlQuery schema query returns =>
  DecodeJson returns =>
  Proxy schema -> URL -> Array RequestHeader -> String -> query -> Aff returns
query = queryWithDecoder decodeJson

queryWithDecoder ::
  forall schema query returns.
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) -> Proxy schema -> URL -> Array RequestHeader -> String -> query -> Aff returns
queryWithDecoder decodeFn _ url headers queryName q =
  addErrorInfo do
    res <- queryPostForeign url headers queryName $ toGqlQueryString q
    case res of
      Left err ->
        throwError
          $ error
          $ "Response failed to decode to JSON: "
          <> printError err
      Right { body } -> case decodeData body of
        Left err ->
          throwError
            $ error case decodeJson body of
                Right ({ errors } :: { errors :: Array { message :: String } }) -> intercalate ", \n" $ map _.message errors
                _ ->
                  " Response failed to decode from JSON: "
                    <> printJsonDecodeError err
        Right result -> pure result
  where
  addErrorInfo =
    flip catchError \err -> do
      throwError
        $ error
        $ " GraphQL "
        <> show url
        <> ". \nname: "
        <> show queryName
        <> ". \nerror: "
        <> message err
        <> ". \nquery: "
        <> toGqlQueryStringFormatted q

  decodeData :: Json -> Either JsonDecodeError returns
  decodeData json = do
    jsonObj <- decodeJson json
    data_ <- getField jsonObj "data"
    decodeFn data_

queryPostForeign ::
  URL -> Array RequestHeader -> String -> String -> Aff (Either Error (Response Json))
queryPostForeign url headers _ q =
  request
    defaultRequest
      { withCredentials = true
      , url = url
      , method = Left Method.POST
      , responseFormat = ResponseFormat.json
      , content =
        Just
          $ RequestBody.Json
          $ toJson
              { query: q
              , variables: {}
              , operationName: undefined
              }
      , headers = headers <> [ ContentType applicationJSON ]
      }
  where
  toJson ::
    { operationName :: _
    , query :: String
    , variables :: {}
    } ->
    Json
  toJson = unsafeCoerce
