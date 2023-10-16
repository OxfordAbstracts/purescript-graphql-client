module Data.GraphQL.Parser where

import Prelude hiding (between)

import Control.Alt ((<|>))
import Control.Lazy (fix)
import Data.Array (many, singleton, some)
import Data.Enum (toEnum)
import Data.Foldable (fold)
import Data.GraphQL.AST as AST
import Data.Int as DI
import Data.List (List(..), (:))
import Data.List as L
import Data.Maybe (Maybe(..), maybe)
import Data.Number as DN
import Data.String.CodePoints as CP
import Data.String.CodeUnits (fromCharArray)
import Data.Traversable (sequence)
import Parsing (Parser, ParserT, fail)
import Parsing.Combinators (between, lookAhead, option, optional, sepBy1, try, (<?>))
import Parsing.String (anyChar, char, string)
import Parsing.String.Basic (noneOf, oneOf)

-------
-- util
-------
c2str ∷ Char → Parser String String
c2str = pure <<< fromCharArray <<< singleton

ca2str ∷ Array Char → Parser String String
ca2str = pure <<< fromCharArray

toCA ∷ Char → Parser String (Array Char)
toCA = pure <<< singleton

-- | Parse phrases delimited and optionally terminated by a separator.
sepEndBy_ :: forall m s a sep. Monad m => ParserT s m a -> ParserT s m sep -> ParserT s m (List a)
sepEndBy_ p sep = sepEndBy1_ p sep <|> pure Nil

-- | Parse phrases delimited and optionally terminated by a separator, requiring at least one match.
sepEndBy1_ :: forall m s a sep. Monad m => ParserT s m a -> ParserT s m sep -> ParserT s m (List a)
sepEndBy1_ p sep = do
  a <- p
  (do _ <- sep
      as <- sepEndBy_ p sep
      pure (a : as)) <|> pure (L.singleton a)

--------------
-- chars
--------------
upper :: Array Char
upper = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]

lower :: Array Char
lower = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ]

digits :: Array Char
digits = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ]

nonZeroDigits :: Array Char
nonZeroDigits = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]

--------------
-- ignore
--------------
-- also needs unicode bom for ignore, this will fail on unicode...
whitespace ∷ Parser String Unit
whitespace = void $ oneOf [ ' ', '\t' ]

comment ∷ Parser String Unit
comment = void $ char '#' *> many (noneOf [ '\n' ])

comma ∷ Parser String Unit
comma = void $ char ','

lineTerminator ∷ Parser String Unit
lineTerminator = void $ char '\n'

ignorable ∷ Parser String Unit
ignorable = lineTerminator <|> comma <|> comment <|> whitespace

ignoreMe ∷ Parser String Unit
ignoreMe = void $ many ignorable

ignoreMe' ∷ Parser String Unit
ignoreMe' = void $ some ignorable

--------------
-- primitives
--------------
name ∷ Parser String String
name =
  fromCharArray
    <$> ( (<>)
          <$> (oneOf (upper <> lower <> [ '_' ]) >>= toCA)
          <*> (many (oneOf $ upper <> lower <> digits <> [ '_' ]))
      )

description ∷ Parser String String
description = stringValue >>= (\(AST.StringValue s) → pure s)

negativeSign ∷ Parser String String
negativeSign = char '-' >>= c2str

ip0 ∷ Parser String String
ip0 = (<>) <$> (option "" negativeSign) <*> (char '0' >>= c2str)

ipOther ∷ Parser String String
ipOther =
  fold
    <$> sequence
        [ option "" negativeSign
        , oneOf nonZeroDigits >>= c2str
        , many (oneOf digits) >>= ca2str
        ]

integerPart ∷ Parser String String
integerPart = (try ip0) <|> ipOther

intValue ∷ Parser String AST.IntValue
intValue = integerPart >>= maybe (fail "String not an int") (pure <<< AST.IntValue) <<< DI.fromString

fractionalPart ∷ Parser String String
fractionalPart =
  (<>)
    <$> (char '.' >>= c2str)
    <*> (many (oneOf digits) >>= ca2str)

floatValueFrac ∷ Parser String String
floatValueFrac =
  (<>)
    <$> integerPart
    <*> fractionalPart

exponentPart ∷ Parser String String
exponentPart =
  fold
    <$> sequence
        [ oneOf [ 'e', 'E' ] >>= c2str
        , option "" (oneOf [ '+', '-' ] >>= c2str)
        , some (oneOf digits) >>= ca2str
        ]

floatValueExp ∷ Parser String String
floatValueExp = (<>) <$> integerPart <*> exponentPart

floatValueFracExp ∷ Parser String String
floatValueFracExp =
  fold
    <$> sequence [ integerPart, fractionalPart, exponentPart ]

floatValue ∷ Parser String AST.FloatValue
floatValue = (try floatValueFracExp <|> try floatValueExp <|> floatValueFrac) >>= maybe (fail "String not a float") (pure <<< AST.FloatValue) <<< DN.fromString

singleQuote ∷ Parser String String
singleQuote = char '"' >>= c2str

tripleQuote ∷ Parser String String
tripleQuote = sequence [ char '"', char '"', char '"' ] >>= ca2str

uni ∷ Parser String Char
uni = oneOf (digits <> [ 'A', 'B', 'C', 'D', 'E', 'F' ] <> [ 'a', 'b', 'c', 'd', 'e', 'f' ])

simpleUnescapedString ∷ Parser String String
simpleUnescapedString = noneOf [ '\\', '"', '\n' ] >>= c2str

simpleUnicodeString ∷ Parser String String
simpleUnicodeString =
  (sequence [ char '\\' *> char 'u' *> uni, uni, uni, uni ]) >>= ca2str
    >>= ( maybe
          (fail "Unrepresentable code point")
          ( maybe
              (fail "Unrepresentable code point")
              (pure <<< CP.singleton <<< CP.codePointFromChar)
              <<< toEnum
          )
          <<< DI.fromStringAs DI.hexadecimal
      )

simpleEscapedString ∷ Parser String String
simpleEscapedString =
  char '\\' *> oneOf [ '"', '\\', '/', 'b', 'f', 'n', 'r', 't' ]
    >>= ( \x → case x of
          '"' → pure '"'
          '\\' → pure '\\'
          '/' → pure '/'
          'n' → pure '\n'
          'r' → pure '\r'
          't' → pure '\t'
          'b' → fail "Cannot handle backspace yet"
          'f' → fail "Cannot handle formfeed yet"
          _ → fail "No clue how to parse this escapedString"
      )
    >>= c2str

simpleStringSingleton ∷ Parser String String
simpleStringSingleton =
  (try simpleUnescapedString)
    <|> (try simpleUnicodeString)
    <|> simpleEscapedString

simpleStringValue ∷ Parser String String
simpleStringValue =
  between singleQuote singleQuote
    ( fold
        <$> (many simpleStringSingleton)
    )

notTripleQuote ∷ Parser String String
notTripleQuote = (lookAhead (sequence [ anyChar, anyChar, anyChar ])) >>= (\s → if (s == [ '"', '"', '"' ]) then (fail "this is a triple quote") else anyChar >>= c2str)

blockStringValue ∷ Parser String String
blockStringValue = between tripleQuote tripleQuote (fold <$> many notTripleQuote)

stringValue ∷ Parser String AST.StringValue
stringValue = AST.StringValue <$> ((try blockStringValue) <|> simpleStringValue)

variable ∷ Parser String AST.Variable
variable = AST.Variable <$> (char '$' *> name)

booleanValue ∷ Parser String AST.BooleanValue
booleanValue = AST.BooleanValue <$> ((string "true" *> pure true) <|> (string "false" *> pure false))

nullValue ∷ Parser String AST.NullValue
nullValue = string "null" *> (pure AST.NullValue)

enumValue ∷ Parser String AST.EnumValue
enumValue =
  AST.EnumValue
    <$> (name >>= \x → if (x == "null" || x == "true" || x == "false") then fail "Name cannot be null, false or true" else pure x)

listValue ∷ Parser String (AST.Value) → Parser String (AST.ListValue)
listValue = (<$>) AST.ListValue <<< listish "[" "]"

argument ∷ Parser String (AST.Value) → Parser String (AST.Argument)
argument vc =
  map AST.Argument $ { name: _, value: _ }
    <$> name
    <*> (ignoreMe *> char ':' *> ignoreMe *> vc)

_listish ∷ ∀ p. Parser String p → Parser String (L.List p)
_listish p = sepEndBy_ p ignoreMe

_listish1 ∷ ∀ p. Parser String p → Parser String (L.List p)
_listish1 p = L.fromFoldable <$> sepEndBy1_ p ignoreMe

listish ∷ ∀ p. String → String → Parser String p → Parser String (L.List p)
listish o c p = string o *> ignoreMe *> _listish p <* string c

objectValue ∷ Parser String (AST.Value) → Parser String (AST.ObjectValue)
objectValue = (<$>) AST.ObjectValue <<< listish "{" "}" <<< argument

arguments ∷ Parser String (AST.Arguments)
arguments = AST.Arguments <$> listish "(" ")" (argument value)

value ∷ Parser String (AST.Value)
value =
  fix \p →
    (try (AST.Value_Variable <$> variable))
      <|> (try (AST.Value_NullValue <$> nullValue))
      <|> (try (AST.Value_BooleanValue <$> booleanValue))
      <|> (try (AST.Value_StringValue <$> stringValue))
      <|> (try (AST.Value_FloatValue <$> floatValue))
      <|> (try (AST.Value_IntValue <$> intValue))
      <|> (try (AST.Value_EnumValue <$> enumValue))
      <|> (try (AST.Value_ListValue <$> listValue p))
      <|> (AST.Value_ObjectValue <$> objectValue p)
      <?> "value"

--- util
ooo ∷ ∀ a. Parser String a → Parser String (Maybe a)
ooo p = option Nothing (try p >>= pure <<< Just)

optDesc ∷ Parser String (Maybe String)
optDesc = ooo description

optDir ∷ Parser String (Maybe AST.Directives)
optDir = ooo directives

optDv ∷ Parser String (Maybe AST.DefaultValue)
optDv = ooo defaultValue

--- spec
typeSystemDirectiveLocation ∷ Parser String AST.TypeSystemDirectiveLocation
typeSystemDirectiveLocation =
  (try (string "SCHEMA") *> pure AST.SCHEMA)
    <|> (try (string "SCALAR") *> pure AST.SCALAR)
    <|> (try (string "OBJECT") *> pure AST.OBJECT)
    <|> (try (string "FIELD_DEFINITION") *> pure AST.FIELD_DEFINITION)
    <|> (try (string "ARGUMENT_DEFINITION") *> pure AST.ARGUMENT_DEFINITION)
    <|> (try (string "INTERFACE") *> pure AST.INTERFACE)
    <|> (try (string "UNION") *> pure AST.UNION)
    <|> (try (string "ENUM") *> pure AST.ENUM)
    <|> (try (string "ENUM_VALUE") *> pure AST.ENUM_VALUE)
    <|> (try (string "INPUT_OBJECT") *> pure AST.INPUT_OBJECT)
    <|> (string "INPUT_FIELD_DEFINITION" *> pure AST.INPUT_FIELD_DEFINITION)
    <?> "typeSystemDirectiveLocation"

executableDirectiveLocation ∷ Parser String AST.ExecutableDirectiveLocation
executableDirectiveLocation =
  (try (string "QUERY") *> pure AST.QUERY)
    <|> (try (string "MUTATION") *> pure AST.MUTATION)
    <|> (try (string "SUBSCRIPTION") *> pure AST.SUBSCRIPTION)
    <|> (try (string "FIELD") *> pure AST.FIELD)
    <|> (try (string "FRAGMENT_DEFINITION") *> pure AST.FRAGMENT_DEFINITION)
    <|> (try (string "FRAGMENT_SPREAD") *> pure AST.FRAGMENT_SPREAD)
    <|> (string "INLINE_FRAGMENT" *> pure AST.INLINE_FRAGMENT)
    <?> "executableDirectiveLocation"

directiveLocation ∷ Parser String AST.DirectiveLocation
directiveLocation =
  (try (AST.DirectiveLocation_TypeSystemDirectiveLocation <$> typeSystemDirectiveLocation))
    <|> (AST.DirectiveLocation_ExecutableDirectiveLocation <$> executableDirectiveLocation)
    <?> "directiveLocation"

directiveLocations ∷ Parser String AST.DirectiveLocations
directiveLocations =
  AST.DirectiveLocations <<< L.fromFoldable
    <$> ( ignoreMe
          *> optional (char '|')
          *> sepBy1 (ignoreMe *> directiveLocation <* ignoreMe) (char '|')
      )

directive ∷ Parser String AST.Directive
directive =
  map AST.Directive $ { name: _, arguments: _ }
    <$> (char '@' *> name)
    <*> (ignoreMe *> ooo arguments)

directives ∷ Parser String AST.Directives
directives = AST.Directives <$> _listish1 directive

namedType ∷ Parser String AST.NamedType
namedType = AST.NamedType <$> name

listType ∷ Parser String AST.Type → Parser String AST.ListType
listType t = AST.ListType <$> (string "[" *> ignoreMe *> t <* ignoreMe <* string "]")

nonNullType ∷ Parser String AST.Type → Parser String AST.NonNullType
nonNullType v =
  (try (AST.NonNullType_NamedType <$> (namedType <* char '!')))
    <|> (AST.NonNullType_ListType <$> (listType v <* char '!'))
    <?> "nonNullType"

_type ∷ Parser String AST.Type
_type =
  fix \p →
    (try (AST.Type_NonNullType <$> nonNullType p))
      <|> (try (AST.Type_NamedType <$> namedType))
      <|> (AST.Type_ListType <$> listType p)
      <?> "type"

defaultValue ∷ Parser String AST.DefaultValue
defaultValue = char '=' *> ignoreMe *> (AST.DefaultValue <$> value)

variableDefinition ∷ Parser String AST.VariableDefinition
variableDefinition =
  map AST.VariableDefinition $ { variable: _, type: _, defaultValue: _ }
    <$> variable
    <*> (ignoreMe *> char ':' *> ignoreMe *> _type)
    <*> (ignoreMe *> optDv)

variableDefinitions ∷ Parser String AST.VariableDefinitions
variableDefinitions = AST.VariableDefinitions <$> listish "(" ")" variableDefinition

fragmentName ∷ Parser String String
fragmentName = name >>= \x → if x == "on" then fail "Fragment name cannot be 'on'" else pure x

typeCondition ∷ Parser String AST.TypeCondition
typeCondition = AST.TypeCondition <$> (string "on" *> ignoreMe *> namedType)

fragmentSpread ∷ Parser String AST.FragmentSpread
fragmentSpread =
  map AST.FragmentSpread $ { fragmentName: _, directives: _ }
    <$> (string "..." *> ignoreMe *> fragmentName)
    <*> (ignoreMe *> optDir)

ignorableExtension ∷ String → Parser String Unit
ignorableExtension s =
  string "extend"
    *> ignoreMe
    *> string s
    *> pure unit

unionMemberTypes ∷ Parser String AST.UnionMemberTypes
unionMemberTypes = AST.UnionMemberTypes <<< L.fromFoldable <$> sepBy1 (ignoreMe *> namedType <* ignoreMe) (char '|')

unionTypeExtensionWithDirectives ∷ Parser String AST.UnionTypeExtension
unionTypeExtensionWithDirectives =
  map AST.UnionTypeExtension_With_Directives $ { name: _, directives: _ }
    <$> name
    <*> (ignoreMe *> directives)

unionTypeExtensionWithUnionMemberTypes ∷ Parser String AST.UnionTypeExtension
unionTypeExtensionWithUnionMemberTypes =
  map AST.UnionTypeExtension_With_UnionMemberTypes $ { name: _, directives: _, unionMemberTypes: _ }
    <$> name
    <*> (ignoreMe *> optDir)
    <*> (ignoreMe *> char '=' *> ignoreMe *> unionMemberTypes)

unionTypeExtension ∷ Parser String AST.UnionTypeExtension
unionTypeExtension =
  ignorableExtension "union"
    *> ignoreMe
    *> ( (try unionTypeExtensionWithUnionMemberTypes)
          <|> unionTypeExtensionWithDirectives
          <?> "unionTypeExtension"
      )

unionTypeDefinition ∷ Parser String AST.UnionTypeDefinition
unionTypeDefinition =
  map AST.UnionTypeDefinition $ { description: _, name: _, directives: _, unionMemberTypes: _ }
    <$> optDesc
    <*> (ignoreMe *> string "union" *> ignoreMe *> name)
    <*> (ignoreMe *> optDir)
    <*> (ignoreMe *> char '=' *> ignoreMe *> ooo unionMemberTypes)

enumValueDefinition ∷ Parser String AST.EnumValueDefinition
enumValueDefinition =
  map AST.EnumValueDefinition $ { description: _, enumValue: _, directives: _ }
    <$> optDesc
    <*> (ignoreMe *> enumValue)
    <*> (ignoreMe *> optDir)

enumValuesDefinition ∷ Parser String AST.EnumValuesDefinition
enumValuesDefinition = AST.EnumValuesDefinition <$> listish "{" "}" enumValueDefinition

enumTypeExtensionWithDirectives ∷ Parser String AST.EnumTypeExtension
enumTypeExtensionWithDirectives =
  map AST.EnumTypeExtension_With_Directives $ { name: _, directives: _ }
    <$> name
    <*> (ignoreMe *> directives)

enumTypeExtensionWithEnumValuesDefinition ∷ Parser String AST.EnumTypeExtension
enumTypeExtensionWithEnumValuesDefinition =
  map AST.EnumTypeExtension_With_EnumValuesDefinition $ { name: _, directives: _, enumValuesDefinition: _ }
    <$> name
    <*> (ignoreMe *> optDir)
    <*> (ignoreMe *> enumValuesDefinition)

enumTypeExtension ∷ Parser String AST.EnumTypeExtension
enumTypeExtension =
  ignorableExtension "enum"
    *> ignoreMe
    *> ( (try enumTypeExtensionWithEnumValuesDefinition)
          <|> enumTypeExtensionWithDirectives
          <?> "enumTypeExtension"
      )

enumTypeDefinition ∷ Parser String AST.EnumTypeDefinition
enumTypeDefinition =
  map AST.EnumTypeDefinition $ { description: _, name: _, directives: _, enumValuesDefinition: _ }
    <$> optDesc
    <*> (ignoreMe *> string "enum" *> ignoreMe *> name)
    <*> (ignoreMe *> optDir)
    <*> (ignoreMe *> ooo enumValuesDefinition)

inputValueDefinition ∷ Parser String AST.InputValueDefinition
inputValueDefinition =
  map AST.InputValueDefinition $ { description: _, name: _, type: _, defaultValue: _, directives: _ }
    <$> optDesc
    <*> (ignoreMe *> name)
    <*> (ignoreMe *> char ':' *> ignoreMe *> _type)
    <*> (ignoreMe *> optDv)
    <*> (ignoreMe *> optDir)

argumentsDefinition ∷ Parser String (AST.ArgumentsDefinition)
argumentsDefinition = AST.ArgumentsDefinition <$> listish "(" ")" inputValueDefinition

operationType ∷ Parser String (AST.OperationType)
operationType =
  (try $ string "query" *> pure AST.Query)
    <|> (try $ string "mutation" *> pure AST.Mutation)
    <|> (string "subscription" *> pure AST.Subscription)
    <?> "operation type"

operationTypeDefinition ∷ Parser String (AST.OperationTypeDefinition)
operationTypeDefinition =
  map AST.OperationTypeDefinition $ { operationType: _, namedType: _ }
    <$> operationType
    <*> (ignoreMe *> char ':' *> ignoreMe *> namedType)

scalarTypeExtension ∷ Parser String (AST.ScalarTypeExtension)
scalarTypeExtension =
  map AST.ScalarTypeExtension $ { name: _, directives: _ }
    <$> (ignorableExtension "scalar" *> ignoreMe *> name)
    <*> (ignoreMe *> directives)

implementsInterfaces ∷ Parser String (AST.ImplementsInterfaces)
implementsInterfaces =
  string "implements"
    *> ignoreMe
    *> optional (char '&')
    *> ignoreMe
    *> (AST.ImplementsInterfaces <<< L.fromFoldable <$> sepBy1 (ignoreMe *> namedType <* ignoreMe) (char '&'))

scalarTypeDefinition ∷ Parser String (AST.ScalarTypeDefinition)
scalarTypeDefinition =
  map AST.ScalarTypeDefinition $ { description: _, name: _, directives: _ }
    <$> optDesc
    <*> (ignoreMe *> string "scalar" *> ignoreMe *> name)
    <*> (ignoreMe *> optDir)

fieldDefinition ∷ Parser String (AST.FieldDefinition)
fieldDefinition =
  map AST.FieldDefinition $ { description: _, name: _, argumentsDefinition: _, type: _, directives: _ }
    <$> optDesc
    <*> (ignoreMe *> name)
    <*> (ignoreMe *> ooo argumentsDefinition)
    <*> (ignoreMe *> char ':' *> ignoreMe *> _type)
    <*> (ignoreMe *> optDir)

fieldsDefinition ∷ Parser String (AST.FieldsDefinition)
fieldsDefinition = AST.FieldsDefinition <$> listish "{" "}" fieldDefinition

objectTypeDefinition ∷ Parser String (AST.ObjectTypeDefinition)
objectTypeDefinition =
  map AST.ObjectTypeDefinition $ { description: _, name: _, implementsInterfaces: _, directives: _, fieldsDefinition: _ }
    <$> optDesc
    <*> (ignoreMe *> string "type" *> ignoreMe *> name)
    <*> (ignoreMe *> ooo implementsInterfaces)
    <*> (ignoreMe *> optDir)
    <*> (ignoreMe *> ooo fieldsDefinition)

schemaExtensionWithDirectives ∷ Parser String AST.SchemaExtension
schemaExtensionWithDirectives = map AST.SchemaExtension_With_Directives $ { directives: _ } <$> directives

operationTypesDefinition ∷ Parser String (L.List AST.OperationTypeDefinition)
operationTypesDefinition = listish "{" "}" operationTypeDefinition

schemaExtensionWithOperationTypeDefinition ∷ Parser String AST.SchemaExtension
schemaExtensionWithOperationTypeDefinition =
  map AST.SchemaExtension_With_OperationTypeDefinition $ { directives: _, operationTypesDefinition: _ }
    <$> optDir
    <*> (ignoreMe *> operationTypesDefinition)

schemaExtension ∷ Parser String AST.SchemaExtension
schemaExtension =
  ignorableExtension "schema"
    *> ignoreMe
    *> ( (try schemaExtensionWithOperationTypeDefinition)
          <|> schemaExtensionWithDirectives
          <?> "schemaExtension"
      )

--------
objectTypeExtensionWithImplementsInterfaces ∷ Parser String AST.ObjectTypeExtension
objectTypeExtensionWithImplementsInterfaces =
  map AST.ObjectTypeExtension_With_ImplementsInterfaces $ { name: _, implementsInterfaces: _ }
    <$> name
    <*> (ignoreMe *> implementsInterfaces)

objectTypeExtensionWithDirectives ∷ Parser String AST.ObjectTypeExtension
objectTypeExtensionWithDirectives =
  map AST.ObjectTypeExtension_With_Directives $ { name: _, implementsInterfaces: _, directives: _ }
    <$> name
    <*> (ignoreMe *> ooo implementsInterfaces)
    <*> (ignoreMe *> directives)

objectTypeExtensionWithFieldsDefinition ∷ Parser String AST.ObjectTypeExtension
objectTypeExtensionWithFieldsDefinition =
  map AST.ObjectTypeExtension_With_FieldsDefinition $ { name: _, implementsInterfaces: _, directives: _, fieldsDefinition: _ }
    <$> name
    <*> (ignoreMe *> ooo implementsInterfaces)
    <*> (ignoreMe *> optDir)
    <*> (ignoreMe *> fieldsDefinition)

objectTypeExtension ∷ Parser String AST.ObjectTypeExtension
objectTypeExtension =
  ignorableExtension "type"
    *> ignoreMe
    *> ( (try objectTypeExtensionWithFieldsDefinition)
          <|> (try objectTypeExtensionWithDirectives)
          <|> objectTypeExtensionWithImplementsInterfaces
          <?> "objectTypeExtension"
      )

-----
inputObjectTypeExtensionWithDirectives ∷ Parser String AST.InputObjectTypeExtension
inputObjectTypeExtensionWithDirectives =
  map AST.InputObjectTypeExtension_With_Directives $ { name: _, directives: _ }
    <$> name
    <*> (ignoreMe *> directives)

inputFieldsDefinition ∷ Parser String AST.InputFieldsDefinition
inputFieldsDefinition = AST.InputFieldsDefinition <$> listish "{" "}" inputValueDefinition

inputObjectTypeExtensionWithInputFieldsDefinition ∷ Parser String AST.InputObjectTypeExtension
inputObjectTypeExtensionWithInputFieldsDefinition =
  map AST.InputObjectTypeExtension_With_InputFieldsDefinition $ { name: _, directives: _, inputFieldsDefinition: _ }
    <$> name
    <*> (ignoreMe *> optDir)
    <*> (ignoreMe *> inputFieldsDefinition)

inputObjectTypeExtension ∷ Parser String AST.InputObjectTypeExtension
inputObjectTypeExtension =
  ignorableExtension "input"
    *> ignoreMe
    *> ( (try inputObjectTypeExtensionWithInputFieldsDefinition)
          <|> inputObjectTypeExtensionWithDirectives
          <?> "inputObjectTypeExtension"
      )

inputObjectTypeDefinition ∷ Parser String AST.InputObjectTypeDefinition
inputObjectTypeDefinition =
  map AST.InputObjectTypeDefinition $ { description: _, name: _, directives: _, inputFieldsDefinition: _ }
    <$> optDesc
    <*> (ignoreMe *> string "input" *> ignoreMe *> name)
    <*> (ignoreMe *> optDir)
    <*> (ignoreMe *> ooo inputFieldsDefinition)

-----
interfaceTypeExtensionWithDirectives ∷ Parser String AST.InterfaceTypeExtension
interfaceTypeExtensionWithDirectives =
  map AST.InterfaceTypeExtension_With_Directives $ { name: _, directives: _ }
    <$> name
    <*> (ignoreMe *> directives)

interfaceTypeExtensionWithFieldsDefinition ∷ Parser String AST.InterfaceTypeExtension
interfaceTypeExtensionWithFieldsDefinition =
  map AST.InterfaceTypeExtension_With_FieldsDefinition $ { name: _, directives: _, fieldsDefinition: _ }
    <$> name
    <*> (ignoreMe *> optDir)
    <*> (ignoreMe *> fieldsDefinition)

interfaceTypeExtension ∷ Parser String AST.InterfaceTypeExtension
interfaceTypeExtension =
  ignorableExtension "input"
    *> ignoreMe
    *> ( (try interfaceTypeExtensionWithFieldsDefinition)
          <|> interfaceTypeExtensionWithDirectives
          <?> "interfaceTypeExtension"
      )

interfaceTypeDefinition ∷ Parser String AST.InterfaceTypeDefinition
interfaceTypeDefinition =
  map AST.InterfaceTypeDefinition $ { description: _, name: _, directives: _, fieldsDefinition: _ }
    <$> optDesc
    <*> (ignoreMe *> string "interface" *> ignoreMe *> name)
    <*> (ignoreMe *> optDir)
    <*> (ignoreMe *> ooo fieldsDefinition)

typeDefinition ∷ Parser String AST.TypeDefinition
typeDefinition =
  (try (AST.TypeDefinition_ScalarTypeDefinition <$> scalarTypeDefinition))
    <|> (try (AST.TypeDefinition_ObjectTypeDefinition <$> objectTypeDefinition))
    <|> (try (AST.TypeDefinition_InterfaceTypeDefinition <$> interfaceTypeDefinition))
    <|> (try (AST.TypeDefinition_UnionTypeDefinition <$> unionTypeDefinition))
    <|> (try (AST.TypeDefinition_EnumTypeDefinition <$> enumTypeDefinition))
    <|> (AST.TypeDefinition_InputObjectTypeDefinition <$> inputObjectTypeDefinition)
    <?> "typeDefinition"

typeExtension ∷ Parser String AST.TypeExtension
typeExtension =
  (try (AST.TypeExtension_ScalarTypeExtension <$> scalarTypeExtension))
    <|> (try (AST.TypeExtension_ObjectTypeExtension <$> objectTypeExtension))
    <|> (try (AST.TypeExtension_InterfaceTypeExtension <$> interfaceTypeExtension))
    <|> (try (AST.TypeExtension_UnionTypeExtension <$> unionTypeExtension))
    <|> (try (AST.TypeExtension_EnumTypeExtension <$> enumTypeExtension))
    <|> (AST.TypeExtension_InputObjectTypeExtension <$> inputObjectTypeExtension)
    <?> "typeExtension"

rootOperationDefinition ∷ Parser String AST.RootOperationTypeDefinition
rootOperationDefinition =
  map AST.RootOperationTypeDefinition $ { operationType: _, namedType: _ }
    <$> operationType
    <*> (ignoreMe *> char ':' *> ignoreMe *> namedType)

schemaDefinition ∷ Parser String AST.SchemaDefinition
schemaDefinition =
  map AST.SchemaDefinition $ { directives: _, rootOperationTypeDefinition: _ }
    <$> (string "schema" *> ignoreMe *> optDir)
    <*> (ignoreMe *> listish "{" "}" rootOperationDefinition)

directiveDefinition ∷ Parser String AST.DirectiveDefinition
directiveDefinition =
  map AST.DirectiveDefinition $ { description: _, name: _, argumentsDefinition: _, directiveLocations: _ }
    <$> optDesc
    <*> (ignoreMe *> string "directive" *> ignoreMe *> char '@' *> name)
    <*> (ignoreMe *> ooo argumentsDefinition)
    <*> (ignoreMe *> string "on" *> ignoreMe *> directiveLocations)

typeSystemDefinition ∷ Parser String AST.TypeSystemDefinition
typeSystemDefinition =
  (try (AST.TypeSystemDefinition_SchemaDefinition <$> schemaDefinition))
    <|> (try (AST.TypeSystemDefinition_TypeDefinition <$> typeDefinition))
    <|> (AST.TypeSystemDefinition_DirectiveDefinition <$> directiveDefinition)
    <?> "typeSystemDefinition"

alias ∷ Parser String String
alias = name <* ignoreMe <* char ':'

inlineFragment ∷ Parser String AST.SelectionSet → Parser String AST.InlineFragment
inlineFragment ss =
  map AST.InlineFragment $ { typeCondition: _, directives: _, selectionSet: _ }
    <$> (string "..." *> ignoreMe *> ooo typeCondition)
    <*> (ignoreMe *> optDir)
    <*> (ignoreMe *> ss)

selection ∷ Parser String AST.SelectionSet → Parser String AST.Selection
selection ss =
  (try (AST.Selection_Field <$> (field ss)))
    <|> (try (AST.Selection_FragmentSpread <$> fragmentSpread))
    <|> (AST.Selection_InlineFragment <$> (inlineFragment ss))
    <?> "selection"

selectionSet ∷ Parser String AST.SelectionSet
selectionSet = fix \p → AST.SelectionSet <$> listish "{" "}" (selection p)

field ∷ Parser String AST.SelectionSet → Parser String AST.Field
field ss =
  map AST.Field $ { alias: _, name: _, arguments: _, directives: _, selectionSet: _ }
    <$> ooo alias
    <*> (ignoreMe *> name)
    <*> (ignoreMe *> ooo arguments)
    <*> (ignoreMe *> optDir)
    <*> (ignoreMe *> ooo ss)

operationDefinition ∷ Parser String AST.OperationDefinition
operationDefinition =
  (try (AST.OperationDefinition_SelectionSet <$> selectionSet))
    <|> ( map AST.OperationDefinition_OperationType $ { operationType: _, name: _, variableDefinitions: _, directives: _, selectionSet: _ }
          <$> operationType
          <*> (ignoreMe *> ooo name)
          <*> (ignoreMe *> ooo variableDefinitions)
          <*> (ignoreMe *> optDir)
          <*> (ignoreMe *> selectionSet)
      )

fragmentDefinition ∷ Parser String AST.FragmentDefinition
fragmentDefinition =
  map AST.FragmentDefinition $ { fragmentName: _, typeCondition: _, directives: _, selectionSet: _ }
    <$> (string "fragment" *> ignoreMe *> fragmentName)
    <*> (ignoreMe *> typeCondition)
    <*> (ignoreMe *> optDir)
    <*> selectionSet

typeSystemExtension ∷ Parser String AST.TypeSystemExtension
typeSystemExtension =
  (try (AST.TypeSystemExtension_SchemaExtension <$> schemaExtension))
    <|> (AST.TypeSystemExtension_TypeExtension <$> typeExtension)
    <?> "typeSystemExtension"

executableDefinition ∷ Parser String AST.ExecutableDefinition
executableDefinition =
  (try (AST.ExecutableDefinition_OperationDefinition <$> operationDefinition))
    <|> (AST.ExecutableDefinition_FragmentDefinition <$> fragmentDefinition)
    <?> "executableDefinition"

definition ∷ Parser String AST.Definition
definition =
  (try (AST.Definition_ExecutableDefinition <$> executableDefinition))
    <|> (try (AST.Definition_TypeSystemDefinition <$> typeSystemDefinition))
    <|> (AST.Definition_TypeSystemExtension <$> typeSystemExtension)
    <?> "definition"

document ∷ Parser String AST.Document
document = AST.Document <$> (ignoreMe *> _listish definition)
