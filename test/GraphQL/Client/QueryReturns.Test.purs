module GraphQL.Client.QueryReturns.Test where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import GraphQL.Client.Alias ((:))
import GraphQL.Client.Args (type (==>), IgnoreArg(..), NotNull, OrArg(..), (++), (+++), (=>>))
import GraphQL.Client.QueryReturns (class QueryReturns, queryReturns)
import Type.Proxy (Proxy(..))

-- TYPE LEVEL TESTS
type TestSchema
  = { users ::
        { online :: Boolean
        , id :: Int
        , where ::
            { created_at ::
                { eq :: Int
                , lt :: Int
                , gt :: Int
                }
            }
        , is_in :: Array Int
        , is_in_rec :: Array { int :: Int, string :: String }
        }
          ==> Array
            { id :: Int
            , name :: String
            , other_names :: Array String
            }
    , orders ::
        Array
          { user_id :: Int }
    , obj_rel :: { id :: Int }
    , nested1 :: { id :: Int } ==> N1
    }

newtype N1
  = N1
  { nested2 ::
      { id :: Int }
        ==> N2
  }

derive instance newtypeN1 :: Newtype N1 _

newtype N2
  = N2 { val :: String }
  
derive instance newtypeN2 :: Newtype N2 _

testSchemaProxy :: Proxy TestSchema
testSchemaProxy = Proxy

type TestNotNullParamsSchema
  = { users ::
        { online :: NotNull Boolean
        }
          ==> Array
            { id :: Int
            , name :: String
            , other_names :: Array String
            }
    }

testNotNullParamsSchemaProxy :: Proxy TestNotNullParamsSchema
testNotNullParamsSchemaProxy = Proxy

testGet ::
  Proxy
    { users ::
        Array
          { id :: Int
          }
    }
testGet = queryReturns testSchemaProxy query
  where
  query =
    { users: { id }
    }

testGetEmptyArgs ::
  Proxy
    { users ::
        Array
          { id :: Int
          }
    }
testGetEmptyArgs = queryReturns testSchemaProxy query
  where
  query =
    { users: {} =>> { id }
    }

testGetWithName ::
  Proxy
    { users ::
        Array
          { id :: Int
          , name :: String
          , other_names :: Array String
          }
    , obj_rel :: { id :: Int }
    }
testGetWithName = queryReturns testSchemaProxy query
  where
  query =
    { users: { id, name, other_names }
    , obj_rel: { id }
    }

testAlias ::
  Boolean ->
  Proxy
    { obj_rel :: { id :: Int }
    , usersRenamed ::
        Array
          { idRenamed :: Int
          , name :: String
          , other_names :: Array String
          }
    }
testAlias online = queryReturns testSchemaProxy query
  where
  query =
    { usersRenamed: users : { online: online } =>> { idRenamed: id, name, other_names }
    , obj_rel: { id }
    }

testArgs ::
  Proxy
    { users ::
        Array
          { id :: Int
          , name :: String
          , other_names :: Array String
          }
    , obj_rel :: { id :: Int }
    , nested1 :: 
      { nested2 :: { val :: String }
      }
    }
testArgs = queryReturns testSchemaProxy query
  where
  query =
    { users:
        { online: true
        , id: (Nothing :: Maybe Int)
        , where: { created_at: { gt: 10 } }
        }
          =>> { id, name, other_names }
    , obj_rel: { id }
    , nested1: { id: 10 } =>> { nested2: { id: 20 } =>> { val: unit } }
    }

testNotNullArgs ::
  Proxy
    { users ::
        Array
          { id :: Int
          , name :: String
          , other_names :: Array String
          }
    }
testNotNullArgs = queryReturns testNotNullParamsSchemaProxy query
  where
  query =
    { users:
        { online: false
        }
          =>> { id, name, other_names }
    }

testArrayArgs ::
  Proxy
    { users ::
        Array
          { id :: Int
          }
    }
testArrayArgs =
  queryReturns testSchemaProxy
    { users: { is_in: [ 1, 2, 3 ] } =>> { id }
    }

testArrayArgsOne ::
  Proxy
    { users ::
        Array
          { id :: Int
          }
    }
testArrayArgsOne =
  queryReturns testSchemaProxy
    { users: { is_in: 1 } =>> { id }
    }

testArrayArgsAnd ::
  Proxy
    { users ::
        Array
          { id :: Int
          }
    }
testArrayArgsAnd =
  queryReturns testSchemaProxy
    { users: { is_in: 1 ++ 2 ++ 3 } =>> { id }
    }

testArrayArgsAndRec ::
  Proxy
    { users ::
        Array
          { id :: Int
          }
    }
testArrayArgsAndRec =
  queryReturns testSchemaProxy
    { users:
        { is_in_rec:
            { int: 0 } ++ { string: "" } ++ { string: "" }
        }
          =>> { id }
    }
testArrayArgsAndOrRec ::
  Proxy
    { users ::
        Array
          { id :: Int
          }
    }
testArrayArgsAndOrRec =
  queryReturns testSchemaProxy
    { users:
        { is_in_rec:
            { int: 0 } ++ ignoreOrStr false ++ ignoreOrStr true
        }
          =>> { id }
    }
    
testArrayArgsAndsRec ::
  Proxy
    { users ::
        Array
          { id :: Int
          }
    }
testArrayArgsAndsRec =
  queryReturns testSchemaProxy
    { users:
        { is_in_rec:
            [{ int: 0 }] +++ ((ArgR [ignoreOrStr true, ignoreOrStr false]) :: OrArg IgnoreArg _)
        }
          =>> { id }
    }


ignoreOrStr :: Boolean -> OrArg IgnoreArg
     { string :: String
     }
ignoreOrStr false =  ArgL IgnoreArg
ignoreOrStr true =  ArgR {string: ""}



id :: Proxy "id"
id = Proxy

idRenamed :: Proxy "idRenamed"
idRenamed = Proxy

name :: Proxy "name"
name = Proxy

users :: Proxy "users"
users = Proxy

name_alias :: Proxy "name_alias"
name_alias = Proxy

other_names :: Proxy "other_names"
other_names = Proxy

class QueryReturnsTypeChecks :: forall k. k -> Type -> Constraint
class QueryReturnsTypeChecks schema query where
  typeChecks :: Proxy schema -> query -> Unit

instance queryReturnsTypeChecks ::
  ( QueryReturns schema query returns
  ) =>
  QueryReturnsTypeChecks schema query where
  typeChecks _ _ = unit

passing1 :: Unit
passing1 =
  typeChecks testSchemaProxy
    { users: { id }
    }

passing2 :: Unit
passing2 =
  typeChecks testNotNullParamsSchemaProxy
    { users: { online: false } =>> { id }
    }

type TestNestedParamsSchema
  = { users ::
        { online :: NotNull Boolean
        , nested :: { required :: NotNull Int, optional :: String }
        }
          ==> Array
            { id :: Int
            , name :: String
            , other_names :: Array String
            }
    }

testNestedParamsSchemaProxy :: Proxy TestNestedParamsSchema
testNestedParamsSchemaProxy = Proxy

passingTestNestedParamsSchema1 :: Unit
passingTestNestedParamsSchema1 =
  typeChecks testNestedParamsSchemaProxy
    { users: { online: true } =>> { id }
    }

passingTestNestedParamsSchema2 :: Unit
passingTestNestedParamsSchema2 =
  typeChecks testNestedParamsSchemaProxy
    { users: { online: false, nested: { required: 1 } } =>> { id }
    }

type TestCircularNewtypeSchema
  = { top :: TopLevel
    }

newtype TopLevel
  = TopLevel
  { child :: ChildLevel }

derive instance newTypeTopLevel :: Newtype TopLevel _

newtype ChildLevel
  = ChildLevel
  { top :: TopLevel
  , val :: Int
  }

derive instance newTypeChildLevel :: Newtype ChildLevel _

testCircularNewtypeSchemaProxy :: Proxy TestCircularNewtypeSchema
testCircularNewtypeSchemaProxy = Proxy

passingCircularNewtypeSchema1 :: Unit
passingCircularNewtypeSchema1 =
  typeChecks testCircularNewtypeSchemaProxy
    { top: { child: { val: unit } }
    }

passingCircularNewtypeSchema2 :: Unit
passingCircularNewtypeSchema2 =
  typeChecks testCircularNewtypeSchemaProxy
    { top: { child: { top: { child: { val: unit } } } }
    }
