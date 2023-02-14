module GraphQL.Client.LiveQuery where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson)
import Data.Either (Either)
import GraphQL.Client.Operation (OpQuery)
import GraphQL.Client.Query (decodeGqlRes)
import GraphQL.Client.SafeQueryName (safeQueryName)
import GraphQL.Client.ToGqlString (toGqlQueryString)
import GraphQL.Client.Types (class GqlQuery, class LiveQueryClient, Client(..), liveQueryEventOpts)
import GraphQL.Client.Variables (getVarsJson)
import Halogen.Subscription (Emitter)

liveQueryOpts ::
  forall b a returns query schema client directives opts.
  LiveQueryClient client opts =>
  GqlQuery directives OpQuery schema query returns =>
  DecodeJson returns =>
  (opts -> opts) -> Client client directives schema a b -> String -> query -> Emitter (Either JsonDecodeError returns)
liveQueryOpts = liveQueryOptsWithDecoder decodeJson

liveQueryOptsWithDecoder ::
  forall client directives opts schema query returns a b.
  LiveQueryClient client opts =>
  GqlQuery directives OpQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (opts -> opts) ->
  (Client client directives schema a b) ->
  String ->
  query ->
  Emitter (Either JsonDecodeError returns)
liveQueryOptsWithDecoder decodeFn optsF (Client client) queryNameUnsafe q =
  liveQueryEventOpts optsF client query (getVarsJson q)
    <#> decodeGqlRes decodeFn
  where
  queryName = safeQueryName queryNameUnsafe

  query = "query " <> queryName <> " " <> toGqlQueryString q

liveQuery ::
  forall b a returns query schema client directives opts.
  LiveQueryClient client opts =>
  GqlQuery directives OpQuery schema query returns =>
  DecodeJson returns =>
  Client client directives schema a b -> String -> query -> Emitter (Either JsonDecodeError returns)
liveQuery = liveQueryWithDecoder decodeJson

liveQueryWithDecoder ::
  forall client directives opts schema query returns a b.
  LiveQueryClient client opts =>
  GqlQuery directives OpQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (Client client directives schema a b) ->
  String ->
  query ->
  Emitter (Either JsonDecodeError returns)
liveQueryWithDecoder decodeFn = liveQueryOptsWithDecoder decodeFn identity
