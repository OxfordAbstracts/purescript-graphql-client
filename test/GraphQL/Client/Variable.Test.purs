module GraphQL.Client.Variable.Test where

import Prelude

import Data.Maybe (Maybe)
import GraphQL.Client.Alias ((:))
import GraphQL.Client.Alias.Dynamic (Spread(..))
import GraphQL.Client.Args (OrArg(..), (++), (=>>))
import GraphQL.Client.AsGql (AsGql(..))
import GraphQL.Client.Variable (Var(..))
import GraphQL.Client.Variables (getQueryVars, getVarsTypeNames, withVars)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Type.Proxy (Proxy(..))

spec :: Spec Unit
spec =
  describe " GraphQL.Client.QueryVars" do
    describe "getVarsTypeNames" do
      it "should return no vars for an empty query" do
        getVarsTypeNames testSchemaProxy {} `shouldEqual` ""

      it "should return no vars for a query without vars" do
        let
          q =
            { users: { id: unit } }
        getVarsTypeNames testSchemaProxy q `shouldEqual` ""

      it "should return vars for a query with vars" do
        let
          q =
            { users: { id: Var :: Var "myVar" Int }
            , orders: { name: Var :: Var "nameVar" String } =>> { user_id: Var :: Var "myOtherVar" Int }
            }
        getVarsTypeNames testSchemaProxy (q `withVars` {}) `shouldEqual`
          "($nameVar: Name, $myOtherVar: UserId!, $myVar: customId!)"

type TestSchema =
  { users ::
      { online :: Maybe (AsGql "IsOnline" Boolean)
      , id :: AsGql "id" Int
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
      -> Array
           { id :: AsGql "customId" Int
           , name :: AsGql "name" String
           , other_names :: Array (AsGql "name" String)
           }
  , orders ::
      { name :: AsGql "Name" String }
      -> Array
           { user_id :: AsGql "UserId" Int }
  , obj_rel :: { id :: Int }
  }

testSchemaProxy :: Proxy TestSchema
testSchemaProxy = Proxy

-- TYPE LEVEL TESTS
testBasic
  :: Proxy
       { var1 :: Int
       }
testBasic = getQueryVars { x: Var :: _ "var1" Int }

testDuplicates
  :: Proxy
       { var1 :: Int
       }
testDuplicates =
  getQueryVars
    { x: Var :: _ "var1" Int
    , y: Var :: _ "var1" Int
    }

testMixed
  :: Proxy
       { var1 :: Int
       , var2 :: String
       }
testMixed =
  getQueryVars
    { x: Var :: _ "var1" Int
    , y: Var :: _ "var2" String
    }

testNested
  :: Proxy
       { var1 :: Int
       , var2 :: String
       }
testNested =
  getQueryVars
    { x: Var :: _ "var1" Int
    , y:
        { a: Var :: _ "var1" Int
        , b: Var :: _ "var2" String
        }
    }

testArgs
  :: Proxy
       { idVar :: Int
       }
testArgs = getQueryVars ((Var :: _ "idVar" Int) =>> { name: unit })

testAndArgs
  :: Proxy
       { aVar :: Int
       , bVar :: Number
       }
testAndArgs =
  getQueryVars
    ( { a:
          Var :: _ "aVar" Int
      }
        ++ { b: Var :: _ "bVar" Number }
        =>> { name: unit }
    )

testOrArgs
  :: Proxy
       { aVar :: Int
       , bVar :: Number
       }
testOrArgs =
  getQueryVars
    ( { a: if true then ArgL { a: Var :: _ "aVar" Int } else ArgR { b: Var :: _ "bVar" Number }
      }
        =>> { name: unit }
    )

testAlias
  :: Proxy
       { aVar :: Int
       }
testAlias =
  getQueryVars
    { a:
        alias
          :
            { b:
                { arg: Var :: _ "aVar" Int }
                  =>> { field: unit }
            }
    }

testArray
  :: Proxy
       { aVar :: Int
       }
testArray =
  getQueryVars
    { a:
        alias
          :
            { b:
                { arg: [ Var :: _ "aVar" Int ] }
                  =>> { field: unit }
            }
    }

testSpreadAlias
  :: Proxy
       { aVar :: Int
       , bVar :: Number
       }
testSpreadAlias =
  getQueryVars $ Spread alias
    [ { a: Var :: _ "aVar" Int }
    ]
    { field: { a: Var :: _ "bVar" Number } =>> { field: unit }
    }

alias = Proxy :: Proxy "alias"

