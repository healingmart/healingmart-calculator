#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const {
  isPublished,
  isSearchVisible,
  deriveIsNew
} = require("../scripts/registry-utils");

const root = path.resolve(__dirname, "..");
const registry = JSON.parse(fs.readFileSync(path.join(root, "registry-v6.json"), "utf8"));
const catalogFile = "dist/catalog/hm-calculators-search.v1.js";
const manifestFile = "dist/catalog/hm-calculators-manifest.v1.js";
const catalogCode = fs.readFileSync(path.join(root, catalogFile), "utf8");
const manifestCode = fs.readFileSync(path.join(root, manifestFile), "utf8");
const sandbox = { window: {}, Object };
vm.createContext(sandbox);
vm.runInContext(manifestCode, sandbox, { filename: manifestFile, timeout: 2000 });
vm.runInContext(catalogCode, sandbox, { filename: catalogFile, timeout: 5000 });

const manifest = sandbox.window.HM_CALCULATOR_CATALOG_MANIFEST;
const catalog = sandbox.window.HM_CALCULATOR_PUBLIC_CATALOG;
const all = registry.calculators || [];
const published = all.filter(isPublished);
const visible = all.filter(isSearchVisible);
const expectedIds = new Set(visible.map(item => item.id));
const actualHash = crypto.createHash("sha256").update(catalogCode).digest("hex");
const exactKeys = [
  "id", "type", "name", "shortName", "category", "subcategory",
  "description", "aliases", "keywords", "status", "searchVisible",
  "featured", "featuredOrder", "popular", "addedAt", "updatedAt",
  "isNew", "order", "url"
].sort();
const internalFields = [
  "handlerId", "legacyId", "module", "content", "faq", "FAQ",
  "legacyHref", "bloggerReady", "bloggerUrl", "parentId", "route",
  "categories", "enabled", "published", "relatedIds"
];

const projectManifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
function countJavaScriptFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((count, entry) => {
    const target = path.join(dir, entry.name);
    return count + (entry.isDirectory()
      ? countJavaScriptFiles(target)
      : (entry.isFile() && entry.name.endsWith(".js") ? 1 : 0));
  }, 0);
}
const actualJavaScriptFileCount = countJavaScriptFiles(root);

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: !!ok, detail: detail || "" });
  if (!ok) process.exitCode = 1;
}

check("catalog_generated", Array.isArray(catalog), typeof catalog);
check("manifest_generated", !!manifest && manifest.schemaVersion === 1, manifest && manifest.schemaVersion);
check("catalog_count_matches", catalog.length === manifest.searchVisibleCount, `${catalog.length}/${manifest.searchVisibleCount}`);
check("manifest_total_count", manifest.totalCount === all.length, `${manifest.totalCount}/${all.length}`);
check("manifest_published_count", manifest.publishedCount === published.length, `${manifest.publishedCount}/${published.length}`);
check("manifest_search_visible_count", manifest.searchVisibleCount === visible.length, `${manifest.searchVisibleCount}/${visible.length}`);
check("catalog_ids_match_registry", catalog.length === expectedIds.size && catalog.every(item => expectedIds.has(item.id)));
check("unique_catalog_ids", new Set(catalog.map(item => item.id)).size === catalog.length);
check("unique_catalog_urls", new Set(catalog.map(item => item.url)).size === catalog.length);
check("catalog_url_format", catalog.every(item => {
  try {
    const url = new URL(item.url);
    return url.searchParams.get("tool") === item.id && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id);
  } catch (_) { return false; }
}));
check("only_published_visible", catalog.every(item => item.status === "published" && item.searchVisible === true));
check("search_visible_false_excluded_by_rule", !isSearchVisible({ status: "published", enabled: true, searchVisible: false }));
check("nonpublished_excluded_by_rule", !isSearchVisible({ status: "maintenance", enabled: true, searchVisible: true }));
check("required_public_schema", catalog.every(item => JSON.stringify(Object.keys(item).sort()) === JSON.stringify(exactKeys)));
check("required_search_fields", catalog.every(item => item.name && item.shortName && item.category && item.subcategory && item.description && Array.isArray(item.aliases) && Array.isArray(item.keywords)));
check("internal_fields_excluded", catalog.every(item => internalFields.every(field => !Object.prototype.hasOwnProperty.call(item, field))));
check("catalog_hash_matches_file", manifest.catalogHash === actualHash, `${manifest.catalogHash}/${actualHash}`);
check("catalog_hash_format", /^[a-f0-9]{64}$/.test(manifest.catalogHash || ""));
check("catalog_url_matches_manifest", manifest.catalogUrl === manifest.baseUrl + "dist/catalog/hm-calculators-search.v1.js", manifest.catalogUrl);
const indexCode = fs.readFileSync(path.join(root, "index.html"), "utf8");
check("root_tool_url_supported", /p\.has\("tool"\)/.test(indexCode) && /location\.replace\("demo\.html"/.test(indexCode));
check("derived_is_new_matches", catalog.every(item => {
  const source = all.find(calc => calc.id === item.id);
  return item.isNew === deriveIsNew(source, new Date(manifest.generatedAt));
}));
check("catalog_frozen", Object.isFrozen(catalog) && catalog.every(item => Object.isFrozen(item) && Object.isFrozen(item.aliases) && Object.isFrozen(item.keywords)));
check("manifest_javascript_counts_match", projectManifest.javascriptFiles === actualJavaScriptFileCount && projectManifest.localChecks && projectManifest.localChecks.nodeSyntaxFiles === actualJavaScriptFileCount, `${projectManifest.javascriptFiles}/${projectManifest.localChecks && projectManifest.localChecks.nodeSyntaxFiles}/${actualJavaScriptFileCount}`);

const codeFiles = [
  "test/hm-calculator-structure-test.v2.1.0.js",
  "test/public-catalog-contract.v1.js",
  "test/catalog-loader-contract.v1.js",
  "scripts/build-public-catalog.js"
];
const legacyFixedCountToken = String(42 * 10);
const hardcodedCount = codeFiles.some(file => new RegExp("(?:===|!==|expected|count)[^\\n]{0,40}\\b" + legacyFixedCountToken + "\\b", "i").test(fs.readFileSync(path.join(root, file), "utf8")));
check("no_hardcoded_legacy_count", !hardcodedCount);

const report = {
  version: registry.version,
  schemaVersion: manifest && manifest.schemaVersion,
  totalCount: manifest && manifest.totalCount,
  publishedCount: manifest && manifest.publishedCount,
  searchVisibleCount: manifest && manifest.searchVisibleCount,
  catalogHash: manifest && manifest.catalogHash,
  ok: results.every(result => result.ok),
  total: results.length,
  passed: results.filter(result => result.ok).length,
  failed: results.filter(result => !result.ok).length,
  results
};
fs.writeFileSync(path.join(root, `PUBLIC_CATALOG_REPORT_v${registry.version}.json`), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
