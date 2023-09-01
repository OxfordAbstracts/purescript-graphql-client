
let upstream =
      https://github.com/purescript/package-sets/releases/download/psc-0.15.4-20220725/packages.dhall
        sha256:e56fbdf33a5afd2a610c81f8b940b413a638931edb41532164e641bb2a9ec29c

in  upstream
  with tidy-codegen =
    { dependencies =
      [ "aff"
      , "ansi"
      , "arrays"
      , "avar"
      , "bifunctors"
      , "console"
      , "control"
      , "dodo-printer"
      , "effect"
      , "either"
      , "enums"
      , "exceptions"
      , "filterable"
      , "foldable-traversable"
      , "free"
      , "identity"
      , "integers"
      , "language-cst-parser"
      , "lazy"
      , "lists"
      , "maybe"
      , "newtype"
      , "node-buffer"
      , "node-child-process"
      , "node-fs-aff"
      , "node-path"
      , "node-process"
      , "node-streams"
      , "ordered-collections"
      , "parallel"
      , "partial"
      , "posix-types"
      , "prelude"
      , "record"
      , "safe-coerce"
      , "st"
      , "strings"
      , "tidy"
      , "transformers"
      , "tuples"
      , "type-equality"
      , "unicode"
      ]
    , repo =
      "https://github.com/natefaubion/purescript-tidy-codegen.git"
    , version =
        "v4.0.0"
    }
  with language-cst-parser =
    (upstream.language-cst-parser with version = "v0.13.0")

  with tidy =
    { dependencies =
      [ "arrays"
      , "dodo-printer"
      , "foldable-traversable"
      , "lists"
      , "maybe"
      , "ordered-collections"
      , "partial"
      , "prelude"
      , "language-cst-parser"
      , "strings"
      , "tuples"
      ]
    , repo = "https://github.com/natefaubion/purescript-tidy.git"
    , version = "v0.10.0"
    }