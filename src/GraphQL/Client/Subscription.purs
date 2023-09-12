module GraphQL.Client.Subscription where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson)
import Data.Either (Either)
import GraphQL.Client.Operation (OpSubscription)
import GraphQL.Client.Query (decodeGqlRes, getFullRes)
import GraphQL.Client.SafeQueryName (safeQueryName)
import GraphQL.Client.ToGqlString (toGqlQueryString)
import GraphQL.Client.Types (class GqlQuery, class SubscriptionClient, Client(..), GqlRes, GqlResJson(..), subscriptionEventOpts)
import GraphQL.Client.Variables (getVarsJson)
import Halogen.Subscription (Emitter)
import Type.Proxy (Proxy(..))

subscriptionOpts
  :: forall a returns query schema client directives opts
   . SubscriptionClient client opts
  => GqlQuery directives OpSubscription schema query returns
  => DecodeJson returns
  => (opts -> opts)
  -> Client client { directives :: Proxy directives, subscription :: schema | a }
  -> String
  -> query
  -> Emitter (Either JsonDecodeError returns)
subscriptionOpts = subscriptionOptsWithDecoder decodeJson

subscriptionOptsWithDecoder
  :: forall client directives opts schema query returns a
   . SubscriptionClient client opts
  => GqlQuery directives OpSubscription schema query returns
  => (Json -> Either JsonDecodeError returns)
  -> (opts -> opts)
  -> (Client client { directives :: Proxy directives, subscription :: schema | a })
  -> String
  -> query
  -> Emitter (Either JsonDecodeError returns)
subscriptionOptsWithDecoder decodeFn optsF (Client client) queryNameUnsafe q =
  subscriptionEventOpts optsF client query (getVarsJson (Proxy :: _ schema) q)
    <#> decodeGqlRes decodeFn
  where
  queryName = safeQueryName queryNameUnsafe

  query = "subscription " <> queryName <> " " <> toGqlQueryString q

subscription
  :: forall a returns query schema client directives opts
   . SubscriptionClient client opts
  => GqlQuery directives OpSubscription schema query returns
  => DecodeJson returns
  => Client client { directives :: Proxy directives, subscription :: schema | a }
  -> String
  -> query
  -> Emitter (Either JsonDecodeError returns)
subscription = subscriptionWithDecoder decodeJson

subscriptionWithDecoder
  :: forall client directives opts schema query returns a
   . SubscriptionClient client opts
  => GqlQuery directives OpSubscription schema query returns
  => (Json -> Either JsonDecodeError returns)
  -> (Client client { directives :: Proxy directives, subscription :: schema | a })
  -> String
  -> query
  -> Emitter (Either JsonDecodeError returns)
subscriptionWithDecoder decodeFn = subscriptionOptsWithDecoder decodeFn identity

-- | Run a graphQL subscription, getting the full response,
-- | According to https://spec.graphql.org/June2018/#sec-Response-Format
subscriptionFullRes
  :: forall client directives schema subscription returns a subOpts
   . SubscriptionClient client subOpts
  => GqlQuery directives OpSubscription schema subscription returns
  => (Json -> Either JsonDecodeError returns)
  -> (subOpts -> subOpts)
  -> (Client client { directives :: Proxy directives, subscription :: schema | a })
  -> String
  -> subscription
  -> Emitter (Either JsonDecodeError (GqlRes returns))
subscriptionFullRes decodeFn optsF (Client client) queryNameUnsafe q = ado
  (GqlResJson json) :: GqlResJson schema subscription returns <- subscriptionJson optsF (Client client) queryNameUnsafe q
  in pure $ getFullRes decodeFn json

-- | Run a graphQL subcription, returning the response as json with phantom types
-- | The json will be of the format: https://spec.graphql.org/June2018/#sec-Response-Format
subscriptionJson
  :: forall client directives schema subscription returns a subOpts
   . SubscriptionClient client subOpts
  => GqlQuery directives OpSubscription schema subscription returns
  => (subOpts -> subOpts)
  -> (Client client { directives :: Proxy directives, subscription :: schema | a })
  -> String
  -> subscription
  -> Emitter (GqlResJson schema subscription returns)
subscriptionJson optsF (Client client) queryNameUnsafe q =
  GqlResJson <$> subscriptionEventOpts optsF client query (getVarsJson (Proxy :: _ schema) q)
  where
  queryName = safeQueryName queryNameUnsafe

  query = "subscription " <> queryName <> " " <> toGqlQueryString q

