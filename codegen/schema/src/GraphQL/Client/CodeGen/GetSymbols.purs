module GraphQL.Client.CodeGen.GetSymbols where

import Prelude

import Data.Array (elem)
import Data.Array as Array
import Data.Foldable (class Foldable)
import Data.GraphQL.AST as AST
import Data.List (List, filter, foldMap, nub, sort, (:))
import Data.Maybe (maybe)
import Data.Newtype (unwrap)
import Data.String as String
import Data.String (toLower)

symbolsToCode :: forall f. Foldable f => String -> f String -> String
symbolsToCode modulePrefix symbols =
  """module """ <> modulePrefix
    <>
      """Symbols where

import Type.Proxy (Proxy(..))
"""
    <> symbolsString
  where
  symbolsString =
    symbols
      # Array.fromFoldable
      # Array.nub
      # Array.filter (lower1stChar && not keyword)
      # foldMap
          ( \s -> "\n" <> s <> " = Proxy :: Proxy " <> show s
          )

getSymbols :: AST.Document -> List String
getSymbols doc =
  unwrap doc
    >>= definitionToSymbols
    # filter (lower1stChar && not keyword)
    # nub
    # sort
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
  objectTypeDefinitionToSymbols
    ( AST.ObjectTypeDefinition
        { fieldsDefinition
        }
    ) = maybe mempty fieldsDefinitionToSymbols fieldsDefinition

  fieldsDefinitionToSymbols :: AST.FieldsDefinition -> List String
  fieldsDefinitionToSymbols (AST.FieldsDefinition fieldsDefinition) = fieldsDefinition >>= fieldDefinitionToSymbols

  fieldDefinitionToSymbols :: AST.FieldDefinition -> List String
  fieldDefinitionToSymbols
    ( AST.FieldDefinition
        { name
        , argumentsDefinition
        }
    ) = name : maybe mempty argumentsDefinitionToSymbols argumentsDefinition

  argumentsDefinitionToSymbols :: AST.ArgumentsDefinition -> List String
  argumentsDefinitionToSymbols (AST.ArgumentsDefinition inputValueDefinitions) = inputValueDefinitions >>= inputValueDefinitionsToSymbols

  inputValueDefinitionsToSymbols = mempty

keyword :: String -> Boolean
keyword = flip elem [ "data", "type", "instance", "if", "then", "else" ]

lower1stChar :: String -> Boolean
lower1stChar s = head == toLower head
  where
  head = String.take 1 s