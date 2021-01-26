module Main where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect (Effect)
import GraphQL.Client.Args (type (==>), NotNull, (=>>))
import GraphQL.Client.QueryReturns (class QueryReturns)
import Type.Proxy (Proxy(..))

main :: Effect Unit
main = pure unit

testSchemaProxy :: Proxy TestNotNullParamsSchema
testSchemaProxy = Proxy

type TestNotNullParamsSchema
  = { users ::
        { online :: NotNull Boolean
        }
          ==> Array
            { id :: Int
            }
    }

id :: SProxy "id"
id = SProxy

class QueryReturnsTypeChecks schema query | schema -> query where
  typeChecks :: Proxy schema -> query -> Unit

instance queryReturnsTypeChecks ::
  ( QueryReturns schema query returns
  ) =>
  QueryReturnsTypeChecks schema query where
  typeChecks _ _ = unit

passing1 :: Unit
passing1 =
  typeChecks testSchemaProxy
    { users: { online: Nothing } =>> { id }
    }
