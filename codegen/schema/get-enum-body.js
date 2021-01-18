
exports.getEnumBody = e => `module GeneratedGql.${e.name} where

import Prelude

import Class.DecodeOa (class DecodeOa, decodeOa)
import Class.EncodeOa (class EncodeOa, encodeOa)
import Data.String.Extra (snakeCase)
import Foreign (ForeignError(..), fail)
import Foreign.Class (class Decode, class Encode)
import GraphQL.Client.Args (class ArgGql)
import GraphQL.Client.ToGqlString (class GqlArgString)


data ${e.name} 
  = ${e.values.join('\n  | ')}


instance eq${e.name} :: Eq ${e.name} where 
  eq a b = eq (show a) (show b)

instance ord${e.name} :: Ord ${e.name} where
  compare a b = compare (show a) (show b)

instance encode${e.name} :: Encode ${e.name} where
  encode a = encodeOa a

instance decode${e.name} :: Decode ${e.name} where
  decode a = decodeOa a

instance encodeOa${e.name} :: EncodeOa ${e.name} where
  encodeOa a = encodeOa (show a)

instance argToGql${e.name} :: ArgGql ${e.name} ${e.name}

instance gqlArgString${e.name} :: GqlArgString ${e.name} where
  toGqlArgStringImpl a = snakeCase (show a)

instance decodeOa${e.name} :: DecodeOa ${e.name} where
  decodeOa a = decodeOa a >>= case _ of 
    ${e.values.map(v => `"${v}" -> pure ${v}`).join('\n    ')}
    s -> fail $ ForeignError $ "Not a ${e.name}: " <> s

instance show${e.name} :: Show ${e.name} where
  show a = case a of 
    ${e.values.map(v => `${v} -> "${v}"`).join('\n    ')}

`;
