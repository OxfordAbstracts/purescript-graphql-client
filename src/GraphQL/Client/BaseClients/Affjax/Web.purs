module GraphQL.Client.BaseClients.Affjax.Web (AffjaxWebClient(..)) where

import Prelude

import Affjax.RequestHeader (RequestHeader)
import Affjax.Web (Error, Response, URL, request)
import Data.Argonaut.Core (Json)
import Data.Either (Either)
import Effect.Aff (Aff)
import GraphQL.Client.BaseClients.Affjax.Internal (makeAffjaxGqlRequest, throwLeft)
import GraphQL.Client.Types (class QueryClient)

data AffjaxWebClient = AffjaxWebClient URL (Array RequestHeader)

instance queryClient :: QueryClient AffjaxWebClient Unit Unit where
  clientQuery _ (AffjaxWebClient url headers) name q vars = throwLeft =<< queryPostForeign "query" url headers name q vars
  clientMutation _ (AffjaxWebClient url headers) name q vars = throwLeft =<< queryPostForeign "mutation" url headers name q vars
  defQueryOpts = const unit
  defMutationOpts = const unit

queryPostForeign
  :: String -> URL -> Array RequestHeader -> String -> String -> Json -> Aff (Either Error (Response Json))
queryPostForeign opStr url headers queryName q vars =
  request (makeAffjaxGqlRequest opStr url headers queryName q vars)