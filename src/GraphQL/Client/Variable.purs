module GraphQL.Client.Variable
  ( Var(..)
  , AutoVar(..)
  , autoVar
  ) where

-- | A graphql variable
data Var :: Symbol -> Type -> Type
data Var name a = Var

-- | An automatically named variable that holds a value and generates its name from the provided symbol.
-- | The value will be extracted and passed as a variable to the GraphQL query.
-- | The variable name uses the provided symbol as a hint for naming.
-- |
-- | Example:
-- | ```purescript
-- | { widgets: { id: autoVar @"id" 1 } =>> { name } }
-- | ```
-- | This will generate: `query ($id: Int!) { widgets(id: $id) { name } }`
-- | with variables: `{ "id": 1 }`
data AutoVar :: Symbol -> Type -> Type
data AutoVar name a = AutoVar a

autoVar :: forall @name a. a -> AutoVar name a
autoVar = AutoVar