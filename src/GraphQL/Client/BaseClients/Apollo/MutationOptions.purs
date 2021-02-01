module GraphQL.Client.BaseClients.Apollo.MutationOptions where

import Data.Newtype (class Newtype)
import Foreign.Generic (class Encode)
import GraphQL.Client.BaseClients.Apollo.ErrorPolicy (ErrorPolicy(..))

newtype MutationOpts = MutationOpts  MutationOptsRec

derive instance newtypeMutationOpts :: Newtype MutationOpts _

derive newtype instance encodeMutationOpts :: Encode MutationOpts

type MutationOptsRec = 
    { errorPolicy :: ErrorPolicy
    } 

defMutationOpts :: MutationOpts
defMutationOpts = MutationOpts
    { errorPolicy: All
    } 