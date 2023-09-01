-- | Create purescript directive code from a graphQL schema
module GraphQL.Client.CodeGen.Directive
  ( getDocumentDirectivesPurs
  ) where

import Prelude

import Data.Array (mapMaybe, null, uncons)
import Data.Array as Array
import Data.Array.NonEmpty as NonEmpty
import Data.GraphQL.AST as AST
import Data.List (List, fold, foldMap)
import Data.Map (Map)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import GraphQL.Client.CodeGen.UtilCst (inputValueDefinitionToPurs)
import Partial.Unsafe (unsafePartial)
import PureScript.CST.Types (Declaration)
import PureScript.CST.Types as CST
import Tidy.Codegen (binaryOp, declImport, declSignature, declType, declValue, exprApp, exprCtor, exprIdent, exprTyped, importType, importTypeAll, importTypeOp, importValue, module_, printModule, typeApp, typeArrow, typeCtor, typeForall, typeOp, typeRecord, typeString, typeVar, typeWildcard)

getDocumentDirectivesPurs :: Map String String -> String -> AST.Document -> String
getDocumentDirectivesPurs gqlScalarsToPursTypes moduleName (AST.Document defs) =
  unsafePartial $ printModule $
    module_ moduleName exports imports decls

  where
  exports = []
  imports = unsafePartial
    [ declImport "Prelude" []
    , declImport "GraphQL.Client.Args" [ importType "NotNull" ]
    , declImport "GraphQL.Client.Directive" [ importType "ApplyDirective", importValue "applyDir" ]
    , declImport "GraphQL.Client.Directive.Definition" [ importType "Directive" ]
    , declImport "GraphQL.Client.Directive.Location" [ importType "MUTATION", importType "QUERY", importType "SUBSCRIPTION" ]
    , declImport "GraphQL.Client.Operation" [ importTypeAll "OpMutation", importTypeAll "OpQuery", importTypeAll "OpSubscription" ]
    , declImport "Type.Data.List" [ importTypeOp ":>", importType "Nil'" ]
    , declImport "Type.Proxy" [ importTypeAll "Proxy" ]
    ]

  decls :: Array (Declaration Void)
  decls = unsafePartial $
    [ declType "Directives" [] directiveDefinitionsPurs
    ]
      <>
        directiveAppliers

  directives = getDirectiveDefinitions defs

  directiveDefinitionsPurs :: CST.Type Void
  directiveDefinitionsPurs = unsafePartial case NonEmpty.uncons directiveTypeWithNil of
    { head, tail } ->
      typeOp head $ tail <#> (binaryOp ":>")

  directiveTypeWithNil = unsafePartial $ NonEmpty.snoc' directiveTypes (typeCtor "Nil'")

  directiveTypes = directives
    # Array.fromFoldable
    # mapMaybe (directiveToPurs gqlScalarsToPursTypes)

  directiveAppliers =
    directives
      # foldMap directiveToApplierPurs

getDirectiveDefinitions :: List AST.Definition -> List AST.DirectiveDefinition
getDirectiveDefinitions defs =
  defs
    >>= case _ of
      AST.Definition_TypeSystemDefinition (AST.TypeSystemDefinition_DirectiveDefinition def) -> pure def
      _ -> mempty

directiveToPurs :: Map String String -> AST.DirectiveDefinition -> Maybe (CST.Type Void)
directiveToPurs gqlScalarsToPursTypes (AST.DirectiveDefinition { name, description, argumentsDefinition, directiveLocations }) =
  unsafePartial
    if null locationTypes then
      Nothing
    else
      Just $
        typeApp (typeCtor "Directive")
          [ typeString name
          , typeString (fold description)
          , typeRecord args Nothing
          , locations
          ]

  where
  args = unsafePartial $
    argumentsDefinition # maybe [] (unwrap >>> Array.fromFoldable) <#> (inputValueDefinitionToPurs gqlScalarsToPursTypes)

  locationsArr :: Array (AST.DirectiveLocation)
  locationsArr = Array.fromFoldable $ unwrap directiveLocations

  locationTypes = mapMaybe directiveLocationToPurs locationsArr

  locations = unsafePartial case uncons locationTypes of
    Nothing -> nilType
    Just { head, tail } -> typeOp head $ (tail <> [ nilType ]) <#> (binaryOp ":>")

nilType :: CST.Type Void
nilType = unsafePartial $ typeCtor "Nil'"

directiveToApplierPurs :: AST.DirectiveDefinition -> Array (CST.Declaration Void)
directiveToApplierPurs (AST.DirectiveDefinition { name }) = unsafePartial $
  [ declSignature name $ typeForall [ typeVar "q", typeVar "args" ] $ typeArrow [ typeVar "args", typeVar "q" ]
      (typeApp (typeCtor "ApplyDirective") [ typeString name, typeVar "args", typeVar "q" ])

  , declValue name []
      ( exprApp (exprIdent "applyDir")
          [ exprTyped (exprCtor "Proxy") (typeApp typeWildcard [ typeString name ])
          ]
      )
  ]

directiveLocationToPurs :: AST.DirectiveLocation -> Maybe (CST.Type Void)
directiveLocationToPurs = case _ of
  AST.DirectiveLocation_ExecutableDirectiveLocation location -> executableDirectiveLocationtoPurs location
  _ -> Nothing

executableDirectiveLocationtoPurs :: AST.ExecutableDirectiveLocation -> Maybe (CST.Type Void)
executableDirectiveLocationtoPurs = unsafePartial case _ of
  AST.QUERY -> Just $ typeCtor "QUERY"
  AST.MUTATION -> Just $ typeCtor "MUTATION"
  AST.SUBSCRIPTION -> Just $ typeCtor "SUBSCRIPTION"
  AST.FIELD -> Nothing
  AST.FRAGMENT_DEFINITION -> Nothing
  AST.FRAGMENT_SPREAD -> Nothing
  AST.INLINE_FRAGMENT -> Nothing
