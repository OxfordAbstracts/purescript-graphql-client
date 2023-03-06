module GraphQL.Client.Types where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (JsonDecodeError)
import Data.Either (Either)
import Data.Maybe (Maybe)
import Effect (Effect)
import Effect.Aff (Aff)
import Foreign.Object (Object)
import GraphQL.Client.Directive (class DirectivesTypeCheckTopLevel)
import GraphQL.Client.Operation (class GqlOperation)
import GraphQL.Client.QueryReturns (class QueryReturns)
import GraphQL.Client.ToGqlString (class GqlQueryString)
import GraphQL.Client.Variables (class VarsTypeChecked)
import Halogen.Subscription (Emitter, makeEmitter)

class GqlQuery :: forall k1 k2. k1 -> k2 -> Type -> Type -> Type -> Constraint
class
  ( QueryReturns schema query returns
  , GqlQueryString query
  , VarsTypeChecked query
  , GqlOperation op
  , DirectivesTypeCheckTopLevel directives op query
  ) <=
  GqlQuery directives op schema query returns
  | schema query -> returns, schema -> directives

instance queriable ::
  ( QueryReturns schema query returns
  , GqlQueryString query
  , VarsTypeChecked query
  , GqlOperation op
  , DirectivesTypeCheckTopLevel directives op query
  ) =>
  GqlQuery directives op schema query returns

newtype Client :: forall k1 k2 k3 k4. Type -> k1 -> k2 -> k3 -> k4 -> Type
newtype Client baseClient directives querySchema mutationSchema subscriptionSchema = Client baseClient

-- | A type class for making a graphql request client.
-- | Apollo, urql and xhr2/Affjax baseClients are provided.
-- | If you wish to use a different base client, 
-- | you can create your own client, 
-- | make it an instance of `QueryClient`
-- | and pass it to query
class QueryClient baseClient queryOpts mutationOpts | baseClient -> queryOpts mutationOpts where
  clientQuery :: queryOpts -> baseClient -> String -> String -> Json -> Aff Json
  clientMutation :: mutationOpts -> baseClient -> String -> String -> Json -> Aff Json
  defQueryOpts :: baseClient -> queryOpts
  defMutationOpts :: baseClient -> mutationOpts

-- | A type class for making graphql subscriptions. 
-- | If you wish to use a different underlying client, 
-- | you can create your own client, 
-- | make it an instance of `SubscriptionClient`
-- | and pass it to `subscription`
class SubscriptionClient baseClient opts | baseClient -> opts where
  clientSubscription
    :: opts
    -> baseClient
    -> String
    -> Json
    -> (Json -> Effect Unit)
    -> Effect (Effect Unit)
  defSubOpts :: baseClient -> opts

-- TODO: Remove `Event` part of name
subscriptionEventOpts :: forall opts c. SubscriptionClient c opts => (opts -> opts) -> c -> String -> Json -> Emitter Json
subscriptionEventOpts optsF client query vars = makeEmitter (clientSubscription (optsF (defSubOpts client)) client query vars)

subscriptionEvent :: forall opts c. SubscriptionClient c opts => c -> String -> Json -> Emitter Json
subscriptionEvent = subscriptionEventOpts identity

-- | A type class for making graphql watch queries (observable queries). 
-- | If you wish to use a different underlying client, 
-- | you can create your own client, 
-- | make it an instance of `WatchQueryClient`
-- | and pass it to `watchQuery`
class WatchQueryClient baseClient opts | baseClient -> opts where
  clientWatchQuery
    :: opts
    -> baseClient
    -> String
    -> Json
    -> (Json -> Effect Unit)
    -> Effect (Effect Unit)
  defWatchOpts :: baseClient -> opts

watchQueryEventOpts :: forall opts c. WatchQueryClient c opts => (opts -> opts) -> c -> String -> Json -> Emitter Json
watchQueryEventOpts optsF client query vars = makeEmitter (clientWatchQuery (optsF (defWatchOpts client)) client query vars)

watchQueryEvent :: forall opts c. WatchQueryClient c opts => c -> String -> Json -> Emitter Json
watchQueryEvent = watchQueryEventOpts identity

-- Full response types 
-- Full responses 
-- | The full graphql query response,
-- | According to https://spec.graphql.org/June2018/#sec-Response-Format
type GqlRes res =
  { data_ :: Either JsonDecodeError res
  , errors :: Maybe (Array GqlError)
  , errors_json :: Maybe (Array Json) -- For deprecated error responses where custom props are not in extensions
  , extensions :: Maybe (Object Json)
  }



type GqlError =
  { message :: String
  , locations :: ErrorLocations
  , path :: Maybe (Array (Either Int String))
  , extensions :: Maybe (Object Json)
  }

type ErrorLocations = Maybe (Array { line :: Int, column :: Int })

-- The gql response as json with phantom types for the schema, query and result
newtype GqlResJson :: Type -> Type -> Type -> Type
newtype GqlResJson schema query res = GqlResJson Json