module GraphQL.Client.BaseClients.Apollo.FetchPolicy where

import Prelude

import Data.Argonaut.Encode (class EncodeJson, encodeJson)


data FetchPolicy
  = CacheFirst
  | CacheOnly
  | CacheAndNetwork
  | NetworkOnly
  | NoCache
  | Standby

derive instance eqFetchPolicy :: Eq FetchPolicy

instance encodeJsonFetchPolicy :: EncodeJson FetchPolicy where 
  encodeJson = fetchPolicyToForeign >>> encodeJson

fetchPolicyToForeign :: FetchPolicy -> String
fetchPolicyToForeign = case _ of
  CacheFirst -> "cache-first"
  CacheOnly -> "cache-only"
  CacheAndNetwork -> "cache-and-network"
  NetworkOnly -> "network-only"
  NoCache -> "no-cache"
  Standby -> "standby"
