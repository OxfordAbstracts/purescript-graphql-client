module GraphQL.Client.BaseClients.Apollo.FetchPolicy where

import Prelude

import Foreign.Generic (class Encode, encode)

data FetchPolicy
  = CacheFirst
  | CacheOnly
  | CacheAndNetwork
  | NetworkOnly
  | NoCache
  | Standby

derive instance eqFetchPolicy :: Eq FetchPolicy

instance encodeFetchPolicy :: Encode FetchPolicy where 
  encode = fetchPolicyToForeign >>> encode

fetchPolicyToForeign :: FetchPolicy -> String
fetchPolicyToForeign = case _ of
  CacheFirst -> "cache-first"
  CacheOnly -> "cache-only"
  CacheAndNetwork -> "cache-and-network"
  NetworkOnly -> "network-only"
  NoCache -> "no-cache"
  Standby -> "standby"
