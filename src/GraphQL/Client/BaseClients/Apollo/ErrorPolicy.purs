module GraphQL.Client.BaseClients.Apollo.ErrorPolicy where

import Prelude

import Foreign.Generic (class Encode, encode)

data ErrorPolicy
  = None
  | Ignore
  | All

derive instance eqErrorPolicy :: Eq ErrorPolicy

instance encodeErrorPolicy :: Encode ErrorPolicy where 
  encode = errorPolicyToForeign >>> encode

errorPolicyToForeign :: ErrorPolicy -> String
errorPolicyToForeign = case _ of
  None -> "none"
  Ignore -> "ignore"
  All -> "all"

