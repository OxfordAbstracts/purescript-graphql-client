module GraphQL.Client.Directive.Definition (Directive, directive) where

import Data.Symbol (class IsSymbol)

-- | A directive definition
data Directive :: forall k1 k2 k3 k4. k1 -> k2 -> k3 -> k4 -> Type
data Directive name description arguments locations = Directive

directive
  :: forall name description arguments location
   . IsSymbol name
  => Directive name description { | arguments } location
directive =
  Directive
