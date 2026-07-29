#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const registry = JSON.parse(fs.readFileSync(path.join(root, "registry-v6.json"), "utf8"));
const loaderFile = "dist/js/hm-calculator-catalog-loader.v1.js";
const manifestFile = "dist/catalog/hm-calculators-manifest.v1.js";
const catalogFile = "dist/catalog/hm-calculators-search.v1.js";
const loaderCode = fs.readFileSync(path.join(root, loaderFile), "utf8");
const manifestCode = fs.readFileSync(path.join(root, manifestFile), "utf8");
const catalogCode = fs.readFileSync(path.join(root, catalogFile), "utf8");

function createEnvironment(options) {
  options = options || {};
  const requests = [];
  const events = [];
  const listeners = Object.create(null);
  let failCatalogOnce = !!options.failCatalogOnce;
  let context;

  function dispatch(type, event) {
    events.push({ type, detail: event && event.detail });
    (listeners[type] || []).slice().forEach(handler => handler(event));
    return true;
  }

  const head = {
    appendChild(script) {
      script.parentNode = head;
      requests.push(script.src);
      Promise.resolve().then(() => {
        try {
          if (/hm-calculators-manifest\.v1\.js/.test(script.src)) {
            vm.runInContext(manifestCode, context, { filename: manifestFile, timeout: 2000 });
            if (typeof script.onload === "function") script.onload();
            return;
          }
          if (/hm-calculators-search\.v1\.js/.test(script.src)) {
            if (failCatalogOnce) {
              failCatalogOnce = false;
              if (typeof script.onerror === "function") script.onerror(new Error("simulated catalog failure"));
              return;
            }
            vm.runInContext(catalogCode, context, { filename: catalogFile, timeout: 5000 });
            if (typeof script.onload === "function") script.onload();
            return;
          }
          if (typeof script.onerror === "function") script.onerror(new Error("unexpected script"));
        } catch (error) {
          if (typeof script.onerror === "function") script.onerror(error);
        }
      });
      return script;
    },
    removeChild(script) {
      script.parentNode = null;
      return script;
    }
  };

  const document = {
    currentScript: {
      dataset: Object.assign(
        {},
        options.explicitBase ? { base: options.explicitBase } : {},
        options.autoload === false ? { autoload: "false" } : {}
      ),
      src: options.loaderSrc || "https://healingmart.github.io/healingmart-calculator/dist/js/hm-calculator-catalog-loader.v1.js"
    },
    head,
    documentElement: head,
    body: head,
    createElement(tag) {
      return {
        tagName: String(tag).toUpperCase(),
        async: false,
        src: "",
        onload: null,
        onerror: null,
        parentNode: null
      };
    },
    createEvent() {
      return {
        initCustomEvent(type, bubbles, cancelable, detail) {
          this.type = type;
          this.detail = detail;
          this.bubbles = bubbles;
          this.cancelable = cancelable;
        }
      };
    }
  };

  function CustomEvent(type, init) {
    this.type = type;
    this.detail = init && init.detail;
  }

  const window = {
    addEventListener(type, handler) {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(handler);
    },
    dispatchEvent(event) {
      return dispatch(event.type, event);
    }
  };

  const sandbox = {
    window,
    document,
    CustomEvent,
    URL,
    Promise,
    Date,
    Object,
    Array,
    String,
    Number,
    Boolean,
    RegExp,
    Error,
    encodeURIComponent,
    console: { error() {}, info() {} },
    setTimeout,
    clearTimeout
  };
  context = vm.createContext(sandbox);
  vm.runInContext(loaderCode, context, { filename: loaderFile, timeout: 3000 });
  return { window, document, requests, events, setFailCatalogOnce(value) { failCatalogOnce = !!value; } };
}

async function run() {
  const results = [];
  function check(name, ok, detail) {
    results.push({ name, ok: !!ok, detail: detail || "" });
    if (!ok) process.exitCode = 1;
  }

  const env = createEnvironment();
  const loader = env.window.HM_CALCULATOR_CATALOG_LOADER;
  const first = loader.load();
  const second = loader.load();
  check("loader_api_registered", !!loader && ["load","getManifest","getCatalog"].every(key => typeof loader[key] === "function"));
  check("duplicate_load_same_promise", first === second);
  const catalog = await first;
  const manifest = loader.getManifest();
  check("manifest_loaded", !!manifest && manifest.schemaVersion === 1);
  check("catalog_loaded", Array.isArray(catalog) && catalog === loader.getCatalog());
  check("single_manifest_request", env.requests.filter(url => /hm-calculators-manifest/.test(url)).length === 1, env.requests.join("\n"));
  check("single_catalog_request", env.requests.filter(url => /hm-calculators-search/.test(url)).length === 1, env.requests.join("\n"));
  check("manifest_cache_buster", env.requests.some(url => /hm-calculators-manifest[^?]*\?t=\d+/.test(url)), env.requests[0]);
  check("catalog_hash_query", env.requests.some(url => url.indexOf("?v=" + encodeURIComponent(manifest.catalogHash)) !== -1), env.requests[1]);
  check("global_manifest_registered", env.window.HM_CALCULATOR_CATALOG_MANIFEST === manifest);
  check("global_catalog_registered", env.window.HM_CALCULATOR_PUBLIC_CATALOG === catalog);
  const readyEvents = env.events.filter(event => event.type === "hm:calculator-catalog-ready");
  check("ready_event_once", readyEvents.length === 1, String(readyEvents.length));
  check("ready_event_payload", readyEvents[0] && readyEvents[0].detail.manifest === manifest && readyEvents[0].detail.catalog === catalog);


  const lazyEnv = createEnvironment({ autoload: false });
  const lazyLoader = lazyEnv.window.HM_CALCULATOR_CATALOG_LOADER;
  await Promise.resolve();
  check("autoload_false_no_initial_request", lazyEnv.requests.length === 0, lazyEnv.requests.join("\n"));
  check("autoload_false_api_registered", !!lazyLoader && typeof lazyLoader.load === "function");
  const lazyCatalog = await lazyLoader.load();
  check("autoload_false_manual_load", Array.isArray(lazyCatalog) && lazyCatalog.length === registry.calculators.filter(item => item.status === "published" && item.enabled !== false && item.searchVisible !== false).length, String(lazyCatalog && lazyCatalog.length));
  check("autoload_false_manual_request_once", lazyEnv.requests.filter(url => /hm-calculators-(?:manifest|search)/.test(url)).length === 2, lazyEnv.requests.join("\n"));

  const explicit = createEnvironment({ explicitBase: "https://cdn.example.com/hm-calculator" });
  await explicit.window.HM_CALCULATOR_CATALOG_LOADER.load();
  check("explicit_base_manifest_path", explicit.requests[0].indexOf("https://cdn.example.com/hm-calculator/dist/catalog/") === 0, explicit.requests[0]);

  const retryEnv = createEnvironment({ failCatalogOnce: true });
  const retryLoader = retryEnv.window.HM_CALCULATOR_CATALOG_LOADER;
  let firstError = null;
  try {
    await retryLoader.load();
  } catch (error) {
    firstError = error;
  }
  check("failure_returns_clear_error", firstError instanceof Error && /불러오지 못했습니다/.test(firstError.message), firstError && firstError.message);
  check("failure_clears_state", retryLoader.getManifest() === null && retryLoader.getCatalog() === null);
  const retriedCatalog = await retryLoader.load();
  check("retry_after_failure", Array.isArray(retriedCatalog) && retriedCatalog.length > 0, String(retriedCatalog && retriedCatalog.length));
  check("retry_reloads_manifest", retryEnv.requests.filter(url => /hm-calculators-manifest/.test(url)).length === 2, retryEnv.requests.join("\n"));
  check("error_event_emitted", retryEnv.events.some(event => event.type === "hm:calculator-catalog-error"));

  const report = {
    version: registry.version,
    ok: results.every(result => result.ok),
    total: results.length,
    passed: results.filter(result => result.ok).length,
    failed: results.filter(result => !result.ok).length,
    results
  };
  fs.writeFileSync(path.join(root, `CATALOG_LOADER_REPORT_v${registry.version}.json`), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
