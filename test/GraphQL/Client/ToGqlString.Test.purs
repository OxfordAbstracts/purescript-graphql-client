module GraphQL.Client.ToGqlString.Test where

import Prelude

import Data.Symbol (SProxy(..))
import GraphQL.Client.Alias ((:))
import GraphQL.Client.Args ((++), (=>>))
import GraphQL.Client.ToGqlString (toGqlQueryString, toGqlQueryStringFormatted)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec =
  describe " GraphQL.Client.ToGqlString" do
    describe "toGqlQueryString" do
      it "converts a single prop"
        $ toGqlQueryStringFormatted { a: unit }
            `shouldEqual`
              """ {
  a
}"""
      it "converts 2 props"
        $ toGqlQueryStringFormatted { a: unit, b: unit }
            `shouldEqual`
              """ {
  a
  b
}"""
      it "converts simple nested props"
        $ toGqlQueryStringFormatted { a: { nested: unit }, b: unit }
            `shouldEqual`
              """ {
  a {
    nested
  }
  b
}"""
      it "converts a single arg"
        $ toGqlQueryStringFormatted { a: { arg: "abc" } =>> { nested: unit }, b: unit }
            `shouldEqual`
              """ {
  a(arg: "abc") {
    nested
  }
  b
}"""
      it "converts 2 args"
        $ toGqlQueryStringFormatted { a: { arg: "abc", arg2: 10 } =>> { nested: unit }, b: unit }
            `shouldEqual`
              """ {
  a(arg: "abc", arg2: 10) {
    nested
  }
  b
}"""
      it "converts nested args"
        $ toGqlQueryStringFormatted { a: { arg: "abc", where: { id: { eq: 10 } } } =>> { nested: unit }, b: unit }
            `shouldEqual`
              """ {
  a(arg: "abc", where: {id: {eq: 10}}) {
    nested
  }
  b
}"""
      it "converts aliases"
        $ toGqlQueryStringFormatted { a_alias: (SProxy :: SProxy "a") : { nested_alias: (SProxy :: SProxy "nested") }, b: unit }
            `shouldEqual`
              """ {
  a_alias: a {
    nested_alias: nested
  }
  b
}"""
      it "converts aliases and nested args"
        $ toGqlQueryStringFormatted
            { a_alias:
                (SProxy :: SProxy "a")
                  : { arg: "abc"
                    , where: { id: { eq: 10 } }
                    }
                  =>> { nested_alias: (SProxy :: SProxy "nested") }
            , b: unit
            }
            `shouldEqual`
              """ {
  a_alias: a(arg: "abc", where: {id: {eq: 10}}) {
    nested_alias: nested
  }
  b
}"""
      it "converts aliases and nested args (unformatted)"
        $ toGqlQueryString
            { a_alias:
                (SProxy :: SProxy "a")
                  : { arg: "abc"
                    , where: { id: { eq: 10 } }
                    }
                  =>> { nested_alias: (SProxy :: SProxy "nested") }
            , b: unit
            }
            `shouldEqual`
              """ { a_alias: a(arg: "abc", where: {id: {eq: 10}}) { nested_alias: nested} b}"""
      it "converts array args"
        $ toGqlQueryStringFormatted
            { a:
                { a: [1, 2, 3]
                , b: 1 ++ 2 ++ 3 ++ 4
                }
                  =>> { nested: unit }
            , b: unit
            }
            `shouldEqual`
              """ {
  a(a: [1, 2, 3], b: [1, 2, 3, 4]) {
    nested
  }
  b
}"""
