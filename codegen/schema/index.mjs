import fs from "node:fs/promises";
import { writePursSchemas } from "./write-purs-schema.mjs";
import { getGqlSchema } from "./get-gql-schema.mjs";

const mkdirp = (path) => fs.mkdir(path, { recursive: true });

export async function generateSchemas(opts, gqlEndpoints) {
  if (!Array.isArray(gqlEndpoints)) {
    gqlEndpoints = [gqlEndpoints];
  }
  await fs.rm(opts.dir, { recursive: true });
  await mkdirp(opts.dir);
  await mkdirp(opts.dir + "/Schema");
  await mkdirp(opts.dir + "/Enum");
  await mkdirp(opts.dir + "/Directives");
  const schemas = await Promise.all(gqlEndpoints.map(getGqlSchema));

  return await writePursSchemas(opts, schemas);
}

export async function generateSchema(opts) {
  const { modulePath, url } = opts;
  const moduleName = modulePath[modulePath.length - 1];

  return generateSchemas({ ...opts, modulePath: modulePath.slice(0, -1) }, [
    { moduleName, url },
  ]);
}
