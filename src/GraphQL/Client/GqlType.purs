module GraphQL.Client.GqlType where

import Prelude

import Data.Maybe (Maybe)
import Data.Monoid (guard)
import Data.Symbol (class IsSymbol, reflectSymbol)
import GraphQL.Client.Args (NotNull)
import GraphQL.Client.AsGql (AsGql)
import Prim.Boolean (False, True)
import Prim.Symbol (class Append)
import Type.Proxy (Proxy(..))

class GqlType :: Type -> Symbol -> Constraint
class GqlType t gqlName | t -> gqlName

instance
  ( Append sym "!" name
  ) =>
  GqlType (AsGql sym t) name

instance GqlType Boolean "Boolean!"
instance GqlType Int "Int!"
instance GqlType Number "Float!"
instance GqlType String "String!"

instance
  ( GqlType t gqlName
  , Append maybeGqlName "!" gqlName
  ) =>
  GqlType (Maybe t) maybeGqlName

instance GqlType t name => GqlType (NotNull t) name

instance
  ( GqlType t gqlName
  , Append "[" gqlName withOpen
  , Append withOpen "]" arrayGqlName
  ) =>
  GqlType (Array t) arrayGqlName

printGqlType
  :: forall t gqlName
   . GqlType t gqlName
  => IsSymbol gqlName
  => Proxy t
  -> String
printGqlType _ = reflectSymbol (Proxy :: _ gqlName)