module GraphQL.Client.Query where

-- module GraphQL.Client.Query (class GqlQuery, query, queryWithDecoder, mutation, mutationWithDecoder) where

import Prelude

import Affjax (Error, Response, URL, defaultRequest, printError, request)
import Affjax.RequestBody as RequestBody
import Affjax.RequestHeader (RequestHeader(..), name, value)
import Affjax.ResponseFormat as ResponseFormat
import Control.Monad.Except (catchError)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson, getField, printJsonDecodeError)
import Data.Array (filter, intercalate)
import Data.Char.Unicode (isAlphaNum)
import Data.Either (Either(..))
import Data.HTTP.Method as Method
import Data.Maybe (Maybe(..))
import Data.MediaType.Common (applicationJSON)
import Data.Nullable (Nullable, toNullable)
import Data.String.CodeUnits (fromCharArray, toCharArray)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff, error, message, throwError)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (info, infoShow, log, logShow)
import Foreign (Foreign)
import Foreign.Object (Object)
import Foreign.Object as Object
import Global.Unsafe (unsafeStringify)
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

type Options schema returns
  = { url :: URL
    , headers :: Array RequestHeader
    , decode :: Json -> Either JsonDecodeError returns
    , schema :: Proxy schema
    , clientId :: String
    }

defaultOptions ::
  forall schema returns.
  DecodeJson returns => Options schema returns
defaultOptions =
  { url: ""
  , headers: []
  , decode: decodeJson
  , schema: Proxy
  , clientId: ""
  }

data Operation
  = Query
  | Mutation
  | Subscription

-- query ::
--   forall returns query schema.
--   GqlQuery schema query returns =>
--   Options schema returns -> String -> query -> Aff returns
-- query opts queryName q = do
--   runOperation Query opts.decode (Proxy :: Proxy schema) opts.url opts.headers queryName q
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
queryWithDecoder = runOperation Query

mutation ::
  forall returns query schema.
  GqlQuery schema query returns =>
  DecodeJson returns =>
  Proxy schema -> URL -> Array RequestHeader -> String -> query -> Aff returns
mutation = mutationWithDecoder decodeJson

mutationWithDecoder ::
  forall schema query returns.
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) -> Proxy schema -> URL -> Array RequestHeader -> String -> query -> Aff returns
mutationWithDecoder = runOperation Mutation

runOperation ::
  forall schema query returns.
  GqlQuery schema query returns =>
  Operation -> (Json -> Either JsonDecodeError returns) -> Proxy schema -> URL -> Array RequestHeader -> String -> query -> Aff returns
runOperation operation decodeFn _ url headers queryNameUnsafe q =
  addErrorInfo do
    client <- liftEffect $ createClient { headers, url, websocketUrl: Nothing }
    json <- query_ client operation queryName $ toGqlQueryString q
    case decodeData json of
      Left err ->
        throwError
          $ error case decodeJson json of
              Right ({ errors } :: { errors :: Array { message :: String } }) -> intercalate ", \n" $ map _.message errors
              _ ->
                " Response failed to decode from JSON: "
                  <> printJsonDecodeError err
      Right result -> pure result
  -- res <- queryPostForeign operation url headers queryName $ toGqlQueryString q
  -- case res of
  --   Left err ->
  --     throwError
  --       $ error
  --       $ "Response failed to decode to JSON: "
  --       <> printError err
  --   Right { body } -> case decodeData body of
  --     Left err ->
  --       throwError
  --         $ error case decodeJson body of
  --             Right ({ errors } :: { errors :: Array { message :: String } }) -> intercalate ", \n" $ map _.message errors
  --             _ ->
  --               " Response failed to decode from JSON: "
  --                 <> printJsonDecodeError err
  --     Right result -> pure result
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

-- queryPostForeign ::
--   Operation -> URL -> Array RequestHeader -> String -> String -> Aff (Either Error (Response Json))
-- queryPostForeign operation url headers queryName q =
--   request
--     defaultRequest
--       { withCredentials = true
--       , url = url
--       , method = Left Method.POST
--       , responseFormat = ResponseFormat.json
--       , content =
--         Just
--           $ RequestBody.Json
--           $ toJson
--               { query: opStr <> " " <> queryName <> " " <> q
--               , variables: {}
--               , operationName: queryName
--               }
--       , headers = headers <> [ ContentType applicationJSON ]
--       }
--   where
--   opStr = case operation of
--     Query -> "query"
--     Mutation -> "mutation"
--     Subscription -> "subscription"

--   toJson ::
--     { operationName :: String
--     , query :: String
--     , variables :: {}
--     } ->
--     Json
--   toJson = unsafeCoerce

foreign import data GraphQlClient :: Type

createClient ::
  { url :: URL
  , websocketUrl :: Maybe String
  , headers :: Array RequestHeader
  } ->
  Effect GraphQlClient
createClient opts = createClientImpl opts 
  { headers = Object.fromFoldable $ map toTup opts.headers 
  , websocketUrl = toNullable opts.websocketUrl
  }
  where
  toTup header = Tuple (name header) (value header)

foreign import createClientImpl ::
  { url :: URL
  , websocketUrl :: Nullable String
  , headers :: Object String
  } ->
  Effect GraphQlClient

query_ :: GraphQlClient -> Operation -> String -> String -> Aff Json
query_ client op name q_ = fromEffectFnAff $ queryImpl client opStr q
  where
  opStr = case op of
    Query -> "query"
    Mutation -> "mutation"
    Subscription -> "subscription"

  q = opStr <> " " <> name <> " " <> q_ 

foreign import queryImpl :: GraphQlClient -> String -> String -> EffectFnAff Json
