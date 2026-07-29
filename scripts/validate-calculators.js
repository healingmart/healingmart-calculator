#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const {
  ALLOWED_STATUSES,
  DATE_RE,
  ID_RE,
  parseDateOnly,
  resolveBuildNow,
  deriveIsNew,
  isPublished,
  normalizeInternalCalculator
} = require("./registry-utils");

const root = path.resolve(__dirname, "..");
const registry = JSON.parse(fs.readFileSync(path.join(root, "registry-v6.json"), "utf8"));
const categories = registry.categories || [];
const calculators = registry.calculators || [];
const now = resolveBuildNow();
const publishedCalculators = calculators.filter(isPublished);
const expectedGeneratedCalculators = publishedCalculators.map(calc => normalizeInternalCalculator(calc, now));
const errors = [];
const warnings = [];
const registrations = new Map();
const generatedSandbox = { window: {}, Object };

try {
  vm.runInNewContext(
    fs.readFileSync(path.join(root, "dist/data/hm-calculator-categories.v2.js"), "utf8"),
    generatedSandbox,
    { timeout: 1500 }
  );
  vm.runInNewContext(
    fs.readFileSync(path.join(root, "dist/data/hm-calculators-data.v2.js"), "utf8"),
    generatedSandbox,
    { timeout: 3000 }
  );
} catch (error) {
  errors.push({ type: "generated_data_execution_error", error: error.message });
}

const categoryMap = new Map(categories.map(category => [category.id, category]));
const idMap = new Map();
const legacyMap = new Map();
const nameMap = new Map();
const allowedStatus = new Set(ALLOWED_STATUSES);

function addMap(map, key, value) {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

for (const calc of calculators) {
  for (const alias of calc.aliases || []) {
    if (/계산기\s*계산기/.test(alias)) {
      errors.push({ type: "duplicate_calculator_word", id: calc.id, field: "alias", value: alias });
    }
  }
  for (const keyword of calc.keywords || []) {
    if (/계산기\s*계산기/.test(keyword)) {
      errors.push({ type: "duplicate_calculator_word", id: calc.id, field: "keyword", value: keyword });
    }
  }

  addMap(idMap, calc.id, calc);
  addMap(legacyMap, calc.legacyId, calc);
  addMap(nameMap, calc.name, calc);

  if (!ID_RE.test(calc.id || "")) errors.push({ type: "invalid_id", id: calc.id });
  for (const field of [
    "legacyId", "handlerId", "name", "shortName", "category", "subcategory",
    "description", "route", "status", "updatedAt", "module"
  ]) {
    if (calc[field] === undefined || calc[field] === null || calc[field] === "") {
      errors.push({ type: "missing_" + field, id: calc.id });
    }
  }

  if (!Number.isFinite(calc.order)) errors.push({ type: "missing_order", id: calc.id });
  if (!Array.isArray(calc.aliases) || !calc.aliases.length) warnings.push({ type: "missing_aliases", id: calc.id });
  if (!Array.isArray(calc.keywords) || !calc.keywords.length) errors.push({ type: "missing_keywords", id: calc.id });
  if (typeof calc.searchVisible !== "boolean") errors.push({ type: "invalid_search_visible", id: calc.id, value: calc.searchVisible });
  if (typeof calc.featured !== "boolean") errors.push({ type: "invalid_featured", id: calc.id, value: calc.featured });
  if (typeof calc.popular !== "boolean") errors.push({ type: "invalid_popular", id: calc.id, value: calc.popular });
  if (calc.enabled !== undefined && typeof calc.enabled !== "boolean") errors.push({ type: "invalid_enabled", id: calc.id, value: calc.enabled });

  const category = categoryMap.get(calc.category);
  if (!category) errors.push({ type: "invalid_category", id: calc.id, category: calc.category });
  else if (!(category.subcategories || []).some(sub => sub.id === calc.subcategory)) {
    errors.push({ type: "invalid_subcategory", id: calc.id, subcategory: calc.subcategory });
  }

  if (!allowedStatus.has(calc.status)) errors.push({ type: "invalid_status", id: calc.id, status: calc.status });
  if (!DATE_RE.test(calc.updatedAt || "") || parseDateOnly(calc.updatedAt) === null) {
    errors.push({ type: "invalid_updated_at", id: calc.id, date: calc.updatedAt });
  }
  if (calc.addedAt !== null && calc.addedAt !== undefined) {
    if (!DATE_RE.test(calc.addedAt || "") || parseDateOnly(calc.addedAt) === null) {
      errors.push({ type: "invalid_added_at", id: calc.id, date: calc.addedAt });
    } else if (parseDateOnly(calc.updatedAt) !== null && parseDateOnly(calc.updatedAt) < parseDateOnly(calc.addedAt)) {
      errors.push({ type: "updated_before_added", id: calc.id, addedAt: calc.addedAt, updatedAt: calc.updatedAt });
    }
  }

  const derivedNew = deriveIsNew(calc, now);
  if (calc.isNew !== undefined && typeof calc.isNew !== "boolean") {
    errors.push({ type: "invalid_is_new", id: calc.id, value: calc.isNew });
  } else if (calc.isNew !== undefined && calc.isNew !== derivedNew) {
    warnings.push({
      type: "source_is_new_overridden",
      id: calc.id,
      sourceValue: calc.isNew,
      generatedValue: derivedNew
    });
  }
}

for (const [key, items] of idMap) {
  if (items.length > 1) errors.push({ type: "duplicate_id", id: key, count: items.length });
}
for (const [key, items] of legacyMap) {
  if (items.length > 1) errors.push({ type: "duplicate_legacy_id", id: key, count: items.length });
}
for (const [key, items] of nameMap) {
  if (items.length > 1) errors.push({ type: "duplicate_name", name: key, count: items.length });
}
for (const calc of calculators) {
  for (const relatedId of calc.relatedIds || []) {
    if (!idMap.has(relatedId)) errors.push({ type: "invalid_related_id", id: calc.id, relatedId });
  }
}

const generatedCalcs = generatedSandbox.window.HM_CALCULATORS || [];
const generatedCats = generatedSandbox.window.HM_CALCULATOR_CATEGORIES || [];
if (JSON.stringify(generatedCalcs) !== JSON.stringify(expectedGeneratedCalculators)) {
  errors.push({ type: "generated_calculator_data_mismatch" });
}
if (JSON.stringify(generatedCats) !== JSON.stringify(categories)) {
  errors.push({ type: "generated_category_data_mismatch" });
}

const calcDir = path.join(root, "dist/calculators");
const files = fs.readdirSync(calcDir).filter(file => file.endsWith(".js")).sort();
for (const file of files) {
  const sandbox = {
    window: {
      HM_CALC: {
        register: (id, definition) => {
          if (!registrations.has(id)) registrations.set(id, []);
          registrations.get(id).push({ file, definition });
        }
      }
    },
    console, Intl, Date, Math, Number, String, Array, Object, JSON, RegExp,
    Set, Map, parseFloat, parseInt, isFinite, Infinity, NaN
  };
  try {
    vm.runInNewContext(fs.readFileSync(path.join(calcDir, file), "utf8"), sandbox, {
      filename: file,
      timeout: 1500
    });
  } catch (error) {
    errors.push({ type: "module_execution_error", file, error: error.message });
  }
}

const moduleFiles = new Set(files.map(file => file.replace(/\.min\.js$/, "")));
for (const calc of publishedCalculators) {
  if (!moduleFiles.has(calc.module)) errors.push({ type: "missing_module_file", id: calc.id, module: calc.module });
  if (!registrations.has(calc.handlerId)) {
    errors.push({ type: "missing_handler_registration", id: calc.id, handlerId: calc.handlerId, module: calc.module });
  }
}
for (const [handlerId, items] of registrations) {
  if (items.length > 1) {
    errors.push({ type: "duplicate_handler_registration", handlerId, files: items.map(item => item.file) });
  }
}
const expectedHandlers = new Set(publishedCalculators.map(calc => calc.handlerId));
for (const handlerId of registrations.keys()) {
  if (!expectedHandlers.has(handlerId)) warnings.push({ type: "orphan_handler_registration", handlerId });
}

const report = {
  version: registry.version,
  sourceOfTruth: "registry-v6.json",
  generatedDataMatches: !errors.some(error => /^generated_/.test(error.type)),
  totalRegistered: calculators.length,
  published: publishedCalculators.length,
  searchVisible: publishedCalculators.filter(calc => calc.searchVisible !== false).length,
  categories: categories.length,
  moduleFiles: files.length,
  registeredHandlers: registrations.size,
  expectedPublishedHandlers: expectedHandlers.size,
  errorCount: errors.length,
  warningCount: warnings.length,
  ok: errors.length === 0,
  errors,
  warnings
};

fs.writeFileSync(
  path.join(root, `VALIDATION_REPORT_v${registry.version}.json`),
  JSON.stringify(report, null, 2) + "\n"
);
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.ok ? 0 : 1;
