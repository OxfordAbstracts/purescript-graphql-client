module GraphQL.Client.Variable where

-- | A graphql variable
data Var :: Symbol -> Type -> Type
data Var name a = Var