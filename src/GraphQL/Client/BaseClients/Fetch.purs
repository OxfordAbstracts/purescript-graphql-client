module GraphQL.Client.BaseClients.Fetch
  ( FetchClient(..)
  ) where

import Prelude

import Data.Argonaut.Core (Json, stringify)
import Data.Argonaut.Encode (encodeJson)
import Effect.Aff (Aff)
import Fetch (Method(..), Response, fetch)
import Foreign (Foreign)
import GraphQL.Client.Types (class QueryClient)
import Type.Row.Homogeneous (class Homogeneous)
import Unsafe.Coerce (unsafeCoerce)

data FetchClient headers = FetchClient String headers

instance Homogeneous headers String => QueryClient (FetchClient { | headers }) Unit Unit where
  clientQuery _ (FetchClient url headers) name q vars = getFetchJson =<< fetchGql "query" url headers name q vars
  clientMutation _ (FetchClient url headers) name q vars = getFetchJson =<< fetchGql "mutation" url headers name q vars
  defQueryOpts = const unit
  defMutationOpts = const unit

getFetchJson :: Response -> Aff Json
getFetchJson = map foreignToJson <<< _.json
  where
  foreignToJson :: Foreign -> Json
  foreignToJson = unsafeCoerce

fetchGql
  :: forall headers
   . Homogeneous headers String
  => String
  -> String
  -> { | headers }
  -> String
  -> String
  -> Json
  -> Aff Response
fetchGql opStr url headers queryName q vars =
  fetch url
    { method: POST
    , headers
    , body: stringify $ encodeJson
        { query: opStr <> " " <> queryName <> " " <> q
        , variables: vars
        , operationName: queryName
        }
    }
