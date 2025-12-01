// parse_js/parse_dir.js
// usage: node parse_js/parse_dir.js <input_dir> <output_dir>

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const [,, inputDir, outputDir] = process.argv;
if (!inputDir || !outputDir) {
  console.error("Usage: node parse_js/parse_dir.js <input_dir> <output_dir>");
  process.exit(1);
}

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const validExt = [".js", ".jsx", ".ts", ".tsx"];

const files = fs.readdirSync(inputDir).filter(f =>
  validExt.includes(path.extname(f))
);

console.log(`Found ${files.length} files in ${inputDir}`);

for (const file of files) {
  const inPath = path.join(inputDir, file);
  const outName = path.basename(file, path.extname(file)) + ".json";
  const outPath = path.join(outputDir, outName);

  console.log(`→ Parsing: ${file}`);
  execSync(
    `node ${path.join('parse_js','parse_file.js')} "${inPath}" "${outPath}"`,
    { stdio: "inherit" }
  );
}

console.log("✔ Batch AST generation complete.");
