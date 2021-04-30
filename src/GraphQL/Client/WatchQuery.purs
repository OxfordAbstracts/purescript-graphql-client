module GraphQL.Client.WatchQuery where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson)
import Data.Either (Either)
import GraphQL.Client.Query (decodeGqlRes)
import GraphQL.Client.SafeQueryName (safeQueryName)
import GraphQL.Client.ToGqlString (toGqlQueryString)
import GraphQL.Client.Types (class GqlQuery, class WatchQueryClient, Client(..), watchQueryEventOpts)
import Halogen.Subscription (Emitter)

watchQueryOpts ::
  forall b a returns query schema client opts.
  WatchQueryClient client opts =>
  GqlQuery schema query returns =>
  DecodeJson returns =>
  (opts -> opts) -> Client client schema a b -> String -> query -> Emitter (Either JsonDecodeError returns)
watchQueryOpts = watchQueryOptsWithDecoder decodeJson

watchQueryOptsWithDecoder ::
  forall client opts schema query returns a b.
  WatchQueryClient client opts =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (opts -> opts) -> 
  (Client client schema a b) ->
  String ->
  query ->
  Emitter (Either JsonDecodeError returns)
watchQueryOptsWithDecoder decodeFn optsF (Client client) queryNameUnsafe q =
  watchQueryEventOpts optsF client query
    <#> decodeGqlRes decodeFn
  where
  queryName = safeQueryName queryNameUnsafe

  query = "query " <> queryName <> " " <> toGqlQueryString q


watchQuery ::
  forall b a returns query schema client opts.
  WatchQueryClient client opts =>
  GqlQuery schema query returns =>
  DecodeJson returns =>
  Client client schema a b -> String -> query -> Emitter (Either JsonDecodeError returns)
watchQuery = watchQueryWithDecoder decodeJson

watchQueryWithDecoder ::
  forall client opts schema query returns a b.
  WatchQueryClient client opts =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (Client client schema a b) ->
  String ->
  query ->
  Emitter (Either JsonDecodeError returns)
watchQueryWithDecoder decodeFn = watchQueryOptsWithDecoder decodeFn identity
