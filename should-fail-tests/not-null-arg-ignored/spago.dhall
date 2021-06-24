{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "my-project"
, dependencies =
  [ "aff"
  , "aff-promise"
  , "affjax"
  , "argonaut-codecs"
  , "argonaut-core"
  , "console"
  , "effect"
  , "foreign-generic"
  , "foreign-object"
  , "halogen-subscriptions"
  , "heterogeneous"
  , "parsing"
  , "psci-support"
  , "record"
  , "spec"
  , "spec-discovery"
  , "string-parsers"
  , "strings"
  , "strings-extra"
  , "typelevel"
  , "variant"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs", "../../src/**/*.purs" ]
}
