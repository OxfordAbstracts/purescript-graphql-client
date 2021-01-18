const { schemaFromGqlToPursJsHasura } = require('../output/GraphQL.Client.CodeGen.Hasura');
const fs = require('fs');
const { promisify } = require('util');
const write = promisify(fs.writeFile);
const mkdirp = require('mkdirp');
const rm = promisify(require('rimraf'));
const glob = promisify(require('glob'));
const _ = require('lodash');
const { getSchemaCode } = require('./get-schema-code');
const { getQueryCode } = require('./get-query-code');
const cache = require('./cache');

const toPursOutsideType = t => {
  const path = t.slice(0, -5).split('/');

  return {
    moduleName: path.join('.'),
    typeName: path[path.length - 1]
  };
};

const getSchemaOrIdOutsideTypes = paths => {
  const typesPurs = paths.map(toPursOutsideType);
  return _.keyBy(typesPurs, t => t.typeName);
};

const globWithoutPrefix = async (prefix, pattern) => {
  const paths = await glob(`${prefix}${pattern}`);
  return paths.map(p => p.slice(prefix.length));
};

exports.writePursSchema = async (moduleName, gqlInput) => {
  console.log('writePursSchema', moduleName);
  console.log('gqlInput.length', gqlInput.length);

  const schemaTypes = (await globWithoutPrefix('../src/', 'Schema/Types/**/*.purs'));

  const outsideScalarTypes = getSchemaOrIdOutsideTypes(schemaTypes);
  const outsideColumnTypes = require('./outside-types');

  const input = { outsideScalarTypes, outsideColumnTypes, gqlInput };

  const cachedResult = await cache.get(input);

  let result;

  if(cachedResult){
    console.log('cache hit', moduleName);
    result = cachedResult;
  }else{
    console.log('cache miss', moduleName);

    const { result: newResult, parseError } =
      schemaFromGqlToPursJsHasura({ outsideScalarTypes, outsideColumnTypes })(gqlInput);

    if (parseError) {
      throw new Error(parseError);
    }
    result = newResult;
  }
  await cache.set(input, result);

  const {enums, mainSchemaCode, symbols} = result;

  await rm('../src/generated/GeneratedGql');
  await mkdirp('../src/generated/GeneratedGql/Enum');
  await mkdirp(`../src/generated/GeneratedGql/${moduleName}`);

  const schema = getSchemaCode(moduleName, mainSchemaCode, enums);

  await write(`../src/generated/GeneratedGql/${moduleName}/Schema.purs`, schema);

  const queryCode = getQueryCode(moduleName);

  await write(`../src/generated/GeneratedGql/${moduleName}/Query.purs`, queryCode.purs);
  await write(`../src/generated/GeneratedGql/${moduleName}/Query.js`, queryCode.js);

  return {symbols, enums};

};
