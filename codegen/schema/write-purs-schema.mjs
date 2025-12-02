import { schemasFromGqlToPursJs } from "../../gen-schema-bundled.mjs";
import fs from "fs";
import { promisify } from "util";
import { dirname } from "path";

const writeFileRec = promisify((path, contents, cb) => {
  fs.mkdir(dirname(path), { recursive: true }, function (err) {
    if (err) return cb(err);

    fs.writeFile(path, contents, cb);
  });
});

export async function writePursSchemas(opts, gqlSchemas) {
  const { argsTypeError, parseError, result } = await schemasFromGqlToPursJs(
    opts,
    gqlSchemas,
  )();

  if (argsTypeError) {
    throw new Error(argsTypeError);
  }

  if (parseError) {
    throw new Error(parseError);
  }

  const { schemas, enums, directives, symbols } = result;

  await Promise.all(
    [...schemas, ...enums, ...directives, symbols].map(({ path, code }) =>
      writeFileRec(path, code),
    ),
  );

  return result;
}
