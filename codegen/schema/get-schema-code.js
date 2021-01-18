const getEnumImports = enums => enums.map(e => `import GeneratedGql.${e.name} (${e.name})`).join('\n');

exports.getSchemaCode = (app, mainSchemaCode, enums) => `module GeneratedGql.${app}.Schema where

import Data.Argonaut.Core (Json)
import Data.Date (Date)
import Data.DateTime (DateTime)
import Data.Time (Time)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import GraphQL.Client.Args (class ArgGql, class RecordArg, type (==>), NotNull)

${getEnumImports(enums)}
${mainSchemaCode}`;
