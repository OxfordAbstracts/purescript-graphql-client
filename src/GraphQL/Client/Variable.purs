module GraphQL.Client.Variable where


-- | A graphql variable
data Var :: forall k1 k2. k1 -> k2 -> Type
data Var name a
  = Var
