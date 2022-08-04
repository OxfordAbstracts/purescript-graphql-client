module GraphQL.Client.BaseClients.Apollo.ErrorPolicy where

import Prelude

import Data.Argonaut.Encode (class EncodeJson, encodeJson)

data ErrorPolicy
  = None
  | Ignore
  | All

derive instance eqErrorPolicy :: Eq ErrorPolicy

instance encodeJsonErrorPolicy :: EncodeJson ErrorPolicy where 
  encodeJson = errorPolicyToForeign >>> encodeJson

errorPolicyToForeign :: ErrorPolicy -> String
errorPolicyToForeign = case _ of
  None -> "none"
  Ignore -> "ignore"
  All -> "all"

