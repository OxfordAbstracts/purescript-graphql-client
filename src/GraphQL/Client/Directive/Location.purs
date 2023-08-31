module GraphQL.Client.Directive.Location where


class ExecutableDirectiveLocation :: forall k. k -> Constraint
class ExecutableDirectiveLocation a

data QUERY
  = QUERY

instance executableDirectiveLocationQUERY :: ExecutableDirectiveLocation QUERY

data MUTATION
  = MUTATION

instance executableDirectiveLocationMUTATION :: ExecutableDirectiveLocation MUTATION

data SUBSCRIPTION
  = SUBSCRIPTION

instance executableDirectiveLocationSUBSCRIPTION :: ExecutableDirectiveLocation SUBSCRIPTION
