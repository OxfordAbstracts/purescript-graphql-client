module Generated.Gql.Schema.Admin where

import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import GraphQL.Client.Args (class ArgGql, class RecordArg, type (==>), NotNull)
import GraphQL.Client.ID (ID)
import Generated.Gql.Enum.Colour (Colour)


type Query = 
  { prop :: (Maybe String)
  , widgets :: 
    { colour :: Colour
    }
    ==> (Array Widget)
  }

type Widget = 
  { id :: (Maybe Int)
  , name :: String
  , colour :: Colour
  }
