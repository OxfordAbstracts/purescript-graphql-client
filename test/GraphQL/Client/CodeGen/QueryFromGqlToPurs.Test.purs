module GraphQL.Client.CodeGen.Query.Test where

import Prelude

import Data.Either (Either(..))
import GraphQL.Client.CodeGen.Query (queryFromGqlToPurs)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec =
  describe "GraphQL.Client.CodeGen.Query" do
    describe "toGqlQueryString mainSchemaCode" do
      it "converts a single prop query" do
        """query MyQuery {
  users {
    first_name
  }
}"""
          `shouldBeAsPurs`
            """myQuery = 
  { users:
    { first_name
    }
  }"""
      it "converts a 2 prop query" do
        """query MyQuery {
  users {
    first_name
    last_name
  }
}"""
          `shouldBeAsPurs`
            """myQuery = 
  { users:
    { first_name
    , last_name
    }
  }"""
      it "converts queries with arguments" do
        """query MyQuery {
  users(limit: 10) {
    first_name
  }
}"""
          `shouldBeAsPurs`
            """myQuery = 
  { users:
    { limit: 10
    } =>>
    { first_name
    }
  }"""
      it "converts queries with aliases" do
        """query MyQuery {
  users_alias: users {
    first_name
  }
}"""
          `shouldBeAsPurs`
            """myQuery = 
  { users_alias: users:
    { first_name
    }
  }"""
  where
  shouldBeAsPurs l r = queryFromGqlToPurs l `shouldEqual` Right r
