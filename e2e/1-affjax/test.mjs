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
    '["one"]',
    '(Right { widgets: [{ name: "one" }] })',
    "false",
    "false",
  ]);
  console.info("tests passed");
  process.exit(0);
}, 250);
