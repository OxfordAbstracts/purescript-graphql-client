module GraphQL.Client.GqlTypeArgs where

import Data.Maybe (Maybe)
import Data.Symbol (class IsSymbol, reflectSymbol)
import GraphQL.Client.Args (NotNull)
import GraphQL.Client.AsGql (AsGql)
import Prim.Symbol (class Append)
import Type.Proxy (Proxy(..))

class GqlTypeArgs :: Type -> Symbol -> Constraint
class GqlTypeArgs t gqlName | t -> gqlName

instance GqlTypeArgs (AsGql sym t) sym

instance GqlTypeArgs Boolean "Boolean"
instance GqlTypeArgs Int "Int"
instance GqlTypeArgs Number "Float"
instance GqlTypeArgs String "String"

instance
  ( GqlTypeArgs t gqlName
  , Append gqlName "!" notNullName
  ) =>
  GqlTypeArgs (NotNull t) notNullName

instance GqlTypeArgs t name => GqlTypeArgs (Maybe t) name

instance
  ( GqlTypeArgs t gqlName
  , Append "[" gqlName withOpen
  , Append withOpen "]" arrayGqlName
  ) =>
  GqlTypeArgs (Array t) arrayGqlName

printGqlTypeArgs
  :: forall t gqlName
   . GqlTypeArgs t gqlName
  => IsSymbol gqlName
  => Proxy t
  -> String
printGqlTypeArgs _ = reflectSymbol (Proxy :: _ gqlName)