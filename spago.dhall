{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "graphql-client"
, repository = "https://github.com/OxfordAbstracts/purescript-graphql-client"
, license = "MIT"
, dependencies =
  [ "aff"
  , "aff-coroutines"
  , "aff-promise"
  , "affjax"
  , "argonaut-codecs"
  , "argonaut-core"
  , "console"
  , "coroutines"
  , "effect"
  , "event"
  , "foreign-generic"
  , "foreign-object"
  , "graphql-parser"
  , "heterogeneous"
  , "parsing"
  , "psci-support"
  , "quickcheck"
  , "record"
  , "spec"
  , "spec-discovery"
  , "strings"
  , "strings-extra"
  , "typelevel"
  , "variant"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
