#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const outputName = `CHECKSUMS_SHA256_v${pkg.version}.txt`;
const outputPath = path.join(root, outputName);
const ignored = new Set([outputName]);
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    const relative = path.relative(root, target).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      walk(target);
    } else if (entry.isFile() && !ignored.has(relative) && !relative.endsWith(".zip")) {
      files.push(relative);
    }
  }
}

walk(root);
files.sort();
const lines = files.map(relative => {
  const content = fs.readFileSync(path.join(root, relative));
  const hash = crypto.createHash("sha256").update(content).digest("hex");
  return `${hash}  ./${relative}`;
});
fs.writeFileSync(outputPath, lines.join("\n") + "\n");
console.log(JSON.stringify({ output: outputName, files: files.length }, null, 2));
