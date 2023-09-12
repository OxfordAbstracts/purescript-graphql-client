module GraphQL.Client.WatchQuery where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson)
import Data.Either (Either)
import GraphQL.Client.Operation (OpMutation)
import GraphQL.Client.Query (decodeGqlRes)
import GraphQL.Client.SafeQueryName (safeQueryName)
import GraphQL.Client.ToGqlString (toGqlQueryString)
import GraphQL.Client.Types (class GqlQuery, class WatchQueryClient, Client(..), watchQueryEventOpts)
import GraphQL.Client.Variables (getVarsJson)
import Halogen.Subscription (Emitter)
import Type.Proxy (Proxy(..))

watchQueryOpts
  :: forall a returns query schema client directives opts
   . WatchQueryClient client opts
  => GqlQuery directives OpMutation schema query returns
  => DecodeJson returns
  => (opts -> opts)
  -> Client client { directives :: Proxy directives, query :: schema | a }
  -> String
  -> query
  -> Emitter (Either JsonDecodeError returns)
watchQueryOpts = watchQueryOptsWithDecoder decodeJson

watchQueryOptsWithDecoder
  :: forall client directives opts schema query returns a
   . WatchQueryClient client opts
  => GqlQuery directives OpMutation schema query returns
  => (Json -> Either JsonDecodeError returns)
  -> (opts -> opts)
  -> (Client client { directives :: Proxy directives, query :: schema | a })
  -> String
  -> query
  -> Emitter (Either JsonDecodeError returns)
watchQueryOptsWithDecoder decodeFn optsF (Client client) queryNameUnsafe q =
  watchQueryEventOpts optsF client query (getVarsJson (Proxy :: _ schema) q)
    <#> decodeGqlRes decodeFn
  where
  queryName = safeQueryName queryNameUnsafe

  query = "query " <> queryName <> " " <> toGqlQueryString q

watchQuery
  :: forall a returns query schema client directives opts
   . WatchQueryClient client opts
  => GqlQuery directives OpMutation schema query returns
  => DecodeJson returns
  => Client client { directives :: Proxy directives, query :: schema | a }
  -> String
  -> query
  -> Emitter (Either JsonDecodeError returns)
watchQuery = watchQueryWithDecoder decodeJson

watchQueryWithDecoder
  :: forall client directives opts schema query returns a
   . WatchQueryClient client opts
  => GqlQuery directives OpMutation schema query returns
  => (Json -> Either JsonDecodeError returns)
  -> (Client client { directives :: Proxy directives, query :: schema | a })
  -> String
  -> query
  -> Emitter (Either JsonDecodeError returns)
watchQueryWithDecoder decodeFn = watchQueryOptsWithDecoder decodeFn identity
