import { deepStrictEqual } from 'assert'
import serverFn from './server-fn.mjs';
import {main} from './output/Main/index.js';

const logs = []

console.log = (log) => {
  console.info(log)
  logs.push(log)
}

serverFn(main)

setTimeout(() => {
  deepStrictEqual(logs, [
    'Live Query update received',
    '(Right { greetings: ["Hi","Hello","Sup"] })',
    'Live Query update received',
    '(Right { greetings: ["Sup","Hi","Hello"] })',
    'Live Query update received',
    '(Right { greetings: ["Hello","Sup","Hi"] })',
  ])
  console.info('tests passed')
  process.exit(0)
}, 2000)
