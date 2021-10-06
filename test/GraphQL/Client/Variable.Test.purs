module GraphQL.Client.Variable.Test where

import Prelude

import GraphQL.Client.Alias ((:))
import GraphQL.Client.Alias.Dynamic (Spread(..))
import GraphQL.Client.Args (OrArg(..), (++), (=>>))
import GraphQL.Client.Variable (Var(..))
import GraphQL.Client.Variables (getQueryVars)
import Type.Proxy (Proxy(..))

-- TYPE LEVEL TESTS
testBasic ::
  Proxy
    { var1 :: Int
    }
testBasic = getQueryVars { x: Var :: _ "var1" Int }

testDuplicates ::
  Proxy
    { var1 :: Int
    }
testDuplicates =
  getQueryVars
    { x: Var :: _ "var1" Int
    , y: Var :: _ "var1" Int
    }

testMixed ::
  Proxy
    { var1 :: Int
    , var2 :: String
    }
testMixed =
  getQueryVars
    { x: Var :: _ "var1" Int
    , y: Var :: _ "var2" String
    }

testNested ::
  Proxy
    { var1 :: Int
    , var2 :: String
    }
testNested =
  getQueryVars
    { x: Var :: _ "var1" Int
    , y:
        { a: Var :: _ "var1" Int
        , b: Var :: _ "var2" String
        }
    }

testArgs ::
  Proxy
    { idVar :: Int
    }
testArgs = getQueryVars ((Var :: _ "idVar" Int) =>> { name: unit })

testAndArgs ::
  Proxy
    { aVar :: Int
    , bVar :: Number
    }
testAndArgs =
  getQueryVars
    ( { a:
          Var :: _ "aVar" Int
      }
        ++ { b: Var :: _ "bVar" Number }
        =>> { name: unit }
    )

testOrArgs ::
  Proxy
    { aVar :: Int
    , bVar :: Number
    }
testOrArgs =
  getQueryVars
    ( { a: if true then ArgL { a: Var :: _ "aVar" Int} else ArgR  { b: Var :: _ "bVar" Number}
      }
        =>> { name: unit }
    )

testAlias ::
  Proxy
    { aVar :: Int
    }
testAlias =
  getQueryVars
    { a:
        alias
          : { b:
                { arg: Var :: _ "aVar" Int }
                  =>> { field: unit }
            }
    }

testSpreadAlias ::
  Proxy
    { aVar :: Int
    , bVar :: Number
    }
testSpreadAlias =
  getQueryVars $ Spread alias
    [ { a: Var :: _ "aVar" Int }
    ]
    { field: {a:  Var :: _ "bVar" Number }  =>> { field: unit }
    }


alias = Proxy :: Proxy "alias"
