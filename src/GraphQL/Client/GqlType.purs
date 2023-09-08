module GraphQL.Client.GqlType where

import Prelude

import Data.Maybe (Maybe)
import Data.Monoid (guard)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Prim.Boolean (False, True)
import Prim.Symbol (class Append)
import Type.Proxy (Proxy(..))

class GqlType :: Type -> Symbol -> Boolean -> Constraint
class GqlType t gqlName nullable | t -> gqlName, t -> nullable

class BoolRuntime :: Boolean -> Constraint
class BoolRuntime t where
  toBool :: Proxy t -> Boolean

instance BoolRuntime True where
  toBool _ = true
else instance BoolRuntime False where
  toBool _ = false

data AsGql :: Symbol -> Type -> Type
data AsGql sym t = AsGql

instance GqlType (AsGql sym t) sym True

instance GqlType Boolean "Boolean" True
instance GqlType Int "Int" True
instance GqlType Number "Float" True
instance GqlType String "String" True

instance GqlType t gqlName nullable => GqlType (Maybe t) gqlName True


instance
  ( GqlType t gqlName nullable
  , Append "[" gqlName withOpen
  , Append withOpen "]" arrayGqlName
  ) =>
  GqlType (Array t) arrayGqlName nullable

printGqlType
  :: forall t gqlName nullable
   . GqlType t gqlName nullable
  => IsSymbol gqlName
  => BoolRuntime nullable
  => Proxy t
  -> String
printGqlType _ = reflectSymbol (Proxy :: _ gqlName) <> bang
  where
  bang = guard (not toBool (Proxy :: _ nullable)) "!"