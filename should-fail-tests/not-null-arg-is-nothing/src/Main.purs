module Main where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import GraphQL.Client.Args (NotNull, (=>>))
import GraphQL.Client.QueryReturns (queryReturns)
import Type.Proxy (Proxy(..))

main :: Effect Unit
main = pure unit

testSchemaProxy :: Proxy TestNotNullParamsSchema
testSchemaProxy = Proxy

type TestNotNullParamsSchema
  = { users ::
        { online :: NotNull Boolean
        }
          -> Array
            { id :: Int
            }
    }

id :: Proxy "id"
id = Proxy

passing1 :: Unit
passing1 =
  const unit
    $ queryReturns testSchemaProxy
        { users: { online: (Nothing :: Maybe Boolean) } =>> { id }
        }
