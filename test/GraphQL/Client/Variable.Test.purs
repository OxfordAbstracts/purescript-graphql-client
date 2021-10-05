module GraphQL.Client.Variable.Test where


import GraphQL.Client.Variable (Var(..), getVars)
import Type.Proxy (Proxy)

-- TYPE LEVEL TESTS

test1 :: Proxy
  { var1 :: Int
  }
test1 = getVars { x: Var :: _ "var1" Int }

test2 = getVars { x: Var :: _ "var1" Int, y: Var :: _ "var1" Int }