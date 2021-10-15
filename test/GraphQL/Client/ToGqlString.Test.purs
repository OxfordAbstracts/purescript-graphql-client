module GraphQL.Client.ToGqlString.Test where

import Prelude

import GraphQL.Client.Alias ((:))
import GraphQL.Client.Alias.Dynamic (Spread(..))
import GraphQL.Client.Args (IgnoreArg(..), (++), (+++), (=>>))
import GraphQL.Client.Directive (applyDir)
import GraphQL.Client.ToGqlString (toGqlQueryString, toGqlQueryStringFormatted)
import GraphQL.Client.Variable (Var(..))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Type.Proxy (Proxy(..))

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
        $ toGqlQueryStringFormatted { a_alias: (Proxy :: _ "a") : { nested_alias: (Proxy :: _ "nested") }, b: unit }
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
                (Proxy :: _ "a")
                  : { arg: "abc"
                    , where: { id: { eq: 10 } }
                    }
                  =>> { nested_alias: (Proxy :: _ "nested") }
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
                (Proxy :: _ "a")
                  : { arg: "abc"
                    , where: { id: { eq: 10 } }
                    }
                  =>> { nested_alias: (Proxy :: _ "nested") }
            , b: unit
            }
            `shouldEqual`
              """ { a_alias: a(arg: "abc", where: {id: {eq: 10}}) { nested_alias: nested} b}"""
      it "converts array args"
        $ toGqlQueryStringFormatted
            { a:
                { a: [ 1, 2, 3 ]
                , b: 1 ++ 2 ++ 3 ++ 4
                , c: ["a", "b"] +++ [1, 2] 
                , d: ([] :: Array Int) +++ ["a", "b"] +++ [1, 2] +++ ([] :: Array Int) +++ [ "c", "d"] +++ ([] :: Array Int)
                }
                  =>> { nested: unit }
            , b: unit
            }
            `shouldEqual`
              """ {
  a(a: [1, 2, 3], b: [1, 2, 3, 4], c: ["a", "b", 1, 2], d: ["a", "b", 1, 2, "c", "d"]) {
    nested
  }
  b
}"""
      it "ignores Ignore args"
        $ toGqlQueryStringFormatted
            { a:
                { i: IgnoreArg
                , a: [ 1, 2, 3 ]
                , b: IgnoreArg
                , c: "X"
                , d: IgnoreArg
                }
                  =>> { nested: unit }
            , b: unit
            }
            `shouldEqual`
              """ {
  a(a: [1, 2, 3], c: "X") {
    nested
  }
  b
}"""
      it "handles variables"
        $ toGqlQueryStringFormatted
            { a: { arg: Var :: _ "var1" _ } =>> { nested: unit }
            }
            `shouldEqual`
              """ {
  a(arg: $var1) {
    nested
  }
}"""
      it "handles dynamic aliases"
        $ toGqlQueryStringFormatted
             (Spread (Proxy :: _ "b") [ { arg: 10}, { arg: 20}, { arg: 30}] { field: unit })
            
            `shouldEqual`
              """ {
  _0: b(arg: 10) {
    field
  }
  _1: b(arg: 20) {
    field
  }
  _2: b(arg: 30) {
    field
  }
}"""
      it "handles top level directives"
        let 
          cached = applyDir (Proxy :: _ "cached")
        in
         toGqlQueryStringFormatted
             (cached {ttl: 10} { a: unit } )
            
            `shouldEqual`
              """@cached(ttl: 10) {
  a
}"""
