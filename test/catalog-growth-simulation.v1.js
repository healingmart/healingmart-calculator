#!/usr/bin/env node
"use strict";

if (process.env.HM_SKIP_GROWTH_TEST === "1") {
  console.log(JSON.stringify({ skipped: true, reason: "nested growth simulation" }, null, 2));
  process.exit(0);
}

const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");
const cp = require("child_process");
const { kstDateString } = require("../scripts/registry-utils");

const root = path.resolve(__dirname, "..");
const sourceRegistry = JSON.parse(fs.readFileSync(path.join(root, "registry-v6.json"), "utf8"));
const basePublishedCount = sourceRegistry.calculators.filter(item => item.status === "published" && item.enabled !== false).length;
const baseVisibleCount = sourceRegistry.calculators.filter(item => item.status === "published" && item.enabled !== false && item.searchVisible !== false).length;
const tempParent = fs.mkdtempSync(path.join(os.tmpdir(), "hmcalc-growth-"));
const tempRoot = path.join(tempParent, "project");
const fixtureId = "catalog-growth-fixture-calculator";
const fixtureHandler = "catalog-growth-fixture";
const fixtureModule = "catalog-growth-fixture";
const today = kstDateString(new Date());

function copyFilter(source) {
  const relative = path.relative(root, source).replace(/\\/g, "/");
  if (!relative) return true;
  if (relative.startsWith("node_modules/")) return false;
  if (/^CHECKSUMS_SHA256_/.test(path.basename(source))) return false;
  return true;
}

try {
  fs.cpSync(root, tempRoot, { recursive: true, filter: copyFilter });
  const registryPath = path.join(tempRoot, "registry-v6.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  registry.calculators.push({
    id: fixtureId,
    legacyId: fixtureHandler,
    handlerId: fixtureHandler,
    type: "calculator",
    parentId: "calculator-hub",
    name: "카탈로그 성장 검증 계산기",
    shortName: "성장 검증",
    category: "life",
    subcategory: "daily",
    description: "계산기 수 증가 시 자동 카탈로그 생성을 검증하는 테스트 전용 계산기입니다.",
    aliases: ["성장 검증 계산기"],
    keywords: ["카탈로그 성장", "자동 등록"],
    route: fixtureId,
    status: "published",
    featured: false,
    featuredOrder: 9999,
    popular: false,
    addedAt: today,
    updatedAt: today,
    isNew: true,
    searchVisible: true,
    order: 999999,
    relatedIds: [],
    module: fixtureModule,
    categories: ["life"],
    enabled: true,
    published: true,
    content: { useCases: [], howItWorks: "", example: "", notes: [], faq: [] },
    legacyHref: "",
    bloggerUrl: "",
    bloggerReady: false
  });
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n");
  fs.writeFileSync(
    path.join(tempRoot, "dist/calculators", fixtureModule + ".min.js"),
    '(function(w){"use strict";w.HM_CALC.register("' + fixtureHandler + '",{mount:function(){return true;}});})(window);\n'
  );

  const run = cp.spawnSync("npm", ["test"], {
    cwd: tempRoot,
    encoding: "utf8",
    env: Object.assign({}, process.env, { HM_SKIP_GROWTH_TEST: "1" }),
    timeout: 120000
  });
  if (run.status !== 0) {
    throw new Error("421 growth npm test failed\n" + (run.stdout || "") + "\n" + (run.stderr || ""));
  }

  const sandbox = { window: {}, Object };
  vm.createContext(sandbox);
  const manifestPath = path.join(tempRoot, "dist/catalog/hm-calculators-manifest.v1.js");
  const catalogPath = path.join(tempRoot, "dist/catalog/hm-calculators-search.v1.js");
  vm.runInContext(fs.readFileSync(manifestPath, "utf8"), sandbox, { filename: manifestPath });
  vm.runInContext(fs.readFileSync(catalogPath, "utf8"), sandbox, { filename: catalogPath });
  const manifest = sandbox.window.HM_CALCULATOR_CATALOG_MANIFEST;
  const catalog = sandbox.window.HM_CALCULATOR_PUBLIC_CATALOG;
  const fixture = catalog.find(item => item.id === fixtureId);
  const results = [
    { name: "nested_npm_test_passed", ok: run.status === 0 },
    { name: "published_count_incremented", ok: manifest.publishedCount === basePublishedCount + 1, detail: `${manifest.publishedCount}/${basePublishedCount + 1}` },
    { name: "visible_count_incremented", ok: manifest.searchVisibleCount === baseVisibleCount + 1, detail: `${manifest.searchVisibleCount}/${baseVisibleCount + 1}` },
    { name: "catalog_item_added", ok: !!fixture },
    { name: "catalog_url_generated", ok: !!fixture && new URL(fixture.url).searchParams.get("tool") === fixtureId, detail: fixture && fixture.url },
    { name: "new_flag_derived", ok: !!fixture && fixture.isNew === true }
  ];
  const report = {
    version: sourceRegistry.version,
    basePublishedCount,
    simulatedPublishedCount: manifest.publishedCount,
    ok: results.every(item => item.ok),
    total: results.length,
    passed: results.filter(item => item.ok).length,
    failed: results.filter(item => !item.ok).length,
    results
  };
  fs.writeFileSync(path.join(root, `CATALOG_GROWTH_REPORT_v${sourceRegistry.version}.json`), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
} finally {
  fs.rmSync(tempParent, { recursive: true, force: true });
}
