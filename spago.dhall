{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "graphql-client"
, repository = "https://github.com/OxfordAbstracts/purescript-graphql-client"
, license = "MIT"
, dependencies =
  [ "aff"
  , "aff-promise"
  , "affjax"
  , "affjax-node"
  , "affjax-web"
  , "argonaut-codecs"
  , "argonaut-core"
  , "argonaut-generic"
  , "arrays"
  , "bifunctors"
  , "console"
  , "control"
  , "datetime"
  , "debug"
  , "effect"
  , "either"
  , "enums"
  , "exceptions"
  , "foldable-traversable"
  , "foreign"
  , "foreign-object"
  , "functions"
  , "halogen-subscriptions"
  , "heterogeneous"
  , "http-methods"
  , "integers"
  , "lists"
  , "maybe"
  , "media-types"
  , "newtype"
  , "node-buffer"
  , "node-fs"
  , "now"
  , "nullable"
  , "numbers"
  , "ordered-collections"
  , "parsing"
  , "prelude"
  , "profunctor"
  , "profunctor-lenses"
  , "psci-support"
  , "quickcheck"
  , "record"
  , "spec"
  , "spec-discovery"
  , "string-parsers"
  , "strings"
  , "strings-extra"
  , "transformers"
  , "tuples"
  , "typelevel-lists"
  , "unicode"
  , "unsafe-coerce"
  , "variant"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
