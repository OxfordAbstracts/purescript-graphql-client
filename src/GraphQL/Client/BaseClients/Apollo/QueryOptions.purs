module GraphQL.Client.BaseClients.Apollo.QueryOptions where


import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Foreign.Generic (class Encode)
import GraphQL.Client.BaseClients.Apollo.ErrorPolicy (ErrorPolicy(..))
import GraphQL.Client.BaseClients.Apollo.FetchPolicy (FetchPolicy)

newtype QueryOpts = QueryOpts  QueryOptsRec

derive newtype instance encodeQueryOpts :: Encode QueryOpts

derive instance newtypeQueryOpts :: Newtype QueryOpts _

type QueryOptsRec = 
    { fetchPolicy :: Maybe FetchPolicy 
    , errorPolicy :: ErrorPolicy
    } 

defQueryOpts :: QueryOpts
defQueryOpts = QueryOpts
    { fetchPolicy: Nothing
    , errorPolicy: All
    } 
