Argument for generateSchema

```purs
 -- | URL for your graphql endpoint
{ url :: String
-- | The directory for the generated code
, dir :: Nullable String
-- | The generated module name parts
, modulePath :: Nullable (Array String)
-- | Whether the schema should use newtypes. Necessary for circular/recursive schemas
, useNewtypesForRecords :: Nullable Boolean
-- | How to map graphQL types to Purescript types. The keys are graphql types and the values are purescript types you want them to be decoded as. Reasonable defaults are provided if you don't specify
, gqlScalarsToPursTypes :: Nullable (Object String)
-- | Extra imports for the generated enums
, enumImports :: Nullable (Array String)
-- | Custom code to add to the generated enums
, customEnumCode :: Nullable ({name :: String, values :: Array {gql :: String, transformed :: String}} ->  String)
-- | A getter and setter functions for caching transpiled graphql.
-- | You will have to add the caching functionality yourself
-- | This will make rebuilds on large schemas faster
, cache ::
    Nullable
        { get :: String -> Promise (Nullable Json)
        , set :: { key :: String, val :: Json } -> Promise Unit
        }

-- | Add a custom module and type for the ID type
, idImport :: Nullable
  { moduleName :: String
  , typeName :: String
  }
-- | Override existing types.
-- | The outer object key is the name of the purescript type.
-- | The inner object key is the field name / purescript label
-- | When the field is encountered it will be set at the type in the provided module
-- | Useful for newtyping types such as IDs
, fieldTypeOverrides ::
    Nullable
        ( Object
            ( Object
                { moduleName :: String
                , typeName :: String
                }
            )
        )
-- | how to convert gql enum constructors to purescript strings. Will default to making their 1st character capital
, enumValueNameTransform :: Nullable (String -> String)
}
```

1st argument for generateSchemas

```purs
-- | The directory for the generated code
{ dir :: Nullable String
-- | The generated module name parts
, modulePath :: Nullable (Array String)
-- | Whether the schema should use newtypes. Necessary for circular/recursive schemas
, useNewtypesForRecords :: Nullable Boolean
-- | How to map graphQL types to Purescript types. The keys are graphql types and the values are purescript types you want them to be decoded as. Reasonable defaults are provided if you don't specify

, gqlScalarsToPursTypes :: Nullable (Object String)
-- | Extra imports for the generated enums
, enumImports :: Nullable (Array String)
-- | Custom code to add to the generated enums
, customEnumCode :: Nullable ({name :: String, values :: Array String} ->  String)
-- | A getter and setter functions for caching transpiled graphql.
-- | You will have to add the caching functionality yourself
-- | This will make rebuilds on large schemas faster
, cache ::
    Nullable
        { get :: String -> Promise (Nullable Json)
        , set :: { key :: String, val :: Json } -> Promise Unit
        }
-- | Add a custom module and type for the ID type
, idImport :: Nullable
  { moduleName :: String
  , typeName :: String
  }
-- | External scalar types. The object key is the name of the scalar type in the graphQL schema.
-- | When the scalar type is encountered it will be set at the type in the provided module
-- | Useful for handling custom scalar types such as `Date`
, gqlToPursTypes ::
    Nullable
        ( Object
            { moduleName :: String
            , typeName :: String
            }
        )
-- | Override existing types.
-- | The outer object key is the name of the purescript type.
-- | The inner object key is the field name / purescript label
-- | When the field is encountered it will be set at the type in the provided module
-- | Useful for newtyping types such as IDs
, fieldTypeOverrides ::
    Nullable
        ( Object
            ( Object
                { moduleName :: String
                , typeName :: String
                }
            )
        )
-- | how to convert gql enum constructors to purescript strings. Will default to making their 1st character capital
, enumValueNameTransform :: Nullable (String -> String)
}
```

2nd argument for generateSchemas

```
Array
    -- | URL for your graphql endpoint
    { url :: String
    , moduleName :: String
    }
```
