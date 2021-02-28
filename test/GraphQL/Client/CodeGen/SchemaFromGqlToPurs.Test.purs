module GraphQL.Client.CodeGen.Schema.Test where

import Prelude

import Data.Either (Either(..))
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import GraphQL.Client.CodeGen.Schema (schemaFromGqlToPurs)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec =
  describe "GraphQL.Client.CodeGen.Schema" do
    describe "schemaFromGqlToPurs" do
      it "converts a query only single nullable prop object schema" do
        let
          gql = queryOnlySchemaGql "{ prop: Int }"
        gql `shouldParseTo` queryOnlySchemaPurs "\n  { prop :: (Maybe Int)\n  }"
      it "converts a single nullable prop object schema" do
        let
          gql =
            schemaGql
              { query: "{ prop: Int }"
              , mutation: "{ prop: Int }"
              , subscription: "{ prop: Int }"
              }

          result =
            schemaPurs
              { query: "\n  { prop :: (Maybe Int)\n  }"
              , mutation: "\n  { prop :: (Maybe Int)\n  }"
              , subscription: "\n  { prop :: (Maybe Int)\n  }"
              }
        gql `shouldParseTo` result
      it "converts a single not null prop object schema" do
        let
          gql =
            schemaGql
              { query: "{ prop: Int! }"
              , mutation: "{ prop: Int! }"
              , subscription: "{ prop: Int! }"
              }

          result =
            schemaPurs
              { query: "\n  { prop :: Int\n  }"
              , mutation: "\n  { prop :: Int\n  }"
              , subscription: "\n  { prop :: Int\n  }"
              }
        gql `shouldParseTo` result
      it "converts a multiple prop object schema" do
        let
          gql =
            schemaGql
              { query:
                  """{ 
  int_prop: Int!
  number_prop: Number
  string_prop: String!
  ints_prop: [Int!]!
}"""
              , mutation: "{ prop: Int! }"
              , subscription: "{ prop: Int! }"
              }

          result =
            schemaPurs
              { query:
                  """
  { int_prop :: Int
  , number_prop :: (Maybe Number)
  , string_prop :: String
  , ints_prop :: (Array Int)
  }"""
              , mutation: "\n  { prop :: Int\n  }"
              , subscription: "\n  { prop :: Int\n  }"
              }
        gql `shouldParseTo` result
      it "converts a schema with arguments" do
        let
          gql =
            schemaGql
              { query:
                  """{ 
  int_prop(id: Int str: String!): Int!
  number_prop: Number
  string_prop: String!
  ints_prop: [Int!]!
}"""
              , mutation: "{ prop: Int! }"
              , subscription: "{ prop: Int! }"
              }

          result =
            schemaPurs
              { query:
                  """
  { int_prop :: 
    { id :: Int
    , str :: (NotNull String)
    }
    ==> Int
  , number_prop :: (Maybe Number)
  , string_prop :: String
  , ints_prop :: (Array Int)
  }"""
              , mutation: "\n  { prop :: Int\n  }"
              , subscription: "\n  { prop :: Int\n  }"
              }
        gql `shouldParseTo` result
      it "converts a schema with list arguments and nested object fields" do
        let
          gql =
            schemaGql
              { query:
                  """{ 
  int_prop(id: Int): Int!
  number_prop(str: String! obj: [my_type!]!): Number
  string_prop: String!
  ints_prop: [Int!]!
}

"""
              , mutation: "{ prop: Int! }"
              , subscription: "{ prop: Int! }"
              }
              <> "\ntype my_type { prop: Int }"

          result =
            schemaPurs
              { query:
                  """
  { int_prop :: 
    { id :: Int
    }
    ==> Int
  , number_prop :: 
    { str :: (NotNull String)
    , obj :: (NotNull (Array (NotNull MyType)))
    }
    ==> (Maybe Number)
  , string_prop :: String
  , ints_prop :: (Array Int)
  }"""
              , mutation: "\n  { prop :: Int\n  }"
              , subscription: "\n  { prop :: Int\n  }"
              }
              <> "\n\nnewtype MyType = MyType \n  { prop :: (Maybe Int)\n  }\nderive instance newtypeMyType :: Newtype MyType _"
              <> "\ninstance argToGqlMyType :: (Newtype MyType {| p},  RecordArg p a u) => ArgGql MyType { | a }"
        gql `shouldParseTo` result
      it "converts input types" do
        let
          gql =
            queryOnlySchemaGql
              """{ prop(id: MyInputType): Int! }

input MyInputType {
  id: Int
  username: String!
}"""

          result =
            """
type Query = QueryRoot

newtype QueryRoot = QueryRoot 
  { prop :: 
    { id :: MyInputType
    }
    ==> Int
  }
derive instance newtypeQueryRoot :: Newtype QueryRoot _
instance argToGqlQueryRoot :: (Newtype QueryRoot {| p},  RecordArg p a u) => ArgGql QueryRoot { | a }

newtype MyInputType = MyInputType
  { id :: Int
  , username :: (NotNull String)
  }
derive instance newtypeMyInputType :: Newtype MyInputType _
instance argToGqlMyInputType :: (Newtype MyInputType {| p},  RecordArg p a u) => ArgGql MyInputType { | a }"""
        gql `shouldParseTo` result
      it "converts enum types" do
        let
          gql =
            queryOnlySchemaGql
              """{ prop(id: my_enum): Int! }

enum my_enum {
  enum_val1
  enum_val2
}"""

          mainSchemaCode =
            queryOnlySchemaPurs
              """
  { prop :: 
    { id :: MyEnum
    }
    ==> Int
  }"""
        gql
          `shouldParseToAll`
            { mainSchemaCode
            , moduleName: "Test"
            , symbols: [ "prop" ]
            , enums:
                [ { name: "MyEnum"
                  , values: [ "enum_val1", "enum_val2" ]
                  }
                ]
            }
      it "handles type overrides " do
        let
          gql =
            """
schema {
  query: Query
}

type Query {
  int: Int
  my_type_a: SomethingUnknown!
  my_type_b: SomethingElseUnknown
  my_type_c: [AlsoUnkown]
}
          """

          result = """
import MyModule as MyModule

type Query = Query

newtype Query = Query 
  { int :: (Maybe Int)
  , my_type_a :: MyModule.MyTypeA
  , my_type_b :: (Maybe MyModule.MyTypeB)
  , my_type_c :: (Array MyModule.MyTypeC)
  }
derive instance newtypeQuery :: Newtype Query _
instance argToGqlQuery :: (Newtype Query {| p},  RecordArg p a u) => ArgGql Query { | a }"""

        gql
          ` ( shouldParseToOpts
              { dir: ""
              , cache: Nothing
              , useNewtypesForRecords: true
              , isHasura: false
              , modulePath: []
              , fieldTypeOverrides:
              mkMap
                  [ Tuple "Query" 
                    [ Tuple "my_type_a" { moduleName: "MyModule", typeName: "MyTypeA" }
                    , Tuple "my_type_b" { moduleName: "MyModule", typeName: "MyTypeB" }
                    , Tuple "my_type_c" { moduleName: "MyModule", typeName: "MyTypeC" }
                    ]
                  ]
              , externalTypes: mempty
              }
          )
            `
            result
  where
  mkMap :: forall v. Array (Tuple String (Array (Tuple String v))) -> Map String (Map String v)
  mkMap = Map.fromFoldable >>> map Map.fromFoldable


  shouldParseToOpts opts schema r =
    let
      purs =
        schemaFromGqlToPurs
          opts
          { schema, moduleName: "" }
    in
      map _.mainSchemaCode purs `shouldEqual` Right r

  shouldParseTo =
    shouldParseToOpts
      { dir: ""
      , cache: Nothing
      , useNewtypesForRecords: true
      , isHasura: false
      , modulePath: []
      , fieldTypeOverrides: mempty
      , externalTypes: mempty
      }

  shouldParseToAll schema r =
    schemaFromGqlToPurs
      { dir: ""
      , cache: Nothing
      , useNewtypesForRecords: true
      , isHasura: false
      , modulePath: []
      , fieldTypeOverrides: mempty
      , externalTypes: mempty
      }
      { schema, moduleName: "Test" }
      `shouldEqual`
        Right r

queryOnlySchemaGql :: String -> String
queryOnlySchemaGql queryRoot =
  """schema {
  query: query_root
}

# query root
type query_root """
    <> queryRoot

queryOnlySchemaPurs :: String -> String
queryOnlySchemaPurs queryRoot =
  """
type Query = QueryRoot

newtype QueryRoot = QueryRoot """
    <> queryRoot
    <> "\nderive instance newtypeQueryRoot :: Newtype QueryRoot _"
    <> "\ninstance argToGqlQueryRoot :: (Newtype QueryRoot {| p},  RecordArg p a u) => ArgGql QueryRoot { | a }"

schemaGql :: { query :: String, mutation :: String, subscription :: String } -> String
schemaGql { query, mutation, subscription } =
  """schema {
  query: query_root
  mutation: mutation_root
  subscription: subscription_root
}

type query_root """
    <> query
    <> """

type mutation_root """
    <> mutation
    <> """

type subscription_root """
    <> subscription

schemaPurs :: { query :: String, mutation :: String, subscription :: String } -> String
schemaPurs { query, mutation, subscription } =
  """
type Query = QueryRoot

type Mutation = MutationRoot

type Subscription = SubscriptionRoot

newtype QueryRoot = QueryRoot """
    <> query
    <> """
derive instance newtypeQueryRoot :: Newtype QueryRoot _
instance argToGqlQueryRoot :: (Newtype QueryRoot {| p},  RecordArg p a u) => ArgGql QueryRoot { | a }

newtype MutationRoot = MutationRoot """
    <> mutation
    <> """
derive instance newtypeMutationRoot :: Newtype MutationRoot _
instance argToGqlMutationRoot :: (Newtype MutationRoot {| p},  RecordArg p a u) => ArgGql MutationRoot { | a }

newtype SubscriptionRoot = SubscriptionRoot """
    <> subscription
    <> "\nderive instance newtypeSubscriptionRoot :: Newtype SubscriptionRoot _"
    <> "\ninstance argToGqlSubscriptionRoot :: (Newtype SubscriptionRoot {| p},  RecordArg p a u) => ArgGql SubscriptionRoot { | a }"
