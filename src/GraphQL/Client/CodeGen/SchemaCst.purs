-- | Codegen functions to get purs schema code from graphQL schemas
module GraphQL.Client.CodeGen.SchemaCst
  ( gqlToPursSchema
  ) where

import Prelude

import Control.Alt ((<|>))
import Control.Monad.Writer (tell)
import Data.Array (notElem)
import Data.Array as Array
import Data.CodePoint.Unicode (isLower)
import Data.Filterable (class Filterable, filter)
import Data.GraphQL.AST as AST
import Data.List (List(..), mapMaybe, (:))
import Data.List as List
import Data.Map (Map, lookup)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe', maybe)
import Data.Newtype (unwrap, wrap)
import Data.String (codePointFromChar)
import Data.String as String
import Data.String.CodeUnits (charAt)
import Data.String.Extra (pascalCase)
import Data.Traversable (class Traversable, for, traverse)
import Data.Tuple (Tuple(..))
import Data.Unfoldable (none)
import GraphQL.Client.CodeGen.Types (InputOptions, GqlEnum)
import GraphQL.Client.CodeGen.UtilCst (qualifiedTypeToName)
import Partial.Unsafe (unsafePartial)
import PureScript.CST.Types (Module, Proper, QualifiedName)
import PureScript.CST.Types as CST
import Tidy.Codegen (declDerive, declNewtype, declType, docComments, leading, lineComments, typeApp, typeArrow, typeCtor, typeRecord, typeRecordEmpty, typeRow, typeWildcard)
import Tidy.Codegen.Class (class OverLeadingComments, class ToModuleName, class ToToken, toQualifiedName)
import Tidy.Codegen.Monad (CodegenT, codegenModule, importClass, importFrom, importType)
import Tidy.Codegen.Types (Qualified)

gqlToPursSchema :: InputOptions -> String -> AST.Document -> Array GqlEnum -> Module Void
gqlToPursSchema { gqlToPursTypes, idImport, fieldTypeOverrides, argTypeOverrides, useNewtypesForRecords } mName doc enums = do
  unsafePartial $ codegenModule mName do
    maybe_ <- importFrom "Data.Maybe" (importType "Maybe")
    newType <- importFrom "Data.Newtype" (importClass "Newtype")
    argsM <- importFrom "GraphQL.Client.Args"
      { notNull: importType "NotNull"
      }
    gqlUnion <- importFrom "GraphQL.Client.Union" (importType "GqlUnion")
    id <- case idImport of
      Nothing -> importFrom "GraphQL.Client.ID" (importType "ID")
      Just idImport_ -> importFrom idImport_.moduleName (importType idImport_.typeName)

    let
      enumsMap = Map.fromFoldable $ enums <#> \e ->
        let
          name = pascalCase e.name
        in
          Tuple name { moduleName: mName <> ".Enum." <> name, typeName: name }

    enumsM :: Map String _ <- genImports enumsMap

    gqlToPursTypesMs <- genImports gqlToPursTypes

    fieldTypeOverridesMs <- for fieldTypeOverrides genImports

    argTypeOverridesMs <- for argTypeOverrides (traverse genImports)

    json <- importFrom "Data.Argonaut.Core" (importType "Json")

    let
      unknownJson tName = leading (lineComments $ "Unknown scalar type. Add " <> tName <> " to gqlToPursTypes in codegen options to override this behaviour") json

      definitionToPurs :: AST.Definition -> List Decl
      definitionToPurs = case _ of
        AST.Definition_ExecutableDefinition _ -> mempty
        AST.Definition_TypeSystemDefinition def -> typeSystemDefinitionToPurs def
        AST.Definition_TypeSystemExtension _ -> mempty

      typeSystemDefinitionToPurs :: AST.TypeSystemDefinition -> List Decl
      typeSystemDefinitionToPurs = case _ of
        AST.TypeSystemDefinition_SchemaDefinition schemaDefinition -> schemaDefinitionToPurs schemaDefinition
        AST.TypeSystemDefinition_TypeDefinition typeDefinition -> typeDefinitionToPurs typeDefinition
        AST.TypeSystemDefinition_DirectiveDefinition _directiveDefinition -> mempty

      schemaDefinitionToPurs :: AST.SchemaDefinition -> List Decl
      schemaDefinitionToPurs (AST.SchemaDefinition { rootOperationTypeDefinition }) = mapMaybe rootOperationTypeDefinitionToPurs rootOperationTypeDefinition

      typeDefinitionToPurs :: AST.TypeDefinition -> List Decl
      typeDefinitionToPurs = case _ of
        AST.TypeDefinition_ScalarTypeDefinition scalarTypeDefinition -> List.fromFoldable $ scalarTypeDefinitionToPurs scalarTypeDefinition
        AST.TypeDefinition_ObjectTypeDefinition objectTypeDefinition -> objectTypeDefinitionToPurs objectTypeDefinition
        AST.TypeDefinition_InterfaceTypeDefinition _interfaceTypeDefinition -> mempty
        AST.TypeDefinition_UnionTypeDefinition unionTypeDefinition -> List.fromFoldable $ unionTypeDefinitionToPurs unionTypeDefinition
        AST.TypeDefinition_EnumTypeDefinition _enumTypeDefinition -> mempty
        AST.TypeDefinition_InputObjectTypeDefinition inputObjectTypeDefinition ->
          (inputObjectTypeDefinitionToPurs (_.name $ unwrap inputObjectTypeDefinition)) inputObjectTypeDefinition

      rootOperationTypeDefinitionToPurs :: AST.RootOperationTypeDefinition -> Maybe Decl
      rootOperationTypeDefinitionToPurs (AST.RootOperationTypeDefinition { operationType, namedType }) =
        if opStr /= actualType then
          pure $ declType opStr [] (typeCtor actualType)
        else
          none
        where
        actualType = pascalCase $ unwrap namedType

        opStr = case operationType of
          AST.Query -> "Query"
          AST.Mutation -> "Mutation"
          AST.Subscription -> "Subscription"

      scalarTypeDefinitionToPurs :: AST.ScalarTypeDefinition -> Maybe Decl
      scalarTypeDefinitionToPurs (AST.ScalarTypeDefinition { description, name }) =
        if (notElem tName builtInTypes) then
          pure $ comment description $ declType tName [] (typeCtor scalarType)
        else
          none
        where
        tName = pascalCase name

        scalarType =
          lookup tName gqlToPursTypesMs
            <|> (qualifiedTypeToName <$> lookup tName gqlToPursTypes)
            <|> lookup tName enumsM
            # fromMaybe' \_ -> unknownJson tName

        builtInTypes = [ "Int", "Number", "String", "Boolean", "ID" ]

      objectTypeDefinitionToPurs :: AST.ObjectTypeDefinition -> List Decl
      objectTypeDefinitionToPurs
        ( AST.ObjectTypeDefinition
            { description
            , fieldsDefinition
            , name
            }
        ) =

        let
          tName = pascalCase name
          record = maybe typeRecordEmpty (fieldsDefinitionToPurs name) fieldsDefinition
        in

          if useNewtypesForRecords then
            comment description (declNewtype tName [] tName record)
              : declDerive Nothing [] newType [ typeCtor tName, typeWildcard ]
              : Nil

          else
            comment description (declType tName [] record)
              : Nil

      -- tipe
      --   : declDerive Nothing [] newType [ typeCtor tName, typeWildcard ]
      --   : Nil

      fieldsDefinitionToPurs :: String -> AST.FieldsDefinition -> CST.Type Void
      fieldsDefinitionToPurs objectName (AST.FieldsDefinition fieldsDefinition) =
        typeRecord (map (fieldDefinitionToPurs objectName) $ Array.fromFoldable fieldsDefinition) Nothing

      fieldDefinitionToPurs :: String -> AST.FieldDefinition -> Tuple String (CST.Type Void)
      fieldDefinitionToPurs
        objectName
        ( AST.FieldDefinition
            { description
            , name
            , argumentsDefinition
            , type: tipe
            }
        ) = Tuple (safeFieldname name) case argumentsDefinition of
        Nothing -> pursType
        Just def ->
          [ argumentsDefinitionToPurs objectName name def
          ] `typeArrow` pursType
        where
        pursType :: CST.Type Void
        pursType = comment description case lookup objectName fieldTypeOverridesMs >>= lookup name of
          Nothing -> typeToPurs tipe
          Just out -> case tipe of
            AST.Type_NonNullType _ -> typeCtor out
            AST.Type_ListType _ -> wrapArray $ typeCtor out
            _ -> wrapMaybe $ typeCtor out

      argumentsDefinitionToPurs :: String -> String -> AST.ArgumentsDefinition -> (CST.Type Void)
      argumentsDefinitionToPurs objectName fieldName (AST.ArgumentsDefinition inputValueDefinitions) =
        typeRecord (map (inputValueDefinitionToPurs objectName fieldName) $ Array.fromFoldable inputValueDefinitions) Nothing

      inputValueDefinitionToPurs :: String -> String -> AST.InputValueDefinition -> Tuple String (CST.Type Void)
      inputValueDefinitionToPurs
        objectName
        fieldName
        ( AST.InputValueDefinition
            { description
            , name
            , type: tipe
            }
        ) = Tuple (safeFieldname name) $ comment description
        case lookup objectName fieldTypeOverridesMs >>= lookup name of
          Nothing -> argTypeToPurs objectName fieldName name tipe
          Just out -> case tipe of
            AST.Type_NonNullType _ -> wrapNotNull $ typeCtor out
            AST.Type_ListType _ -> wrapArray $ typeCtor out
            _ -> typeCtor out

      unionTypeDefinitionToPurs :: AST.UnionTypeDefinition -> Maybe Decl
      unionTypeDefinitionToPurs
        ( AST.UnionTypeDefinition
            { description
            , name
            , directives: Nothing
            , unionMemberTypes: Just (AST.UnionMemberTypes unionMemberTypes)
            }
        ) = Just $ comment description $ declType name [] $ typeApp (typeCtor gqlUnion)
        [ typeRow (map (unionMemberTypeToPurs <<< unwrap) $ Array.fromFoldable unionMemberTypes) Nothing
        ]

      unionTypeDefinitionToPurs _ = Nothing

      unionMemberTypeToPurs :: String -> Tuple String (CST.Type Void)
      unionMemberTypeToPurs ty = Tuple ty $ typeCtor ty

      -- TODO make fieldName Maybe
      inputObjectTypeDefinitionToPurs :: String -> AST.InputObjectTypeDefinition -> List Decl
      inputObjectTypeDefinitionToPurs
        fieldName
        ( AST.InputObjectTypeDefinition
            { description
            , inputFieldsDefinition
            , name
            }
        ) =
        let
          tName = pascalCase name
          record = maybe typeRecordEmpty (unwrap >>> (inputValueToFieldsDefinitionToPurs tName fieldName)) inputFieldsDefinition
        in
          (comment description $ declNewtype tName [] tName record)
            : declDerive Nothing [] tName [ typeCtor tName, typeWildcard ]
            : Nil

      inputValueToFieldsDefinitionToPurs :: String -> String -> List AST.InputValueDefinition -> CST.Type Void
      inputValueToFieldsDefinitionToPurs objectName fieldName definitions =
        typeRecord (map (inputValueDefinitionToPurs objectName fieldName) $ Array.fromFoldable definitions) Nothing

      getPursTypeName = namedTypeToPurs gqlToPursTypesMs id

      pursTypeCtr = typeCtor <<< getPursTypeName

      typeToPurs :: AST.Type -> CST.Type Void
      typeToPurs = case _ of
        (AST.Type_NamedType namedType) -> namedTypeToPursNullable namedType
        (AST.Type_ListType listType) -> listTypeToPursNullable listType
        (AST.Type_NonNullType notNullType) -> notNullTypeToPurs notNullType

      namedTypeToPursNullable :: AST.NamedType -> CST.Type Void
      namedTypeToPursNullable = wrapMaybe <<< typeCtor <<< getPursTypeName

      listTypeToPursNullable :: AST.ListType -> CST.Type Void
      listTypeToPursNullable t = wrapMaybe $ listTypeToPurs t

      wrapMaybe :: CST.Type Void -> CST.Type Void
      wrapMaybe s = typeApp (typeCtor maybe_) [ s ]

      wrapArray :: CST.Type Void -> CST.Type Void
      wrapArray s = typeApp (typeCtor "Array") [ s ]

      notNullTypeToPurs :: AST.NonNullType -> CST.Type Void
      notNullTypeToPurs = case _ of
        AST.NonNullType_NamedType t -> pursTypeCtr t
        AST.NonNullType_ListType t -> listTypeToPurs t

      listTypeToPurs :: AST.ListType -> CST.Type Void
      listTypeToPurs (AST.ListType t) = wrapArray $ typeToPurs t

      argTypeToPurs :: String -> String -> String -> AST.Type -> CST.Type Void
      argTypeToPurs objectName fieldName argName tipe = case tipe of
        (AST.Type_NamedType namedType) -> case lookup objectName argTypeOverridesMs >>= lookup fieldName >>= lookup argName of
          Nothing -> pursTypeCtr namedType
          Just out -> typeCtor out
        (AST.Type_ListType listType) -> argListTypeToPurs objectName fieldName argName listType
        (AST.Type_NonNullType notNullType) -> wrapNotNull $ argNotNullTypeToPurs objectName fieldName argName notNullType

      argNotNullTypeToPurs :: String -> String -> String -> AST.NonNullType -> CST.Type Void
      argNotNullTypeToPurs objectName fieldName argName = case _ of
        AST.NonNullType_NamedType t -> case lookup objectName argTypeOverridesMs >>= lookup fieldName >>= lookup argName of
          Nothing -> pursTypeCtr t
          Just out -> typeCtor out
        AST.NonNullType_ListType t -> argListTypeToPurs objectName fieldName argName t

      argListTypeToPurs :: String -> String -> String -> AST.ListType -> CST.Type Void
      argListTypeToPurs objectName fieldName argName (AST.ListType t) =
        wrapArray $ argTypeToPurs objectName fieldName argName t

      wrapNotNull s = typeApp (typeCtor argsM.notNull) [ s ]

    tell
      $ unwrap doc
          >>= definitionToPurs
          # Array.fromFoldable

genImports
  :: forall f e m name r
   . Filterable f
  => Traversable f
  => Monad m
  => Partial
  => ToToken name (Qualified Proper)
  => f
       { moduleName :: String
       , typeName :: name
       | r
       }
  -> CodegenT e m (f (QualifiedName Proper))
genImports = filter (_.moduleName >>> not String.null) >>> traverse genImport

genImport
  :: forall e m mod name r
   . Monad m
  => ToModuleName mod
  => ToToken name (Qualified Proper)
  => { moduleName :: mod
     , typeName :: name
     | r
     }
  -> CodegenT e m (QualifiedName Proper)
genImport t = importFrom t.moduleName (importType t.typeName)

comment :: ∀ a. OverLeadingComments a ⇒ Maybe String → a → a
comment = maybe identity (leading <<< docComments)

-- case str of 
--   Nothing -> identity
--   Just str' -> leading (docComments str') 

type Decl = CST.Declaration Void

-- imports
--   <> guard (imports /= "") "\n"
--   <> "\n"
--   <> mainCode
-- where
-- imports =
--   joinWith "\n"
--     -- $ toImports
--     $ nub
--     $ filter (not String.null)
--     $ toImport mainCode (Array.fromFoldable externalTypes)
--         <> toImport mainCode (joinMaps fieldTypeOverrides)
--         <> toImport mainCode (nub $ fold $ map joinMaps argTypeOverrides)
--         <> toImport mainCode
--           [ { moduleName: "Data.Argonaut.Core" }
--           , { moduleName: "GraphQL.Hasura.Array" }
--           ]

-- joinMaps = nub <<< foldl (\res m -> res <> Array.fromFoldable m) []

-- mainCode = unwrap doc # mapMaybe definitionToPurs # removeDuplicateDefinitions # intercalate "\n\n"

-- removeDuplicateDefinitions = List.nubBy (compare `on` getDefinitionTypeName)

-- getDefinitionTypeName :: String -> String
-- getDefinitionTypeName =
--   takeWhile (notEq (codePointFromChar '='))
--     >>> toLines
--     >>> filter (\l -> take (String.length commentPrefix) l /= commentPrefix)
--     >>> fromLines

-- definitionToPurs :: AST.Definition -> Maybe String
-- definitionToPurs = case _ of
--   AST.Definition_ExecutableDefinition _ -> Nothing
--   AST.Definition_TypeSystemDefinition def -> typeSystemDefinitionToPurs def
--   AST.Definition_TypeSystemExtension _ -> Nothing

-- typeSystemDefinitionToPurs :: AST.TypeSystemDefinition -> Maybe String
-- typeSystemDefinitionToPurs = case _ of
--   AST.TypeSystemDefinition_SchemaDefinition schemaDefinition -> Just $ schemaDefinitionToPurs schemaDefinition
--   AST.TypeSystemDefinition_TypeDefinition typeDefinition -> typeDefinitionToPurs typeDefinition
--   AST.TypeSystemDefinition_DirectiveDefinition directiveDefinition -> directiveDefinitionToPurs directiveDefinition

-- schemaDefinitionToPurs :: AST.SchemaDefinition -> String
-- schemaDefinitionToPurs (AST.SchemaDefinition { rootOperationTypeDefinition }) = map rootOperationTypeDefinitionToPurs rootOperationTypeDefinition # intercalate "\n\n"

-- rootOperationTypeDefinitionToPurs :: AST.RootOperationTypeDefinition -> String
-- rootOperationTypeDefinitionToPurs (AST.RootOperationTypeDefinition { operationType, namedType }) =
--   guard (opStr /= actualType) $
--     "type "
--       <> opStr
--       <> " = "
--       <> actualType
--   where
--   actualType = getPursTypeName namedType

--   opStr = case operationType of
--     AST.Query -> "Query"
--     AST.Mutation -> "Mutation"
--     AST.Subscription -> "Subscription"

-- typeDefinitionToPurs :: AST.TypeDefinition -> Maybe String
-- typeDefinitionToPurs = case _ of
--   AST.TypeDefinition_ScalarTypeDefinition scalarTypeDefinition -> Just $ scalarTypeDefinitionToPurs scalarTypeDefinition
--   AST.TypeDefinition_ObjectTypeDefinition objectTypeDefinition -> Just $ objectTypeDefinitionToPurs objectTypeDefinition
--   AST.TypeDefinition_InterfaceTypeDefinition interfaceTypeDefinition -> interfaceTypeDefinitionToPurs interfaceTypeDefinition
--   AST.TypeDefinition_UnionTypeDefinition unionTypeDefinition -> unionTypeDefinitionToPurs unionTypeDefinition
--   AST.TypeDefinition_EnumTypeDefinition enumTypeDefinition -> enumTypeDefinitionToPurs enumTypeDefinition
--   AST.TypeDefinition_InputObjectTypeDefinition inputObjectTypeDefinition ->
--     Just $ (inputObjectTypeDefinitionToPurs (_.name $ unwrap inputObjectTypeDefinition)) inputObjectTypeDefinition

-- scalarTypeDefinitionToPurs :: AST.ScalarTypeDefinition -> String
-- scalarTypeDefinitionToPurs (AST.ScalarTypeDefinition { description, name }) =
--   guard (notElem tName builtInTypes)
--     $ docComment description
--         <> "type "
--         <> tName
--         <> " = "
--         <> typeAndModule.moduleName
--         <> "."
--         <> typeAndModule.typeName
--   where
--   tName = typeName_ name

--   typeAndModule =
--     lookup tName externalTypes
--       # fromMaybe
--           { moduleName: "Data.Argonaut.Core"
--           , typeName: "Json -- Unknown scalar type. Add " <> tName <> " to externalTypes in codegen options to override this behaviour"
--           }

-- builtInTypes = [ "Int", "Number", "String", "Boolean", "ID", "GraphQL.Hasura.Array.Hasura_text" ]

-- objectTypeDefinitionToPurs :: AST.ObjectTypeDefinition -> String
-- objectTypeDefinitionToPurs
--   ( AST.ObjectTypeDefinition
--       { description
--       , fieldsDefinition
--       , name
--       }
--   ) =
--   let
--     tName = typeName_ name
--   in
--     docComment description
--       <>
--         if useNewtypesForRecords then
--           "newtype "
--             <> typeName_ name
--             <> " = "
--             <> typeName_ name
--             -- <> " "
--             <> (fieldsDefinition # maybe "{}" (fieldsDefinitionToPurs tName))
--             <> "\nderive instance newtype"
--             <> tName
--             <> " :: Newtype "
--             <> tName
--             <> " _"
--         else
--           "type "
--             <> typeName_ name
--             <> (fieldsDefinition # foldMap \fd -> " = " <> fieldsDefinitionToPurs tName fd)

-- fieldsDefinitionToPurs :: String -> AST.FieldsDefinition -> String
-- fieldsDefinitionToPurs objectName (AST.FieldsDefinition fieldsDefinition) =
--   indent
--     $ "\n{ "
--         <> intercalate "\n, " (map (fieldDefinitionToPurs objectName) fieldsDefinition)
--         <> "\n}"

-- fieldDefinitionToPurs :: String -> AST.FieldDefinition -> String
-- fieldDefinitionToPurs
--   objectName
--   ( AST.FieldDefinition
--       { description
--       , name
--       , argumentsDefinition
--       , type: tipe
--       }
--   ) =
--   inlineComment description
--     <> safeFieldname name
--     <> " :: "
--     <> foldMap (argumentsDefinitionToPurs objectName name) argumentsDefinition
--     <> case lookup objectName fieldTypeOverrides >>= lookup name of
--       Nothing -> typeToPurs tipe
--       Just out -> case tipe of
--         AST.Type_NonNullType _ -> out.moduleName <> "." <> out.typeName
--         AST.Type_ListType _ -> wrapArray $ out.moduleName <> "." <> out.typeName
--         _ -> wrapMaybe $ out.moduleName <> "." <> out.typeName

-- argumentsDefinitionToPurs :: String -> String -> AST.ArgumentsDefinition -> String
-- argumentsDefinitionToPurs objectName fieldName (AST.ArgumentsDefinition inputValueDefinitions) =
--   indent
--     $ "\n{ "
--         <> intercalate "\n, " (map (inputValueDefinitionToPurs objectName fieldName) inputValueDefinitions)
--         <> "\n}\n-> "

-- interfaceTypeDefinitionToPurs :: AST.InterfaceTypeDefinition -> Maybe String
-- interfaceTypeDefinitionToPurs (AST.InterfaceTypeDefinition _) = Nothing

-- unionTypeDefinitionToPurs :: AST.UnionTypeDefinition -> Maybe String
-- unionTypeDefinitionToPurs
--   ( AST.UnionTypeDefinition
--       { description
--       , name
--       , directives: Nothing
--       , unionMemberTypes: Just (AST.UnionMemberTypes unionMemberTypes)
--       }
--   ) = Just $
--   docComment description
--     <> "type "
--     <> name
--     <> " = GqlUnion"
--     <>
--       ( indent
--           $ "\n( "
--               <> intercalate "\n, " (map (unionMemberTypeToPurs <<< unwrap) unionMemberTypes)
--               <> "\n)"
--       )
-- unionTypeDefinitionToPurs _ = Nothing

-- unionMemberTypeToPurs :: String -> String
-- unionMemberTypeToPurs ty = "\"" <> ty <> "\" :: " <> ty

-- enumTypeDefinitionToPurs :: AST.EnumTypeDefinition -> Maybe String
-- enumTypeDefinitionToPurs (AST.EnumTypeDefinition _) = Nothing

-- -- TODO make fieldName Maybe
-- inputObjectTypeDefinitionToPurs :: String -> AST.InputObjectTypeDefinition -> String
-- inputObjectTypeDefinitionToPurs
--   fieldName
--   ( AST.InputObjectTypeDefinition
--       { description
--       , inputFieldsDefinition
--       , name
--       }
--   ) =
--   let
--     tName = typeName_ name
--   in
--     docComment description
--       <> "newtype "
--       <> tName
--       <> " = "
--       <> tName
--       <>
--         ( inputFieldsDefinition
--             # maybe "{}" \(AST.InputFieldsDefinition fd) ->
--                 inputValueToFieldsDefinitionToPurs tName fieldName fd
--         )
--       <> "\nderive instance newtype"
--       <> tName
--       <> " :: Newtype "
--       <> tName
--       <> " _"

-- inputValueToFieldsDefinitionToPurs :: String -> String -> List AST.InputValueDefinition -> String
-- inputValueToFieldsDefinitionToPurs objectName fieldName definitions =
--   indent
--     $ "\n{ "
--         <> intercalate "\n, " (map (inputValueDefinitionToPurs objectName fieldName) definitions)
--         <> "\n}"

-- inputValueDefinitionToPurs :: String -> String -> AST.InputValueDefinition -> String
-- inputValueDefinitionToPurs
--   objectName
--   fieldName
--   ( AST.InputValueDefinition
--       { description
--       , name
--       , type: tipe
--       }
--   ) =
--   inlineComment description
--     <> safeFieldname name
--     <> " :: "
--     <> case lookup objectName fieldTypeOverrides >>= lookup name of
--       Nothing -> argTypeToPurs objectName fieldName name tipe
--       Just out -> case tipe of
--         AST.Type_NonNullType _ -> wrapNotNull $ out.moduleName <> "." <> out.typeName
--         AST.Type_ListType _ -> wrapArray $ out.moduleName <> "." <> out.typeName
--         _ -> out.moduleName <> "." <> out.typeName

-- directiveDefinitionToPurs :: AST.DirectiveDefinition -> Maybe String
-- directiveDefinitionToPurs _ = Nothing

-- argTypeToPurs objectName fieldName argName tipe = case tipe of
--   (AST.Type_NamedType namedType) -> case lookup objectName argTypeOverrides >>= lookup fieldName >>= lookup argName of
--     Nothing -> getPursTypeName namedType
--     Just out -> out.moduleName <> "." <> out.typeName
--   (AST.Type_ListType listType) -> argListTypeToPurs objectName fieldName argName listType
--   (AST.Type_NonNullType notNullType) -> wrapNotNull $ argNotNullTypeToPurs objectName fieldName argName notNullType

-- argNotNullTypeToPurs :: String -> String -> String -> AST.NonNullType -> String
-- argNotNullTypeToPurs objectName fieldName argName = case _ of
--   AST.NonNullType_NamedType t -> case lookup objectName argTypeOverrides >>= lookup fieldName >>= lookup argName of
--     Nothing -> getPursTypeName t
--     Just out -> out.moduleName <> "." <> out.typeName
--   AST.NonNullType_ListType t -> argListTypeToPurs objectName fieldName argName t

-- argListTypeToPurs :: String -> String -> String -> AST.ListType -> String
-- argListTypeToPurs objectName fieldName argName (AST.ListType t) = "(Array " <> argTypeToPurs objectName fieldName argName t <> ")"

-- wrapNotNull s = if startsWith "(NotNull " (String.trim s) then s else "(NotNull " <> s <> ")"

-- startsWith pre str = pre == take (String.length pre) str

-- typeToPurs :: AST.Type -> String
-- typeToPurs = case _ of
--   (AST.Type_NamedType namedType) -> namedTypeToPursNullable namedType
--   (AST.Type_ListType listType) -> listTypeToPursNullable listType
--   (AST.Type_NonNullType notNullType) -> notNullTypeToPurs notNullType

-- namedTypeToPursNullable :: AST.NamedType -> String
-- namedTypeToPursNullable = wrapMaybe <<< getPursTypeName

-- listTypeToPursNullable :: AST.ListType -> String
-- listTypeToPursNullable t = wrapMaybe $ listTypeToPurs t

-- wrapMaybe s = if startsWith "(Maybe " s then s else "(Maybe " <> s <> ")"

-- notNullTypeToPurs :: AST.NonNullType -> String
-- notNullTypeToPurs = case _ of
--   AST.NonNullType_NamedType t -> getPursTypeName t
--   AST.NonNullType_ListType t -> listTypeToPurs t

-- listTypeToPurs :: AST.ListType -> String
-- listTypeToPurs (AST.ListType t) = wrapArray $ typeToPurs t

-- wrapArray s = "(Array " <> s <> ")"

-- typeName_ = typeName gqlToPursTypes

-- getPursTypeName = namedTypeToPurs gqlToPursTypes

-- gqlToPursEnums :: Map String String -> AST.Document -> Array GqlEnum
-- gqlToPursEnums gqlToPursTypes = unwrap >>> mapMaybe definitionToEnum >>> Array.fromFoldable
--   where
--   definitionToEnum :: AST.Definition -> Maybe GqlEnum
--   definitionToEnum = case _ of
--     AST.Definition_TypeSystemDefinition def -> typeSystemDefinitionToPurs def
--     _ -> Nothing

--   typeSystemDefinitionToPurs :: AST.TypeSystemDefinition -> Maybe GqlEnum
--   typeSystemDefinitionToPurs = case _ of
--     AST.TypeSystemDefinition_TypeDefinition typeDefinition -> typeDefinitionToPurs typeDefinition
--     _ -> Nothing

--   typeDefinitionToPurs :: AST.TypeDefinition -> Maybe GqlEnum
--   typeDefinitionToPurs = case _ of
--     AST.TypeDefinition_EnumTypeDefinition (AST.EnumTypeDefinition enumTypeDefinition) ->
--       Just
--         { name: typeName_ enumTypeDefinition.name
--         , description: enumTypeDefinition.description
--         , values: maybe [] enumValuesDefinitionToPurs enumTypeDefinition.enumValuesDefinition
--         }
--     _ -> Nothing

--   enumValuesDefinitionToPurs :: AST.EnumValuesDefinition -> Array String
--   enumValuesDefinitionToPurs def =
--     Array.fromFoldable $ unwrap def
--       <#> \(AST.EnumValueDefinition { enumValue }) ->
--         unwrap enumValue

--   typeName_ = typeName gqlToPursTypes

namedTypeToPurs :: Map String (QualifiedName Proper) -> QualifiedName Proper -> AST.NamedType -> QualifiedName Proper
namedTypeToPurs gqlToPursTypes id (AST.NamedType str) = typeName gqlToPursTypes id str

typeName :: Map String (QualifiedName Proper) -> QualifiedName Proper -> String -> QualifiedName Proper
typeName gqlToPursTypes id str =
  lookup str gqlToPursTypes
    # fromMaybe' \_ -> case pascalCase str of
        "Id" -> id
        notId -> qualifiy case notId of
          "Float" -> "Number"
          "Numeric" -> "Number"
          "Bigint" -> "Number"
          "Smallint" -> "Int"
          "Integer" -> "Int"
          "Int" -> "Int"
          "Int2" -> "Int"
          "Int4" -> "Int"
          "Int8" -> "Int"
          "Text" -> "String"
          "Citext" -> "String"
          "Jsonb" -> "Json"
          "Timestamp" -> "DateTime"
          "Timestamptz" -> "DateTime"
          s -> s

  where
  qualifiy :: String -> QualifiedName Proper
  qualifiy = toQualifiedName <<< (wrap :: _ -> Proper)

safeFieldname :: String -> String
safeFieldname s = if isSafe then s else show s
  where
  isSafe =
    charAt 0 s
      # maybe false \c ->
          c == '_' || (isLower $ codePointFromChar c)

-- argTypeToPurs :: Map String String -> AST.Type -> CST.Type Void
-- argTypeToPurs gqlToPursTypes = case _ of
--   (AST.Type_NamedType namedType) -> namedTypeToPurs gqlToPursTypes namedType
--   (AST.Type_ListType listType) -> argListTypeToPurs gqlToPursTypes listType
--   (AST.Type_NonNullType notNullType) -> wrapNotNull $ argNotNullTypeToPurs gqlToPursTypes notNullType

-- argNotNullTypeToPurs :: Map String String -> AST.NonNullType -> CST.Type Void
-- argNotNullTypeToPurs gqlToPursTypes = case _ of
--   AST.NonNullType_NamedType t -> namedTypeToPurs gqlToPursTypes t
--   AST.NonNullType_ListType t -> argListTypeToPurs gqlToPursTypes t

-- argListTypeToPurs :: Map String String -> AST.ListType -> CST.Type Void
-- argListTypeToPurs gqlToPursTypes (AST.ListType t) = unsafePartial $ typeApp (typeCtor "Array") [ argTypeToPurs gqlToPursTypes t ]

-- wrapNotNull :: CST.Type Void -> CST.Type Void
-- wrapNotNull s = unsafePartial $ typeApp (typeCtor "NotNull") [ s ]
