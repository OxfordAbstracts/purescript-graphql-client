{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "my-project"
, dependencies = ../../test-deps.dhall
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "../../src/**/*.purs" ]
}
