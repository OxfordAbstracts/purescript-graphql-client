
let upstream =
      https://github.com/purescript/package-sets/releases/download/psc-0.15.4-20220725/packages.dhall
        sha256:e56fbdf33a5afd2a610c81f8b940b413a638931edb41532164e641bb2a9ec29c

in  upstream
 with foreign-generic =
    { repo =
        "https://github.com/working-group-purescript-es/purescript-foreign-generic.git"
    , dependencies =
      [ "foreign"
      , "foreign-object"
      , "ordered-collections"
      , "exceptions"
      , "record"
      , "identity"
      ]
    , version = "v0.15.0-updates"
    }