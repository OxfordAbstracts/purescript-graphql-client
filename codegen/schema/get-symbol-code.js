const _ = require('lodash');

exports.getSymbolCode = symbols => {

  const symbolString = _.sortBy(_.uniq(symbols), _.identity)
    .map(s => `${s} :: SProxy "${s}"
${s} = SProxy`)
    .join('\n');
    
  return `module GeneratedGql.Symbols where

import Data.Symbol (SProxy(..))

${symbolString}`;

};