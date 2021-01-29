module GraphQL.Client.Subscription where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson)
import Data.Either (Either)
import FRP.Event (Event)
import GraphQL.Client.Query (decodeGqlRes, sanitizeQueryName)
import GraphQL.Client.ToGqlString (toGqlQueryString)
import GraphQL.Client.Types (class GqlQuery, class SubscriptionClient, Client(..), subscriptionEvent)

subscription ::
  forall b a returns query schema client opts.
  SubscriptionClient client opts =>
  GqlQuery schema query returns =>
  DecodeJson returns =>
  opts -> Client client a b schema -> String -> query -> Event (Either JsonDecodeError returns)
subscription = subscriptionWithDecoder decodeJson

subscriptionWithDecoder ::
  forall client opts schema query returns a b.
  SubscriptionClient client opts =>
  GqlQuery schema query returns =>
  (Json -> Either JsonDecodeError returns) ->
  opts -> 
  (Client client a b schema) ->
  String ->
  query ->
  Event (Either JsonDecodeError returns)
subscriptionWithDecoder decodeFn opts (Client client) queryNameUnsafe q =
  subscriptionEvent opts client query
    <#> decodeGqlRes decodeFn
  where
  queryName = sanitizeQueryName queryNameUnsafe

  query = "subscription " <> queryName <> " " <> toGqlQueryString q
