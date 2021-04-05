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
-- | External scalar types. The object key is the name of the scalar type in the graphQL schema.
-- | When the scalar type is encountered it will be set at the type in the provided module
-- | Useful for handling custom scalar types such as `Date`
, externalTypes :: 
    Nullable
        ( Object
            { moduleName :: String
            , typeName :: String
            }
        )
-- | Override exsting types.
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
-- | Whether the extra Hasura types should be generated
, isHasura :: Nullable Boolean 
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
-- | External scalar types. The object key is the name of the scalar type in the graphQL schema.
-- | When the scalar type is encountered it will be set at the type in the provided module
-- | Useful for handling custom scalar types such as `Date`
, externalTypes :: 
    Nullable
        ( Object
            { moduleName :: String
            , typeName :: String
            }
        )
-- | Override exsting types.
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
-- | Whether the extra Hasura types should be generated
, isHasura :: Nullable Boolean 
}
```

2nd argument for generateSchemas 
```
Array
    -- | URL for your graphql endpoint
    { url :: String 
    , moduleName :: String 
    }
