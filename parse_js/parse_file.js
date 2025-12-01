// parse_js/parse_file.js
// usage: node parse_js/parse_file.js input.js output.json

import fs from "fs";
import { parse } from "@babel/parser";

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error("Usage: node parse_js/parse_file.js <input.js> <output.json>");
  process.exit(1);
}

const code = fs.readFileSync(inputPath, "utf8");

const ast = parse(code, {
  sourceType: "module",
  plugins: [
    "jsx",
    "typescript",
    "classProperties",
    "decorators-legacy",
    "objectRestSpread",
    "optionalChaining",
    "nullishCoalescingOperator",
    "dynamicImport"
  ],
  ranges: true,
  locations: true,
});

fs.writeFileSync(outputPath, JSON.stringify(ast, null, 2));
console.log(`✔ AST generated: ${outputPath}`);
