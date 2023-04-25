module GraphQL.Client.CodeGen.DocumentFromIntrospection where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (JsonDecodeError, decodeJson, printJsonDecodeError)
import Data.Array (filter, length)
import Data.Bifunctor (lmap)
import Data.Either (Either(..), note)
import Data.GraphQL.AST (ArgumentsDefinition(..), Definition(..), DirectiveDefinition(..), DirectiveLocation(..), DirectiveLocations(..), Document(..), EnumTypeDefinition(..), EnumValueDefinition(..), EnumValuesDefinition(..), ExecutableDirectiveLocation(..), FieldDefinition(..), FieldsDefinition(..), InputFieldsDefinition(..), InputObjectTypeDefinition(..), InputValueDefinition(..), ListType(..), NamedType(..), NonNullType(..), ObjectTypeDefinition(..), RootOperationTypeDefinition(..), ScalarTypeDefinition(..), SchemaDefinition(..), Type(..), TypeDefinition(..), TypeSystemDefinition(..), TypeSystemDirectiveLocation(..))
import Data.GraphQL.AST as AST
import Data.List (List(..), catMaybes, fold)
import Data.List as List
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (wrap)
import Data.String as String
import Data.Traversable (traverse)
import GraphQL.Client.CodeGen.IntrospectionResult (EnumValue, FullType, IField, InputValue, IntrospectionResult, TypeRef(..), Directive)
import Parsing (ParseError(..), initialPos)

documentFromIntrospection :: Json -> Either DocumentBuildError Document
documentFromIntrospection =
  decodeJson
    >>> lmap JsonDecodeError
    >=> (toDocument >>> lmap InvalidIntrospectionSchema)

  where
  toDocument :: IntrospectionResult -> Either String Document
  toDocument
    { __schema:
        { queryType
        , mutationType
        , subscriptionType
        , types
        , directives
        }
    } = Document <$>
    directiveDefinitions <> (pure <$> root) <> typeDefinitions

    where
    nonSchemaTypes = noSchemaTypes types

    root :: Either String Definition
    root = do
      query <- note "No query type" queryType.name
      pure $ Definition_TypeSystemDefinition $ TypeSystemDefinition_SchemaDefinition
        $ SchemaDefinition
            { directives: Nothing
            , rootOperationTypeDefinition:
                ( toRootOp AST.Query query
                )
                  <>
                    ( mutationType >>= _.name # maybe Nil (toRootOp AST.Mutation)
                    )
                  <>
                    ( subscriptionType >>= _.name # maybe Nil (toRootOp AST.Subscription)
                    )

            }

    toRootOp opType name = pure $ RootOperationTypeDefinition
      { namedType: wrap name
      , operationType: opType
      }

    typeDefinitions :: Either String (List Definition)
    typeDefinitions =
      List.fromFoldable nonSchemaTypes
        # traverse fullTypeToDefinition
        # map catMaybes

    directiveDefinitions :: Either String (List Definition)
    directiveDefinitions =
      List.fromFoldable directives
        # traverse directiveToDefinition
        # map catMaybes

    directiveToDefinition :: Directive -> Either String (Maybe Definition)
    directiveToDefinition = toDirectiveDefinition
      >>> map (map (Definition_TypeSystemDefinition <<< TypeSystemDefinition_DirectiveDefinition))

    toDirectiveDefinition :: Directive -> Either String (Maybe DirectiveDefinition)
    toDirectiveDefinition directive = do
      directiveLocations <- traverse toDirectiveLocation directive.locations
      pure $ Just $ DirectiveDefinition
        { argumentsDefinition: Just $ toArgumentsDefinition directive.args
        , description: directive.description
        , directiveLocations: DirectiveLocations
            $ List.fromFoldable directiveLocations
        , name: directive.name
        }

    fullTypeToDefinition :: FullType -> Either String (Maybe Definition)
    fullTypeToDefinition = toTypeSystemDefinition
      >>> map (map (Definition_TypeSystemDefinition <<< TypeSystemDefinition_TypeDefinition))

    toTypeSystemDefinition :: FullType -> Either String (Maybe TypeDefinition)
    toTypeSystemDefinition fullType = case fullType.kind of
      "OBJECT" -> Just <<< TypeDefinition_ObjectTypeDefinition <$> toObjectDefinition fullType
      "INPUT_OBJECT" -> Just <<< TypeDefinition_InputObjectTypeDefinition <$> toInputObjectDefinition fullType
      "ENUM" -> Just <<< TypeDefinition_EnumTypeDefinition <$> toEnumDefinition fullType
      "SCALAR" -> Just <<< TypeDefinition_ScalarTypeDefinition <$> toScalarDefinition fullType
      k -> Left $ "Unsupported TypeDefinition kind: " <> k

    toObjectDefinition :: FullType -> Either String ObjectTypeDefinition
    toObjectDefinition fullType = do
      name <- note "No name for object type" fullType.name
      pure $ ObjectTypeDefinition
        { description: fullType.description
        , name
        , implementsInterfaces: Nothing
        , directives: Nothing
        , fieldsDefinition: map toFieldsDefinition fullType.fields
        }

    toInputObjectDefinition :: FullType -> Either String InputObjectTypeDefinition
    toInputObjectDefinition fullType = do
      name <- note "No name for input object type" fullType.name
      pure $ InputObjectTypeDefinition
        { description: fullType.description
        , directives: Nothing
        , inputFieldsDefinition: map toInputFieldsDefintion fullType.inputFields
        , name
        }

    toEnumDefinition :: FullType -> Either String EnumTypeDefinition
    toEnumDefinition fullType = do
      name <- note "No name for enum type" fullType.name
      pure $ EnumTypeDefinition
        { description: fullType.description
        , directives: Nothing
        , name
        , enumValuesDefinition: map toEnumValuesDefintion fullType.enumValues
        }

    toScalarDefinition :: FullType -> Either String ScalarTypeDefinition
    toScalarDefinition fullType = do
      name <- note "No name for scalar type" fullType.name
      pure $ ScalarTypeDefinition
        { description: fullType.description
        , name
        , directives: Nothing
        }

    toEnumValuesDefintion :: Array EnumValue -> EnumValuesDefinition
    toEnumValuesDefintion = List.fromFoldable >>> map toEnumValueDefinition >>> EnumValuesDefinition

    toEnumValueDefinition :: EnumValue -> EnumValueDefinition
    toEnumValueDefinition enumValue = EnumValueDefinition
      { description: enumValue.description
      , directives: Nothing
      , enumValue: wrap enumValue.name
      }

    toInputFieldsDefintion :: Array InputValue -> InputFieldsDefinition
    toInputFieldsDefintion = List.fromFoldable >>> map toInputValueDefinition >>> InputFieldsDefinition

    toFieldsDefinition :: Array IField -> FieldsDefinition
    toFieldsDefinition = List.fromFoldable >>> map toFieldDefinition >>> FieldsDefinition

    toFieldDefinition :: IField -> FieldDefinition
    toFieldDefinition field = FieldDefinition
      { argumentsDefinition: map toArgumentsDefinition field.args
      , description: field.description
      , directives: Nothing
      , name: field.name
      , type: toType field.type
      }

    toType :: TypeRef -> AST.Type
    toType (TypeRef typeRef) = case typeRef.kind of
      "LIST" | Just ofType <- typeRef.ofType -> Type_ListType $ toListType ofType
      "NON_NULL" | Just ofType <- typeRef.ofType -> Type_NonNullType $ toNonNullType ofType
      _ -> Type_NamedType $ NamedType $ fold typeRef.name

    toNonNullType :: TypeRef -> NonNullType
    toNonNullType (TypeRef typeRef) = case typeRef.kind of
      "LIST" | Just ofType <- typeRef.ofType -> NonNullType_ListType $ toListType ofType
      _ -> NonNullType_NamedType $ NamedType $ fold typeRef.name

    toListType :: TypeRef -> ListType
    toListType t = ListType $ toType t

    toArgumentsDefinition :: Array InputValue -> ArgumentsDefinition
    toArgumentsDefinition = List.fromFoldable >>> map toInputValueDefinition >>> ArgumentsDefinition

    toInputValueDefinition :: InputValue -> InputValueDefinition
    toInputValueDefinition inputValue = InputValueDefinition
      { defaultValue: Nothing
      , description: inputValue.description
      , directives: Nothing
      , name: inputValue.name
      , type: toType inputValue.type
      }

    toDirectiveLocation :: String -> Either String DirectiveLocation
    toDirectiveLocation = case _ of
      "QUERY" -> Right $ DirectiveLocation_ExecutableDirectiveLocation QUERY
      "MUTATION" -> Right $ DirectiveLocation_ExecutableDirectiveLocation MUTATION
      "SUBSCRIPTION" -> Right $ DirectiveLocation_ExecutableDirectiveLocation SUBSCRIPTION
      "FIELD" -> Right $ DirectiveLocation_ExecutableDirectiveLocation FIELD
      "FRAGMENT_DEFINITION" -> Right $ DirectiveLocation_ExecutableDirectiveLocation FRAGMENT_DEFINITION
      "FRAGMENT_SPREAD" -> Right $ DirectiveLocation_ExecutableDirectiveLocation FRAGMENT_SPREAD
      "INLINE_FRAGMENT" -> Right $ DirectiveLocation_ExecutableDirectiveLocation INLINE_FRAGMENT
      "SCHEMA" -> Right $ DirectiveLocation_TypeSystemDirectiveLocation SCHEMA
      "SCALAR" -> Right $ DirectiveLocation_TypeSystemDirectiveLocation SCALAR
      "OBJECT" -> Right $ DirectiveLocation_TypeSystemDirectiveLocation OBJECT
      "FIELD_DEFINITION" -> Right $ DirectiveLocation_TypeSystemDirectiveLocation FIELD_DEFINITION
      "ARGUMENT_DEFINITION" -> Right $ DirectiveLocation_TypeSystemDirectiveLocation ARGUMENT_DEFINITION
      "INTERFACE" -> Right $ DirectiveLocation_TypeSystemDirectiveLocation INTERFACE
      "UNION" -> Right $ DirectiveLocation_TypeSystemDirectiveLocation UNION
      "ENUM" -> Right $ DirectiveLocation_TypeSystemDirectiveLocation ENUM
      "ENUM_VALUE" -> Right $ DirectiveLocation_TypeSystemDirectiveLocation ENUM_VALUE
      "INPUT_OBJECT" -> Right $ DirectiveLocation_TypeSystemDirectiveLocation INPUT_OBJECT
      "INPUT_FIELD_DEFINITION" -> Right $ DirectiveLocation_TypeSystemDirectiveLocation INPUT_FIELD_DEFINITION
      s -> Left $ "Unknown directive location: " <> s

data DocumentBuildError
  = JsonDecodeError JsonDecodeError
  | InvalidIntrospectionSchema String

toParserError :: DocumentBuildError -> ParseError
toParserError = case _ of
  JsonDecodeError e -> ParseError (printJsonDecodeError e) initialPos
  InvalidIntrospectionSchema e -> ParseError e initialPos

noSchemaTypes :: forall r.
  Array
    { name :: Maybe String
    | r
    }
  -> Array
       { name :: Maybe String
       | r
       }
noSchemaTypes = filter (_.name >>> maybe true ( not startsWith "__"))


startsWith :: String -> String -> Boolean
startsWith pre str = String.take (String.length pre) str == pre