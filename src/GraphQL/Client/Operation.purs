module GraphQL.Client.Operation where

class GqlOperation :: forall k. k -> Constraint
class GqlOperation a

data OpQuery = OpQuery

instance GqlOperation OpQuery

data OpMutation = OpMutation

instance GqlOperation OpMutation

data OpSubscription = OpSubscription

instance GqlOperation OpSubscription