module Main where

import Prelude

import Effect (Effect)
import GraphQL.Client.Args (Args, (=>>))
import Type.Proxy (Proxy(..))
import GraphQL.Client.Variable (Var(..))
import GraphQL.Client.Variables (WithVars, getVarsTypeNames, withVars)

main :: Effect Unit
main = pure unit

testSchemaProxy :: Proxy Schema
testSchemaProxy = Proxy

type Schema =
  { users ::
      { online :: Boolean
      }
      -> Array
           { id :: Int
           }
  }

type Query = WithVars
  { users ::
      Args
        { online :: Var "online" Boolean }
        ( { id :: Unit
          }
        )
  }
  { online :: String
  }

query :: Query
query =
  { users: { online: (Var @"online") } =>> { id: unit }
  }
    `withVars` { online: "not a boolean" } -- Incorrect type here

test :: String
test = getVarsTypeNames testSchemaProxy query
