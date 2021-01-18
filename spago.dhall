{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "graphql-client"
, repository = "https://github.com/OxfordAbstracts/purescript-graphql-client"
, license = "MIT"
, dependencies =
  [ "aff"
  , "affjax"
  , "argonaut-codecs"
  , "argonaut-core"
  , "console"
  , "effect"
  , "foreign-generic"
  , "foreign-object"
  , "graphql-parser"
  , "heterogeneous"
  , "parsing"
  , "psci-support"
  , "record"
  , "spec"
  , "spec-discovery"
  , "strings-extra"
  , "typelevel"
  , "variant"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
