module GraphQL.Client.Subscription where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson)
import Data.Either (Either, hush)
import FRP.Event (Event, filterMap)
import GraphQL.Client.Query (decodeGqlRes)
import GraphQL.Client.SafeQueryName (safeQueryName)
import GraphQL.Client.ToGqlString (toGqlQueryString)
import GraphQL.Client.Types (class GqlQuery, class SubscriptionClient, Client(..), subscriptionEventOpts)

subscriptionOpts ::
  forall b a returns query schema client opts.
  SubscriptionClient client opts =>
  GqlQuery schema query returns =>
  DecodeJson returns =>
  (opts -> opts) -> Client client a b schema -> String -> query -> Event (Either JsonDecodeError returns)
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
  Event (Either JsonDecodeError returns)
subscriptionOptsWithDecoder decodeFn optsF (Client client) queryNameUnsafe q =
  subscriptionEventOpts optsF client query
    <#> decodeGqlRes decodeFn
  where
  queryName = safeQueryName queryNameUnsafe

  query = "subscription " <> queryName <> " " <> toGqlQueryString q


subscription ::
  forall b a returns query schema client opts.
  SubscriptionClient client opts =>
  GqlQuery schema query returns =>
  DecodeJson returns =>
  Client client a b schema -> String -> query -> Event (Either JsonDecodeError returns)
subscription = subscriptionWithDecoder decodeJson

subscriptionWithDecoder ::
  forall client opts schema query returns a b.
  SubscriptionClient client opts =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  (Client client a b schema) ->
  String ->
  query ->
  Event (Either JsonDecodeError returns)
subscriptionWithDecoder decodeFn =
  subscriptionOptsWithDecoder decodeFn identity

ignoreErrors :: forall err returns. Event (Either err returns) -> Event returns
ignoreErrors = filterMap hush