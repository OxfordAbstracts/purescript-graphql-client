module GraphQL.Client.GqlType where

import Data.Argonaut.Core (Json)
import Data.Maybe (Maybe)
import GraphQL.Client.Args (NotNull)
import GraphQL.Client.AsGql (AsGql)

class GqlType :: Type -> Symbol -> Constraint
class GqlType t gqlName | t -> gqlName

instance GqlType (AsGql name t) name

instance GqlType Boolean "Boolean"
instance GqlType Int "Int"
instance GqlType Number "Float"
instance GqlType String "String"
instance GqlType Json "Json"

instance GqlType t gqlName => GqlType (Maybe t) gqlName
instance GqlType t gqlName => GqlType (NotNull t) gqlName
instance GqlType t gqlName => GqlType (Array t) gqlName