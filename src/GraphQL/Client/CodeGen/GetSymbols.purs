module GraphQL.Client.CodeGen.GetSymbols where

import Prelude

import Data.Foldable (class Foldable)
import Data.GraphQL.AST as AST
import Data.List (List, foldMap, nub, sort, (:))
import Data.Maybe (maybe)
import Data.Newtype (unwrap)

getSymbolsCode :: AST.Document -> String
getSymbolsCode = getSymbols >>> symbolsToCode

symbolsToCode :: forall f. Foldable f => f String -> String
symbolsToCode symbols =
  """module GeneratedGql.Symbols where

import Data.Symbol (SProxy(..))
"""
    <> symbolsString
  where
  symbolsString =
    symbols
      # foldMap (\s -> "\n" <> s <> " :: SProxy " <> show s <> "\n" <> s <> " = SProxy")

getSymbols :: AST.Document -> List String
getSymbols doc = unwrap doc >>= definitionToSymbols # nub # sort
  where
  definitionToSymbols :: AST.Definition -> List String
  definitionToSymbols = case _ of
    AST.Definition_ExecutableDefinition def -> mempty
    AST.Definition_TypeSystemDefinition def -> typeSystemDefinitionToSymbols def
    AST.Definition_TypeSystemExtension ext -> mempty

  typeSystemDefinitionToSymbols :: AST.TypeSystemDefinition -> List String
  typeSystemDefinitionToSymbols = case _ of
    AST.TypeSystemDefinition_SchemaDefinition schemaDefinition -> mempty
    AST.TypeSystemDefinition_TypeDefinition typeDefinition -> typeDefinitionToSymbols typeDefinition
    AST.TypeSystemDefinition_DirectiveDefinition directiveDefinition -> mempty

  typeDefinitionToSymbols :: AST.TypeDefinition -> List String
  typeDefinitionToSymbols = case _ of
    AST.TypeDefinition_ScalarTypeDefinition scalarTypeDefinition -> mempty
    AST.TypeDefinition_ObjectTypeDefinition objectTypeDefinition -> objectTypeDefinitionToSymbols objectTypeDefinition
    AST.TypeDefinition_InterfaceTypeDefinition interfaceTypeDefinition -> mempty
    AST.TypeDefinition_UnionTypeDefinition unionTypeDefinition -> mempty
    AST.TypeDefinition_EnumTypeDefinition enumTypeDefinition -> mempty
    AST.TypeDefinition_InputObjectTypeDefinition inputObjectTypeDefinition -> mempty -- inputObjectTypeDefinitionToSymbols inputObjectTypeDefinition

  objectTypeDefinitionToSymbols :: AST.ObjectTypeDefinition -> List String
  objectTypeDefinitionToSymbols ( AST.ObjectTypeDefinition
      { fieldsDefinition
    }
  ) = maybe mempty fieldsDefinitionToSymbols fieldsDefinition

  fieldsDefinitionToSymbols :: AST.FieldsDefinition -> List String
  fieldsDefinitionToSymbols (AST.FieldsDefinition fieldsDefinition) = fieldsDefinition >>= fieldDefinitionToSymbols

  fieldDefinitionToSymbols :: AST.FieldDefinition -> List String
  fieldDefinitionToSymbols ( AST.FieldDefinition
      { description
    , name
    , argumentsDefinition
    , type: tipe
    , directives
    }
  ) = name : maybe mempty argumentsDefinitionToSymbols argumentsDefinition

  argumentsDefinitionToSymbols :: AST.ArgumentsDefinition -> List String
  argumentsDefinitionToSymbols (AST.ArgumentsDefinition inputValueDefinitions) = inputValueDefinitions >>= inputValueDefinitionsToSymbols

  inputValueDefinitionsToSymbols = mempty
