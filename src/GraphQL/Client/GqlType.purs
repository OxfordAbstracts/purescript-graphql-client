module GraphQL.Client.GqlType where

import Data.Maybe (Maybe)
import Data.Symbol (class IsSymbol, reflectSymbol)
import GraphQL.Client.Args (NotNull)
import GraphQL.Client.AsGql (AsGql)
import Type.Proxy (Proxy(..))

class GqlType :: Type -> Symbol -> Constraint
class GqlType t gqlName | t -> gqlName

instance GqlType (AsGql sym t) name

instance GqlType Boolean "Boolean"
instance GqlType Int "Int"
instance GqlType Number "Float"
instance GqlType String "String"

instance (GqlType t gqlName) => GqlType (Maybe t) gqlName
instance GqlType t name => GqlType (NotNull t) name
instance (GqlType t gqlName) => GqlType (Array t) gqlName

printGqlType
  :: forall t gqlName
   . GqlType t gqlName
  => IsSymbol gqlName
  => Proxy t
  -> String
printGqlType _ = reflectSymbol (Proxy :: _ gqlName)