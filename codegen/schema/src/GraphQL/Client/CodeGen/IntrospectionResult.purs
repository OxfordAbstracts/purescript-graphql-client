module GraphQL.Client.CodeGen.IntrospectionResult where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, wrap)

type IntrospectionResult =
  { __schema :: Schema
  }

type Schema =
  { queryType :: TypeName
  , mutationType :: Maybe TypeName
  , subscriptionType :: Maybe TypeName
  , types :: Array FullType
  , directives :: Array Directive

  }

type Directive =
  { name :: String
  , description :: Maybe String
  , locations :: Array String
  , args :: Array InputValue
  }

type TypeName = { name :: Maybe String }

type FullType =
  { kind :: String
  , name :: Maybe String
  , description :: Maybe String
  , fields :: Maybe (Array IField)
  , inputFields :: Maybe (Array InputValue)
  , interfaces :: Maybe (Array TypeRef)
  , enumValues :: Maybe (Array EnumValue)
  , possibleTypes :: Maybe (Array TypeRef)
  }

type EnumValue =
  { name :: String
  , description :: Maybe String
  , isDeprecated :: Boolean
  , deprecationReason :: Maybe String
  }

type IField =
  { name :: String
  , description :: Maybe String
  , args :: Maybe (Array InputValue)
  , type :: TypeRef
  , isDeprecated :: Boolean
  , deprecationReason :: Maybe String
  }

type InputValue =
  { name :: String
  , description :: Maybe String
  , type :: TypeRef
  , defaultValue :: Maybe String
  }

newtype TypeRef = TypeRef
  { kind :: String
  , name :: Maybe String
  , ofType :: Maybe TypeRef
  }

derive instance Newtype TypeRef _

derive instance Eq TypeRef

instance DecodeJson TypeRef where
  decodeJson a = wrap <$> decodeJson a