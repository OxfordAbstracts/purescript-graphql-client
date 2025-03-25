module GraphQL.Client.Directive where

import Data.Symbol (class IsSymbol)
import GraphQL.Client.Args (class ArgGql, class ArgGqlAt, class SatisfyNotNullParam)
import GraphQL.Client.Directive.Definition (Directive)
import GraphQL.Client.Directive.Location (MUTATION, QUERY, SUBSCRIPTION)
import GraphQL.Client.Operation (class GqlOperation, OpMutation, OpQuery, OpSubscription)
import Prim.Boolean (False, True)
import Type.Data.List (class IsMember, Cons', Nil')
import Type.Proxy (Proxy)

data ApplyDirective :: forall k. k -> Type -> Type -> Type
data ApplyDirective dir args a = ApplyDirective args a

-- | Apply a directive
applyDir
  :: forall a dir args
   . IsSymbol dir
  => Proxy dir
  -> args
  -> a
  -> ApplyDirective dir args a
applyDir _ = ApplyDirective

class DirectivesTypeCheckTopLevel :: forall k1 k2 k3. k1 -> k2 -> k3 -> Constraint
class GqlOperation op <= DirectivesTypeCheckTopLevel directiveDeclarations op q

instance topLevelTypeCheckPassQuery ::
  DirectivesTypeCheckTopLevelLocation QUERY dirs (ApplyDirective name args q) True =>
  DirectivesTypeCheckTopLevel dirs OpQuery (ApplyDirective name args q)
else instance topLevelTypeCheckPassOpMutation ::
  DirectivesTypeCheckTopLevelLocation MUTATION dirs (ApplyDirective name args q) True =>
  DirectivesTypeCheckTopLevel dirs OpMutation (ApplyDirective name args q)
else instance topLevelTypeCheckPassOpSubscription ::
  DirectivesTypeCheckTopLevelLocation SUBSCRIPTION dirs (ApplyDirective name args q) True =>
  DirectivesTypeCheckTopLevel dirs OpSubscription (ApplyDirective name args q)
else instance topLevelTypeCheckPassNoDirective :: GqlOperation op => DirectivesTypeCheckTopLevel dirs op q

class DirectivesTypeCheckTopLevelLocation :: forall k1 k2 k3 k4. k1 -> k2 -> k3 -> k4 -> Constraint
class DirectivesTypeCheckTopLevelLocation location directiveDeclarations q bool | location directiveDeclarations q -> bool

instance directivesTypeCheckTopLevelLocationFound ::
  ( IsMember location locations result
  , ArgGqlAt name { | params } { | args }
  , SatisfyNotNullParam { | params } { | args }
  ) =>
  DirectivesTypeCheckTopLevelLocation location (Cons' (Directive name description { | params } locations) tail) (ApplyDirective name { | args } q) result
else instance directivesTypeCheckTopLevelLocationNotFound ::
  DirectivesTypeCheckTopLevelLocation location tail q result =>
  DirectivesTypeCheckTopLevelLocation location (Cons' head tail) q result
else instance directivesTypeCheckTopLevelLocationNil' ::
  DirectivesTypeCheckTopLevelLocation location Nil' q False
