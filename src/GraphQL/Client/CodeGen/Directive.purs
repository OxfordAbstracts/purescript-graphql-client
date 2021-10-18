-- | Create purescript directive code from a graphQL schema
module GraphQL.Client.CodeGen.Directive where

import Prelude

import Data.GraphQL.AST as AST
import Data.List (List, fold, foldMap, intercalate, mapMaybe)
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import GraphQL.Client.CodeGen.Lines (indent)
import GraphQL.Client.CodeGen.Util (argumentsDefinitionToPurs, inputValueDefinitionsToPurs)

getDocumentDirectivesPurs :: Map String String -> AST.Document -> String
getDocumentDirectivesPurs gqlScalarsToPursTypes (AST.Document defs) =
  """import Prelude

import GraphQL.Client.Args (NotNull)
import GraphQL.Client.Directive (ApplyDirective, applyDir)
import GraphQL.Client.Directive.Definition (Directive)
import GraphQL.Client.Directive.Location (MUTATION, QUERY, SUBSCRIPTION)
import GraphQL.Client.Operation (OpMutation(..), OpQuery(..), OpSubscription(..))
import Type.Data.List (type (:>), Nil')
import Type.Proxy (Proxy(..))

type Directives =  
    ( """
    <> directiveDefinitionsPurs
    <> """Nil'
    )
"""
    <> directiveAppliers
  where
  directives = getDirectiveDefinitions defs

  directiveDefinitionsPurs =
    directives
      # foldMap (directiveToPurs gqlScalarsToPursTypes)

  directiveAppliers =
    directives
      # foldMap directiveToApplierPurs

getDirectiveDefinitions :: List AST.Definition -> List AST.DirectiveDefinition
getDirectiveDefinitions defs =
  defs
    >>= case _ of
        AST.Definition_TypeSystemDefinition (AST.TypeSystemDefinition_DirectiveDefinition def) -> pure def
        _ -> mempty

directiveToPurs :: Map String String -> AST.DirectiveDefinition -> String
directiveToPurs gqlScalarsToPursTypes (AST.DirectiveDefinition { name, description, argumentsDefinition, directiveLocations }) = indent $
  "Directive " <> show name <> " " <> show (fold description)
    <> foldMap (\(AST.ArgumentsDefinition inputs) ->  inputValueDefinitionsToPurs gqlScalarsToPursTypes inputs) argumentsDefinition
    <> " ("
    <> directiveLocationsToPurs directiveLocations
    <> "Nil')\n  :> "

directiveToApplierPurs :: AST.DirectiveDefinition -> String
directiveToApplierPurs (AST.DirectiveDefinition { name }) =
  "\n"
    <> name
    <> " :: forall q args. args -> q -> ApplyDirective "
    <> show name
    <> " args q \n"
    <> name
    <> " = applyDir (Proxy :: _ "
    <> show name
    <> ")"

directiveLocationsToPurs :: AST.DirectiveLocations -> String
directiveLocationsToPurs (AST.DirectiveLocations locations) = fold $ mapMaybe directiveLocationToPurs locations

directiveLocationToPurs :: AST.DirectiveLocation -> Maybe String
directiveLocationToPurs = case _ of
  AST.DirectiveLocation_ExecutableDirectiveLocation location -> executableDirectiveLocationtoPurs location <#> (_ <> " :> ")
  _ -> Nothing

executableDirectiveLocationtoPurs :: AST.ExecutableDirectiveLocation -> Maybe String
executableDirectiveLocationtoPurs = case _ of
  AST.QUERY -> Just "QUERY"
  AST.MUTATION -> Just "MUTATION"
  AST.SUBSCRIPTION -> Just "SUBSCRIPTION"
  AST.FIELD -> Nothing
  AST.FRAGMENT_DEFINITION -> Nothing
  AST.FRAGMENT_SPREAD -> Nothing
  AST.INLINE_FRAGMENT -> Nothing
