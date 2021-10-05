module GraphQL.Client.Variable where

import Control.Apply (lift2)
import Data.Symbol (class IsSymbol)
import Heterogeneous.Folding (class Folding, class HFoldl, hfoldl)
import Prim.Row as Row
import Record as Record
import Type.Proxy (Proxy(..))

-- | A graphql variable
data Var :: forall k1 k2. k1 -> k2 -> Type
data Var name a
  = Var

data GetVar
  = GetVar

instance getVarVar ::
  ( IsSymbol name
  , Row.Cons name a () varRec
  , Row.Union acc varRec r3
  , Row.Union varRec acc r3
  , Row.Nub r3 res
  ) =>
  Folding GetVar (Proxy { | acc }) (Var name a) (Proxy { | res }) where
  folding GetVar acc Var =
    let
      varRec :: Proxy (Record varRec)
      varRec = lift2 (Record.insert (Proxy :: Proxy name)) (Proxy :: Proxy a) (Proxy :: Proxy {})
    in
      lift2 Record.merge acc varRec
else instance getVarNested ::
  ( HFoldl GetVar (Proxy {}) { | nested } (Proxy { | subRes })
  , Row.Union acc subRes r3
  , Row.Nub r3 res
  ) =>
  Folding GetVar (Proxy { | acc }) { | nested } (Proxy { | res }) where
  folding GetVar acc nested = lift2 Record.merge acc ((getVars nested) :: Proxy { | subRes })
else instance getVarSkip ::
  Folding GetVar (Proxy { | acc }) a (Proxy { | acc }) where
  folding GetVar acc _ = acc

-- | Get the type of the variables for a graphql query
getVars :: forall query res. HFoldl GetVar (Proxy {}) query res => query -> res
getVars = hfoldl GetVar (Proxy :: Proxy {})

