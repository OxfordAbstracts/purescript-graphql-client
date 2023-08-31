import { deepStrictEqual } from "assert";
import serverFn from "./server-fn.js";
import { main } from "./output/Main/index.js";

const logs = [];

console.log = (log) => {
  console.info(log);
  logs.push(log);
};

serverFn(main);

setTimeout(() => {
  deepStrictEqual(logs, [
    '(Right { widgets: [{ contains_bad_type: (Error (TypeMismatch "Object") unit), name: "one" }] })',
    '(Just [(Right "widgets"),(Left 0),(Right "contains_bad_type"),(Right "incorrect_type")])',
  ]);
  console.info("tests passed");
  process.exit(0);
}, 250);
