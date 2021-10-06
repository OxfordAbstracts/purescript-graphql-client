module GraphQL.Client.Subscription where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson)
import Data.Either (Either)
import GraphQL.Client.Query (decodeGqlRes, getFullRes)
import GraphQL.Client.SafeQueryName (safeQueryName)
import GraphQL.Client.ToGqlString (toGqlQueryString)
import GraphQL.Client.Types (class GqlQuery, class SubscriptionClient, Client(..), GqlRes, subscriptionEventOpts)
import GraphQL.Client.Variables (getVarsJson)
import Halogen.Subscription (Emitter)

subscriptionOpts ::
  forall b a returns query schema client opts.
  SubscriptionClient client opts =>
  GqlQuery schema query returns =>
  DecodeJson returns =>
  (opts -> opts) -> Client client a b schema -> String -> query -> Emitter (Either JsonDecodeError returns)
subscriptionOpts = subscriptionOptsWithDecoder decodeJson

subscriptionOptsWithDecoder ::
  forall client opts schema query returns a b.
  SubscriptionClient client opts =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (opts -> opts) -> 
  (Client client a b schema) ->
  String ->
  query ->
  Emitter (Either JsonDecodeError returns)
subscriptionOptsWithDecoder decodeFn optsF (Client client) queryNameUnsafe q =
  subscriptionEventOpts optsF client query (getVarsJson q)
    <#> decodeGqlRes decodeFn
  where
  queryName = safeQueryName queryNameUnsafe

  query = "subscription " <> queryName <> " " <> toGqlQueryString q


subscription ::
  forall b a returns query schema client opts.
  SubscriptionClient client opts =>
  GqlQuery schema query returns =>
  DecodeJson returns =>
  Client client a b schema -> String -> query -> Emitter (Either JsonDecodeError returns)
subscription = subscriptionWithDecoder decodeJson

subscriptionWithDecoder ::
  forall client opts schema query returns a b.
  SubscriptionClient client opts =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (Client client a b schema) ->
  String ->
  query ->
  Emitter (Either JsonDecodeError returns)
subscriptionWithDecoder decodeFn =
  subscriptionOptsWithDecoder decodeFn identity

-- | Run a graphQL subscription, getting the full response,
-- | According to https://spec.graphql.org/June2018/#sec-Response-Format
subscriptionFullRes ::
  forall client schema subscription returns a b subOpts.
  SubscriptionClient client subOpts =>
  GqlQuery schema subscription returns =>
  DecodeJson returns =>
  (Json -> Either JsonDecodeError returns) ->
  (subOpts -> subOpts) ->
  (Client client a b schema) ->
  String ->
  subscription ->
  Emitter (Either JsonDecodeError (GqlRes returns))
subscriptionFullRes decodeFn optsF (Client client) queryNameUnsafe q = ado
    json <- subscriptionEventOpts optsF client query (getVarsJson q)
    in pure $ getFullRes decodeFn json
  where
  queryName = safeQueryName queryNameUnsafe

  query = "subscription " <> queryName <> " " <> toGqlQueryString q

