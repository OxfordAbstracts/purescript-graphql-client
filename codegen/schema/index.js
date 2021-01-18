require('env2')('../../.env');
const { gqlRoles } = require('./gql-roles');
const {writePursSchema} = require('./write-purs-schema');
const {getSymbolCode} = require('./get-symbol-code');
const fs = require('fs');
const { promisify } = require('util');
const { getGqlSchema } = require('./get-gql-schema');
const { getEnumBody } = require('./get-enum-body');
const { uniqBy } = require('lodash');
const write = promisify(fs.writeFile);

const go = async () => {
  try {
    console.log(`generating schema for gql url: ${process.env.GQL_URL}`);
    
    const schemas = await Promise.all(gqlRoles.map(getGqlSchema));

    console.log('got schemas', schemas.length);

    const results = await Promise.all(schemas.map(s => writePursSchema(s.app, s.gql)));

    console.log('got results', results.length);

    const symbolsCode = getSymbolCode(results.flatMap(r => r.symbols));
    const enums = uniqBy(results.flatMap(r => r.enums), e => e.name);

    await write('../src/generated/GeneratedGql/Symbols.purs', symbolsCode);
    await Promise.all(enums.map(e => write(`../src/generated/GeneratedGql/Enum/${e.name}.purs`, getEnumBody(e))));

    console.log('schemas generated');

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

go();
