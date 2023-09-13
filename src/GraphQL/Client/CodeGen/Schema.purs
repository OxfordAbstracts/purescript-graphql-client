-- | Codegen functions to get purs schema code from graphQL schemas
module GraphQL.Client.CodeGen.Schema
  ( schemaFromGqlToPurs
  , schemasFromGqlToPurs
  ) where

import Prelude

import Data.Argonaut.Core (stringify)
import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Encode (encodeJson)
import Data.Array (nubBy)
import Data.Array as Array
import Data.Bifunctor (lmap)
import Data.Either (Either(..), hush)
import Data.Foldable (foldMap)
import Data.Function (on)
import Data.FunctorWithIndex (mapWithIndex)
import Data.GraphQL.AST as AST
import Data.List (mapMaybe)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (unwrap)
import Data.String.Extra (pascalCase)
import Data.Traversable (sequence, traverse)
import Data.Tuple (Tuple(..))
import Effect.Aff (Aff)
import GraphQL.Client.CodeGen.Directive (getDocumentDirectivesPurs)
import GraphQL.Client.CodeGen.DocumentFromIntrospection (documentFromIntrospection, toParserError)
import GraphQL.Client.CodeGen.GetSymbols (getSymbols, symbolsToCode)
import GraphQL.Client.CodeGen.SchemaCst (gqlToPursSchema)
import GraphQL.Client.CodeGen.Template.Enum as Enum
import GraphQL.Client.CodeGen.Transform.NullableOverrides (applyNullableOverrides)
import GraphQL.Client.CodeGen.Types (FilesToWrite, GqlEnum, GqlInput, InputOptions, PursGql, QualifiedType)
import Parsing (ParseError)
import Tidy.Codegen (printModule)

schemasFromGqlToPurs :: InputOptions -> Array GqlInput -> Aff (Either ParseError FilesToWrite)
schemasFromGqlToPurs opts = traverse (schemaFromGqlToPursWithCache opts) >>> map sequence >>> map (map collectSchemas)
  where
  modulePrefix = foldMap (_ <> ".") opts.modulePath

  collectSchemas :: Array PursGql -> FilesToWrite
  collectSchemas pursGqls =
    { schemas:
        pursGqls
          <#> \pg ->
            { code: pg.mainSchemaCode
            , path: opts.dir <> "/Schema/" <> pg.moduleName <> ".purs"
            }
    , enums:
        nubBy (compare `on` _.path)
          $ pursGqls
              >>= \pg ->
                pg.enums
                  <#> \{ name, values, description } ->
                    { code:
                        Enum.template modulePrefix
                          { name
                          , schemaName: pg.moduleName
                          , values
                          , description
                          , imports: opts.enumImports
                          , customCode: opts.customEnumCode
                          , enumValueNameTransform: opts.enumValueNameTransform
                          }
                    , path: opts.dir <> "/Schema/" <> pg.moduleName <> "/Enum/" <> name <> ".purs"
                    }
    , symbols:
        pursGqls >>= _.symbols
          # \syms ->
              { path: opts.dir <> "/Symbols.purs", code: symbolsToCode modulePrefix syms }
    , directives:
        pursGqls
          <#> \pg ->
            { code: pg.directives
            , path: opts.dir <> "/Directives/" <> pg.moduleName <> ".purs"
            }
    }

-- | Given a gql doc this will create the equivalent purs gql schema
schemaFromGqlToPursWithCache :: InputOptions -> GqlInput -> Aff (Either ParseError PursGql)
schemaFromGqlToPursWithCache opts { schema, moduleName } = go opts.cache
  where
  stringSchema = stringify schema

  go Nothing = pure $ schemaFromGqlToPurs opts { schema, moduleName }

  go (Just { get, set }) = do
    jsonMay <- get stringSchema
    case jsonMay >>= decodeJson >>> hush of
      Nothing -> do
        eVal <- go Nothing
        case schemaFromGqlToPurs opts { schema, moduleName } of
          Right val -> set $ { key: stringSchema, val: encodeJson val }
          _ -> pure unit
        pure eVal
      Just res -> pure $ Right res

schemaFromGqlToPurs :: InputOptions -> GqlInput -> Either ParseError PursGql
schemaFromGqlToPurs opts { schema, moduleName } =
  documentFromIntrospection schema
    # lmap toParserError
    <#> applyNullableOverrides opts.nullableOverrides
    <#> \ast ->
      let
        symbols = Array.fromFoldable $ getSymbols ast
        enums = getDocumentEnums ast
        directivesModuleName = modulePrefix <> "Directives." <> moduleName
      in
        { mainSchemaCode: gqlToPursMainSchemaCode opts directivesModuleName (modulePrefix <> "Schema." <> moduleName) ast enums
        , enums
        , directives: getDocumentDirectivesPurs opts.gqlToPursTypes (fromMaybe defaultIdImport opts.idImport) directivesModuleName ast
        , symbols
        , moduleName
        }

  where
  modulePrefix = foldMap (_ <> ".") opts.modulePath

defaultIdImport :: QualifiedType
defaultIdImport = { typeName: "ID", moduleName: "GraphQL.Client.ID" }

gqlToPursMainSchemaCode :: InputOptions -> String -> String -> AST.Document -> Array GqlEnum -> String
gqlToPursMainSchemaCode opts directiveModuleName moduleName doc enums =
  printModule $ gqlToPursSchema opts directiveModuleName moduleName doc enums

getDocumentEnums :: AST.Document -> Array GqlEnum
getDocumentEnums = unwrap >>> mapMaybe definitionToEnum >>> Array.fromFoldable
  where
  definitionToEnum :: AST.Definition -> Maybe GqlEnum
  definitionToEnum = case _ of
    AST.Definition_TypeSystemDefinition def -> typeSystemDefinitionToPurs def
    _ -> Nothing

  typeSystemDefinitionToPurs :: AST.TypeSystemDefinition -> Maybe GqlEnum
  typeSystemDefinitionToPurs = case _ of
    AST.TypeSystemDefinition_TypeDefinition typeDefinition -> typeDefinitionToPurs typeDefinition
    _ -> Nothing

  typeDefinitionToPurs :: AST.TypeDefinition -> Maybe GqlEnum
  typeDefinitionToPurs = case _ of
    AST.TypeDefinition_EnumTypeDefinition (AST.EnumTypeDefinition enumTypeDefinition) ->
      Just
        { name: pascalCase enumTypeDefinition.name
        , description: enumTypeDefinition.description
        , values: maybe [] enumValuesDefinitionToPurs enumTypeDefinition.enumValuesDefinition
        }
    _ -> Nothing

  enumValuesDefinitionToPurs :: AST.EnumValuesDefinition -> Array String
  enumValuesDefinitionToPurs def =
    Array.fromFoldable $ unwrap def
      <#> \(AST.EnumValueDefinition { enumValue }) ->
        unwrap enumValue
