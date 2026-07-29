#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const version = pkg.version;
const expectedBase = "https://cdn.example.com/healingmart-calculator";
const explicitBase = expectedBase + "/";

function inspect(file, options) {
  const code = fs.readFileSync(path.join(root, file), "utf8");
  const appended = [];
  let domReady = null;

  const stage = { innerHTML: "" };
  const target = {
    dataset: {},
    querySelector(selector) {
      return selector === "[data-hm-calc-stage]" ? stage : null;
    }
  };

  const document = {
    currentScript: {
      dataset: options.hasExplicitBase ? { base: explicitBase } : {},
      src: options.src
    },
    title: "",
    readyState: "loading",
    head: {
      appendChild(node) {
        appended.push({ tagName: node.tagName, href: node.href || "", src: node.src || "" });
      }
    },
    body: { appendChild() {} },
    documentElement: { classList: { add() {}, remove() {} }, clientHeight: 800 },
    querySelector(selector) {
      if (selector === 'meta[name="description"]') return null;
      if (selector === "[data-hm-calc-app]") return target;
      return null;
    },
    getElementById() { return null; },
    createElement(tag) {
      return {
        tagName: String(tag).toUpperCase(),
        dataset: {},
        classList: { add() {}, remove() {}, contains() { return false; } },
        setAttribute() {},
        addEventListener() {}
      };
    },
    addEventListener(type, handler) {
      if (type === "DOMContentLoaded") domReady = handler;
    }
  };

  const window = {
    addEventListener() {},
    setTimeout() { return 0; },
    clearTimeout() {},
    requestAnimationFrame() { return 0; },
    location: { href: "https://www.healing-mart.com/p/calculator.html", search: "" },
    history: { pushState() {}, replaceState() {} },
    matchMedia() { return { matches: false }; },
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    innerHeight: 800,
    scrollTo() {}
  };

  const sandbox = {
    window,
    document,
    console: { info() {}, error() {} },
    URL,
    URLSearchParams,
    Object,
    Array,
    String,
    Number,
    Boolean,
    RegExp,
    Set,
    Map,
    Date,
    Math,
    JSON,
    Promise,
    Intl,
    parseFloat,
    parseInt,
    isFinite,
    Infinity,
    NaN,
    setTimeout,
    clearTimeout
  };

  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file, timeout: 2000 });
  if (typeof domReady !== "function") throw new Error(`${file}: DOMContentLoaded handler missing`);
  domReady();

  const css = appended.find(item => item.tagName === "LINK");
  const script = appended.find(item => item.tagName === "SCRIPT");
  return {
    file,
    cssHref: css && css.href,
    firstScriptSrc: script && script.src,
    appended
  };
}

const sourceFile = `dist/js/hm-calc-app.v${version}.js`;
const minFile = `dist/js/hm-calc-app.v${version}.min.js`;
const scriptSrc = `${expectedBase}/dist/js/hm-calc-app.v${version}.min.js?v=${version}`;

const sourceExplicit = inspect(sourceFile, { hasExplicitBase: true, src: scriptSrc });
const minExplicit = inspect(minFile, { hasExplicitBase: true, src: scriptSrc });
const sourceAuto = inspect(sourceFile, { hasExplicitBase: false, src: scriptSrc });
const minAuto = inspect(minFile, { hasExplicitBase: false, src: scriptSrc });

const expectedCss = `${expectedBase}/dist/css/hm-calc.v4.2.css?v=${version}`;
const expectedFirstScript = `${expectedBase}/dist/data/hm-calculator-categories.v2.js?v=${version}`;
const sourceCode = fs.readFileSync(path.join(root, sourceFile), "utf8");
const minCode = fs.readFileSync(path.join(root, minFile), "utf8");

const checks = {
  explicitSourceCssPath: sourceExplicit.cssHref === expectedCss,
  explicitMinCssPath: minExplicit.cssHref === expectedCss,
  explicitSourceMinParity: JSON.stringify(sourceExplicit.appended) === JSON.stringify(minExplicit.appended),
  automaticSourceCssPath: sourceAuto.cssHref === expectedCss,
  automaticSourceDataPath: sourceAuto.firstScriptSrc === expectedFirstScript,
  automaticMinCssPath: minAuto.cssHref === expectedCss,
  automaticMinDataPath: minAuto.firstScriptSrc === expectedFirstScript,
  automaticSourceMinParity: JSON.stringify(sourceAuto.appended) === JSON.stringify(minAuto.appended),
  sourceHasNoPreviousVersionPath: !/hm-calc-app\.v6\.1\.(?:0|1)/.test(sourceCode),
  minHasNoPreviousVersionPath: !/hm-calc-app\.v6\.1\.(?:0|1)/.test(minCode)
};

const report = {
  version,
  expectedBase,
  sourceExplicit,
  minExplicit,
  sourceAuto,
  minAuto,
  checks,
  passed: Object.values(checks).filter(Boolean).length,
  total: Object.keys(checks).length,
  ok: Object.values(checks).every(Boolean)
};

fs.writeFileSync(path.join(root, `BASE_PATH_REPORT_v${version}.json`), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.ok ? 0 : 1;
