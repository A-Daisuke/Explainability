// parse_js/parse_dir.mjs
// usage: node parse_js/parse_dir.mjs <input_dir> <output_dir>

import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";

const inputDir = process.argv[2];
const outputDir = process.argv[3];

// 引数チェック
if (!inputDir || !outputDir) {
  console.error("Usage: node parse_js/parse_dir.mjs <input_dir> <output_dir>");
  process.exit(1);
}

// 出力フォルダ作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const validExt = [".js", ".jsx", ".ts", ".tsx"];
const files = fs.readdirSync(inputDir).filter(f =>
  validExt.includes(path.extname(f))
);

console.log(`📂 Found ${files.length} files in ${inputDir}`);

// BigIntをJSON化するための変換関数
const replacer = (key, value) => 
  typeof value === 'bigint' ? value.toString() + 'n' : value;

for (const file of files) {
  const inputFilePath = path.join(inputDir, file);
  // 出力ファイル名: output_dir/filename.json
  const outputFilePath = path.join(outputDir, `${file}.json`);

  console.log(`→ Parsing: ${file}`);

  try {
    const code = fs.readFileSync(inputFilePath, "utf8");

    const ast = parse(code, {
      sourceType: "module", // "unambiguous" でも可
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
      allowReturnOutsideFunction: true,  // ← 追加
      allowSuperOutsideMethod: true,     // ← 追加
      allowUndeclaredExports: true,      // ← 追加
      allowImportExportEverywhere: true, // ← 追加（モジュール構文への対応）
      errorRecovery: true,               // ← 追加（パースエラーでも続行）
    });

    // JSON書き出し
    fs.writeFileSync(outputFilePath, JSON.stringify(ast, replacer, 2));

  } catch (err) {
    console.error(`❌ Failed to parse ${file}: ${err.message}`);
    // エラーが出ても止まらず次のファイルへ
  }
}

console.log(`✔ Batch AST generation complete. Files saved to: ${outputDir}`);