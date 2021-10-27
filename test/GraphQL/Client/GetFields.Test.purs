module GraphQL.Client.GetFields.Test where

import Prelude
import Data.Argonaut.Core (Json)
import Data.DateTime (DateTime)
import Data.Maybe (Maybe)
import GraphQL.Client.GetFields (getFieldsStandard)
import Type.Proxy (Proxy(..))

-- Type level tests 
type User
  = { id :: Int
    , name :: String
    }

test1 ::
  { id :: Unit
  , name :: Unit
  }
test1 = getFieldsStandard (Proxy :: _ User)

type UserComplex
  = { id :: Int
    , name :: String
    , orders ::
        Array
          { id :: String
          , fulfilled :: Boolean
          , status :: Maybe String
          , created_at :: DateTime
          , fulfilled_at :: Maybe DateTime
          , complaints :: Maybe (Array { subject :: String, body :: String })
          }
    , other_data :: Maybe Json
    }

test2 ::
  { id :: Unit
  , name :: Unit
  , orders ::
      { complaints ::
          { body :: Unit
          , subject :: Unit
          }
      , created_at :: Unit
      , fulfilled :: Unit
      , fulfilled_at :: Unit
      , id :: Unit
      , status :: Unit
      }
  , other_data :: Unit
  }
test2 = getFieldsStandard (Proxy :: _ UserComplex)
