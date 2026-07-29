#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const {
  DEFAULT_BASE_URL,
  normalizeBaseUrl,
  resolveBuildNow,
  kstTimestamp,
  isPublished,
  isSearchVisible,
  toPublicCatalogItem
} = require("./registry-utils");

const root = path.resolve(__dirname, "..");
const registryPath = path.join(root, "registry-v6.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const now = resolveBuildNow();
const baseUrl = normalizeBaseUrl(process.env.HM_CALCULATOR_BASE_URL || DEFAULT_BASE_URL);
const all = registry.calculators || [];
const published = all.filter(isPublished);
const visible = all.filter(isSearchVisible);
const catalog = visible.map(calc => toPublicCatalogItem(calc, baseUrl, now));
const catalogPath = path.join(root, "dist/catalog/hm-calculators-search.v1.js");
const manifestPath = path.join(root, "dist/catalog/hm-calculators-manifest.v1.js");
const banner = "/* GENERATED FILE. DO NOT EDIT. Source: registry-v6.json */\n";
const catalogJs = banner +
  '(function(w){"use strict";var data=' + JSON.stringify(catalog) +
  ';data.forEach(function(item){Object.freeze(item.aliases);Object.freeze(item.keywords);Object.freeze(item);});w.HM_CALCULATOR_PUBLIC_CATALOG=Object.freeze(data);})(window);\n';
const catalogHash = crypto.createHash("sha256").update(catalogJs).digest("hex");
const moduleCount = fs.readdirSync(path.join(root, "dist/calculators")).filter(file => file.endsWith(".js")).length;
const javascriptFileCount = (function countJs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((count, entry) => {
    const target = path.join(dir, entry.name);
    return count + (entry.isDirectory() ? countJs(target) : (entry.isFile() && entry.name.endsWith(".js") ? 1 : 0));
  }, 0);
})(root);

const manifest = {
  schemaVersion: 1,
  appVersion: registry.version,
  generatedAt: kstTimestamp(now),
  totalCount: all.length,
  publishedCount: published.length,
  searchVisibleCount: visible.length,
  baseUrl,
  catalogUrl: baseUrl + "dist/catalog/hm-calculators-search.v1.js",
  catalogHash
};
const manifestJs = banner +
  '(function(w){"use strict";w.HM_CALCULATOR_CATALOG_MANIFEST=Object.freeze(' +
  JSON.stringify(manifest) + ');})(window);\n';

fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
fs.writeFileSync(catalogPath, catalogJs);
fs.writeFileSync(manifestPath, manifestJs);

function updateJson(file, updater) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) return;
  const data = JSON.parse(fs.readFileSync(target, "utf8"));
  updater(data);
  fs.writeFileSync(target, JSON.stringify(data, null, 2) + "\n");
}

updateJson("manifest.json", data => {
  data.calculators = all.length;
  data.published = published.length;
  data.handlers = published.length;
  data.modules = moduleCount;
  data.validator = "2.2.0";
  data.structureTests = 26;
  data.publicCatalogContractTests = 24;
  data.catalogLoaderContractTests = 22;
  data.catalogGrowthTests = 6;
  data.javascriptFiles = javascriptFileCount;
  if (data.localChecks) {
    data.localChecks.nodeSyntaxFiles = javascriptFileCount;
  }
  data.publicCatalog = "dist/catalog/hm-calculators-search.v1.js";
  data.publicCatalogManifest = "dist/catalog/hm-calculators-manifest.v1.js";
  data.searchVisible = visible.length;
  data.catalogHash = catalogHash;
});

updateJson("self-test-manifest.json", data => {
  data.expectedCategories = (registry.categories || []).length;
  data.expectedModules = moduleCount;
  data.expectedCalculators = published.length;
  data.expectedPublished = published.length;
  data.expectedHandlers = published.length;
  data.expectedStructureTests = 26;
  data.expectedJavaScriptFiles = javascriptFileCount;
  data.expectedPublicCatalogTests = 24;
  data.expectedCatalogLoaderTests = 22;
  data.expectedCatalogGrowthTests = 6;
  data.publicCatalogTest = "test/public-catalog-contract.v1.js";
  data.catalogLoaderTest = "test/catalog-loader-contract.v1.js";
  data.catalogLoader = "dist/js/hm-calculator-catalog-loader.v1.js";
});

console.log(JSON.stringify({
  source: "registry-v6.json",
  appVersion: registry.version,
  totalCount: all.length,
  publishedCount: published.length,
  searchVisibleCount: visible.length,
  catalogHash,
  generated: [
    "dist/catalog/hm-calculators-search.v1.js",
    "dist/catalog/hm-calculators-manifest.v1.js"
  ]
}, null, 2));
