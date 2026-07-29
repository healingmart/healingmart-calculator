#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const {
  resolveBuildNow,
  isPublished,
  normalizeInternalCalculator
} = require("./registry-utils");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "registry-v6.json");
const registry = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const now = resolveBuildNow();
const banner = "/* GENERATED FILE. DO NOT EDIT. Source: registry-v6.json */\n";
const stable = value => JSON.stringify(value);
const categories = registry.categories || [];
const calculators = (registry.calculators || [])
  .filter(isPublished)
  .map(calc => normalizeInternalCalculator(calc, now));

const categoryJs = banner +
  '(function(w){"use strict";var data=' + stable(categories) +
  ';w.HM_CALCULATOR_CATEGORIES=Object.freeze(data.map(function(x){return Object.freeze(x);}));})(window);\n';

const calculatorJs = banner +
  '(function(w){"use strict";var data=' + stable(calculators) +
  ';var byId=Object.create(null),byLegacy=Object.create(null);data.forEach(function(c){Object.freeze(c.aliases);Object.freeze(c.keywords);Object.freeze(c.relatedIds);Object.freeze(c);byId[c.id]=c;if(c.legacyId)byLegacy[c.legacyId]=c;});w.HM_CALCULATORS=Object.freeze(data);w.HM_CALCULATOR_BY_ID=Object.freeze(byId);w.HM_CALCULATOR_BY_LEGACY_ID=Object.freeze(byLegacy);})(window);\n';

fs.mkdirSync(path.join(root, "dist/data"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/data/hm-calculator-categories.v2.js"), categoryJs);
fs.writeFileSync(path.join(root, "dist/data/hm-calculators-data.v2.js"), calculatorJs);

console.log(JSON.stringify({
  source: "registry-v6.json",
  version: registry.version,
  categories: categories.length,
  totalCalculators: (registry.calculators || []).length,
  publishedCalculators: calculators.length,
  generated: [
    "dist/data/hm-calculator-categories.v2.js",
    "dist/data/hm-calculators-data.v2.js"
  ]
}, null, 2));
