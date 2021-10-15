module GraphQL.Client.Directive.Test where

import Prelude
import GraphQL.Client.Directive (class DirectivesTypeCheckTopLevel, ApplyDirective, applyDir)
import GraphQL.Client.Directive.Definition (Directive)
import GraphQL.Client.Directive.Location (MUTATION, QUERY, SUBSCRIPTION)
import GraphQL.Client.Operation (OpMutation(..), OpQuery(..), OpSubscription(..))
import Type.Data.List (type (:>), Nil')
import Type.Proxy (Proxy(..))

-- type level tests
testTopLevelDir ::
  forall directiveDeclarations op q.
  DirectivesTypeCheckTopLevel directiveDeclarations op q =>
  Proxy directiveDeclarations ->
  op ->
  q ->
  Unit
testTopLevelDir _ _ _ = unit

t1 :: Unit
t1 = testTopLevelDir dirs OpQuery $ at_cached { ttl: 1 } unit

t2 :: Unit
t2 = testTopLevelDir dirs OpSubscription $ at_cached { ttl: 1 } unit

t3 :: Unit
t3 = testTopLevelDir dirs OpMutation $ at_custom { a: "val" } unit

at_cached ::
  forall q args.
  args ->
  q ->
  ApplyDirective "cached" args q
at_cached = applyDir (Proxy :: _ "cached")

at_custom ::
  forall q args.
  args ->
  q ->
  ApplyDirective "custom" args q
at_custom = applyDir (Proxy :: _ "custom")

dirs ::
  Proxy
    ( (Directive "cached" { ttl :: Int } (QUERY :> SUBSCRIPTION :> Nil'))
        :> (Directive "custom" { a :: String } (MUTATION :> Nil'))
        :> Nil'
    )
dirs = Proxy
