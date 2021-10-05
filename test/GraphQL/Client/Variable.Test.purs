module GraphQL.Client.Variable.Test where

import GraphQL.Client.Variable (Var(..), getVars)
import Type.Proxy (Proxy)

-- TYPE LEVEL TESTS
testBasic ::
  Proxy
    { var1 :: Int
    }
testBasic = getVars { x: Var :: _ "var1" Int }

testDuplicates ::
  Proxy
    { var1 :: Int
    }
testDuplicates =
  getVars
    { x: Var :: _ "var1" Int
    , y: Var :: _ "var1" Int
    }

testMixed ::
  Proxy
    { var1 :: Int
    , var2 :: String
    }
testMixed =
  getVars
    { x: Var :: _ "var1" Int
    , y: Var :: _ "var2" String
    }

testNested ::
  Proxy
    { var1 :: Int
    , var2 :: String
    }
testNested =
  getVars
    { x: Var :: _ "var1" Int
    , y:
        { a: Var :: _ "var1" Int
        , b: Var :: _ "var2" String
        }
    }
