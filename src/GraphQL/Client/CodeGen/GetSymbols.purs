module GraphQL.Client.CodeGen.GetSymbols where

import Prelude

import Data.Array as Array
import Data.Foldable (class Foldable)
import Data.GraphQL.AST as AST
import Data.List (List, foldMap, nub, sort, (:))
import Data.Maybe (maybe)
import Data.Newtype (unwrap)


symbolsToCode :: forall f. Foldable f => String -> f String -> String
symbolsToCode modulePrefix symbols =
  """module """ <> modulePrefix <> """Symbols where

import Data.Symbol (Proxy(..))
"""
    <> symbolsString
  where
  symbolsString =
     symbols
        # Array.fromFoldable
        # Array.nub
        # foldMap (\s -> "\n" <> s <> " :: Proxy " <> show s <> "\n" <> s <> " = Proxy")

getSymbols :: AST.Document -> List String
getSymbols doc = unwrap doc >>= definitionToSymbols # nub # sort
  where
  definitionToSymbols :: AST.Definition -> List String
  definitionToSymbols = case _ of
    AST.Definition_ExecutableDefinition _ -> mempty
    AST.Definition_TypeSystemDefinition def -> typeSystemDefinitionToSymbols def
    AST.Definition_TypeSystemExtension _ -> mempty

  typeSystemDefinitionToSymbols :: AST.TypeSystemDefinition -> List String
  typeSystemDefinitionToSymbols = case _ of
    AST.TypeSystemDefinition_SchemaDefinition _ -> mempty
    AST.TypeSystemDefinition_TypeDefinition typeDefinition -> typeDefinitionToSymbols typeDefinition
    AST.TypeSystemDefinition_DirectiveDefinition _ -> mempty

  typeDefinitionToSymbols :: AST.TypeDefinition -> List String
  typeDefinitionToSymbols = case _ of
    AST.TypeDefinition_ScalarTypeDefinition _ -> mempty
    AST.TypeDefinition_ObjectTypeDefinition objectTypeDefinition -> objectTypeDefinitionToSymbols objectTypeDefinition
    AST.TypeDefinition_InterfaceTypeDefinition _ -> mempty
    AST.TypeDefinition_UnionTypeDefinition _ -> mempty
    AST.TypeDefinition_EnumTypeDefinition _ -> mempty
    AST.TypeDefinition_InputObjectTypeDefinition _ -> mempty

  objectTypeDefinitionToSymbols :: AST.ObjectTypeDefinition -> List String
  objectTypeDefinitionToSymbols ( AST.ObjectTypeDefinition
      { fieldsDefinition
    }
  ) = maybe mempty fieldsDefinitionToSymbols fieldsDefinition

  fieldsDefinitionToSymbols :: AST.FieldsDefinition -> List String
  fieldsDefinitionToSymbols (AST.FieldsDefinition fieldsDefinition) = fieldsDefinition >>= fieldDefinitionToSymbols

  fieldDefinitionToSymbols :: AST.FieldDefinition -> List String
  fieldDefinitionToSymbols ( AST.FieldDefinition
      { name
    , argumentsDefinition
    }
  ) = name : maybe mempty argumentsDefinitionToSymbols argumentsDefinition

  argumentsDefinitionToSymbols :: AST.ArgumentsDefinition -> List String
  argumentsDefinitionToSymbols (AST.ArgumentsDefinition inputValueDefinitions) = inputValueDefinitions >>= inputValueDefinitionsToSymbols

  inputValueDefinitionsToSymbols = mempty
