module GraphQL.Hasura.ComparisonExp where

type ComparisonExp t =
  { _eq :: t
  , _gt :: t
  , _gte :: t
  , _in :: Array t
  , _is_null :: Boolean
  , _lt :: t
  , _lte :: t
  , _neq :: t
  , _nin :: Array t
  }