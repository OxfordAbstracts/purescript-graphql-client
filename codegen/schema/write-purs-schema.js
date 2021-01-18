const { schemaFromGqlToPursJsHasura } = require('../schema-code-gen-purs-output');
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

exports.writePursSchema = async (app, gqlInput) => {
  console.log('writePursSchema', app);
  console.log('gqlInput.length', gqlInput.length);

  const schemaTypes = (await globWithoutPrefix('../src/', 'Schema/Types/**/*.purs'));

  const outsideScalarTypes = getSchemaOrIdOutsideTypes(schemaTypes);
  const outsideColumnTypes = require('./outside-types');

  const input = { outsideScalarTypes, outsideColumnTypes, gqlInput };

  const cachedResult = await cache.get(input);

  let result;

  if(cachedResult){
    console.log('cache hit', app);
    result = cachedResult;
  }else{
    console.log('cache miss', app);

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
  await mkdirp(`../src/generated/GeneratedGql/${app}`);

  const schema = getSchemaCode(app, mainSchemaCode, enums);

  await write(`../src/generated/GeneratedGql/${app}/Schema.purs`, schema);

  const queryCode = getQueryCode(app);

  await write(`../src/generated/GeneratedGql/${app}/Query.purs`, queryCode.purs);
  await write(`../src/generated/GeneratedGql/${app}/Query.js`, queryCode.js);

  return {symbols, enums};

};
