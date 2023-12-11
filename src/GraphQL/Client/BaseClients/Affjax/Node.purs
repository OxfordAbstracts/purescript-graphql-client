module GraphQL.Client.BaseClients.Affjax.Node (AffjaxNodeClient(..)) where

import Prelude

import Affjax.Node (Error, Response, URL, request)
import Affjax.RequestHeader (RequestHeader)
import Data.Argonaut.Core (Json)
import Data.Either (Either)
import Effect.Aff (Aff)
import GraphQL.Client.BaseClients.Affjax.Internal (makeAffjaxGqlRequest, throwLeft)
import GraphQL.Client.Types (class QueryClient)

data AffjaxNodeClient = AffjaxNodeClient URL (Array RequestHeader)

instance queryClient :: QueryClient AffjaxNodeClient Unit Unit where
  clientQuery _ (AffjaxNodeClient url headers) name q vars = throwLeft =<< queryPostForeign "query" url headers name q vars
  clientMutation _ (AffjaxNodeClient url headers) name q vars = throwLeft =<< queryPostForeign "mutation" url headers name q vars
  defQueryOpts = const unit
  defMutationOpts = const unit

queryPostForeign
  :: String -> URL -> Array RequestHeader -> String -> String -> Json -> Aff (Either Error (Response Json))
queryPostForeign opStr url headers queryName q vars =
  request (makeAffjaxGqlRequest opStr url headers queryName q vars)