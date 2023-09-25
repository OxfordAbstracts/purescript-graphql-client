module GraphQL.Client.Variable.Test where

import Prelude

import Data.Maybe (Maybe(..))
import GraphQL.Client.Alias ((:))
import GraphQL.Client.Alias.Dynamic (Spread(..))
import GraphQL.Client.Args (OrArg(..), (++), (=>>))
import GraphQL.Client.AsGql (AsGql)
import GraphQL.Client.Variable (Var(..))
import GraphQL.Client.Variables (PropGetGqlVars, getQueryVars, getVarsTypeNames, propGetGqlVars, withVars)
import Heterogeneous.Folding (class HFoldlWithIndex)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Type.Proxy (Proxy(..))

spec :: Spec Unit
spec =
  describe " GraphQL.Client.Variables" do

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
            , orders:
                { name: Var :: Var "nameVar" String } =>>

                  { user_id: Var :: Var "myOtherVar" Int }
            }
        getVarsTypeNames testSchemaProxy
          ( q `withVars`
              { myVar: 1
              , nameVar: "name"
              , myOtherVar: 2
              }
          ) `shouldEqual`
          "($nameVar: Name!, myVar: customId!, myOtherVar: UserId!)"

      it "should return vars for a query with vars in arrays in arguments" do
        let
          q =
            { users:
                { is_in_rec:
                    [ { string: Var :: Var "strVar" String
                      }
                    ]
                } =>>
                  { id: unit }
            } `withVars` { strVar: "strVal" }

        getVarsTypeNames testSchemaProxy q `shouldEqual`
          "($strVar: String!)"

      it "should handle `Maybe` vars" do
        let
          q =
            { users:
                { is_in_rec:
                    [ { string: Var :: _ "strVar" (Maybe String)
                      }
                    ]
                } =>>
                  { id: unit }
            } `withVars` { strVar: Just "strVal" }

        getVarsTypeNames testSchemaProxy q `shouldEqual`
          "($strVar: String)"

      it "should handle `Array` vars" do
        let
          q =
            { users:
                { is_in: (Var :: _ "arrVar" (Array Int))
                } =>>
                  { id: unit }
            } `withVars` { arrVar: [ 1 ] }

        getVarsTypeNames testSchemaProxy q `shouldEqual`

          "($arrVar: [Int!]!)"
      it "should handle `Maybe Array` vars" do
        let
          q =
            { users:
                { is_in: (Var :: _ "arrVar" (Maybe (Array Int)))
                } =>>
                  { id: unit }
            } `withVars` { arrVar: Just [ 1 ] }

        getVarsTypeNames testSchemaProxy q `shouldEqual`
          "($arrVar: [Int!])"
      it "should handle `Array Maybe` vars" do
        let
          q =
            { users:
                { is_in: (Var :: _ "arrVar" (Array (Maybe Int)))
                } =>>
                  { id: unit }
            } `withVars` { arrVar:  [ Just 1 ] }

        getVarsTypeNames testSchemaProxy q `shouldEqual`
          "($arrVar: [Int]!)"

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
           , prop_wo_gql_name :: String
           }
  , orders ::
      { name :: AsGql "Name" String }
      -> Array
           { user_id :: AsGql "UserId" Int }
  , obj_rel :: { id :: Int }
  , int ::
      { i :: Int } -> Int
  }

testSchemaProxy :: Proxy TestSchema
testSchemaProxy = Proxy

-- TYPE LEVEL TESTS

getGqlQueryVars
  :: forall query vars
   . HFoldlWithIndex (PropGetGqlVars TestSchema) (Proxy {}) { | query } (Proxy vars)
  => { | query }
  -> Proxy vars
getGqlQueryVars _ = propGetGqlVars testSchemaProxy (Proxy :: _ { | query })

testGqlVarsEmpty :: Proxy {}
testGqlVarsEmpty = getGqlQueryVars {}

testGqlVarsNoArgs :: Proxy {}
testGqlVarsNoArgs = getGqlQueryVars { users: { id: unit } }

testGqlVarsVeryBasic
  :: Proxy
       { varI :: Proxy "Int"
       }
testGqlVarsVeryBasic =
  getGqlQueryVars
    { int:
        { i:
            Var
              :: Var
                   "varI"
                   Int
        } =>> unit
    }

testGqlVarsBasic1
  :: Proxy
       { myVar :: Proxy "customId"
       }
testGqlVarsBasic1 =
  getGqlQueryVars $
    { users: { id: Var :: Var "myVar" Int }
    }

testGqlVarsBasic2
  :: Proxy
       { myOtherVar :: Proxy "UserId"
       }
testGqlVarsBasic2 =
  getGqlQueryVars $
    { orders:
        { user_id: Var :: Var "myOtherVar" Int }
    }

testGqlVarsBasic
  :: Proxy
       { myOtherVar :: Proxy "UserId"
       , myVar :: Proxy "customId"
       , nameVar :: Proxy "Name"
       }
testGqlVarsBasic =
  getGqlQueryVars $
    { users: { id: Var :: Var "myVar" Int }
    , orders:
        { name: Var :: Var "nameVar" String } =>>
          { user_id: Var :: Var "myOtherVar" Int }
    }

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

