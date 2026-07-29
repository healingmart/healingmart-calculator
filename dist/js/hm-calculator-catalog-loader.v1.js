/* HealingMart Calculator Public Catalog Loader v1.1.0 */
(function (w, d) {
  "use strict";

  var current = d.currentScript || null;
  var dataset = current && current.dataset ? current.dataset : {};
  var explicitBase = dataset.base || "";
  var scriptSrc = current && current.src ? current.src : "";
  var autoload = !/^(?:false|0|no|off)$/i.test(String(dataset.autoload || "").trim());

  if (w.HM_CALCULATOR_CATALOG_LOADER && typeof w.HM_CALCULATOR_CATALOG_LOADER.load === "function") {
    if (autoload) w.HM_CALCULATOR_CATALOG_LOADER.load().catch(function () {});
    return;
  }
  var baseUrl = resolveBase(explicitBase, scriptSrc);
  var loadingPromise = null;
  var loadedManifest = null;
  var loadedCatalog = null;

  function resolveBase(explicit, src) {
    var configured = String(explicit || "").trim();
    if (configured) return configured.replace(/\/$/, "") + "/";
    if (!src) return "";
    try {
      return new URL("../../", src).href.replace(/\/$/, "") + "/";
    } catch (_) {
      return String(src)
        .replace(/[?#].*$/, "")
        .replace(/\/dist\/js\/[^/]+$/, "")
        .replace(/\/$/, "") + "/";
    }
  }

  function appendQuery(url, key, value) {
    return url + (url.indexOf("?") === -1 ? "?" : "&") +
      encodeURIComponent(key) + "=" + encodeURIComponent(value);
  }

  function loadScript(url, globalName) {
    return new Promise(function (resolve, reject) {
      var script = d.createElement("script");
      var parent = d.head || d.documentElement || d.body;
      if (!parent) {
        reject(new Error("계산기 카탈로그 스크립트를 추가할 DOM 위치가 없습니다."));
        return;
      }
      script.async = true;
      script.src = url;
      script.onload = function () {
        var value = w[globalName];
        if (script.parentNode) script.parentNode.removeChild(script);
        if (value == null) {
          reject(new Error(globalName + " 전역 데이터가 등록되지 않았습니다."));
          return;
        }
        resolve(value);
      };
      script.onerror = function () {
        if (script.parentNode) script.parentNode.removeChild(script);
        reject(new Error("계산기 카탈로그 파일을 불러오지 못했습니다: " + url));
      };
      parent.appendChild(script);
    });
  }

  function emit(name, detail) {
    var event;
    try {
      event = new CustomEvent(name, { detail: detail });
    } catch (_) {
      if (!d.createEvent) return;
      event = d.createEvent("CustomEvent");
      event.initCustomEvent(name, false, false, detail);
    }
    w.dispatchEvent(event);
  }

  function validateManifest(manifest) {
    if (!manifest || manifest.schemaVersion !== 1) {
      throw new Error("지원하지 않는 계산기 카탈로그 매니페스트입니다.");
    }
    if (!/^[a-f0-9]{64}$/.test(String(manifest.catalogHash || ""))) {
      throw new Error("계산기 카탈로그 해시가 올바르지 않습니다.");
    }
    if (!manifest.catalogUrl) {
      throw new Error("계산기 카탈로그 주소가 없습니다.");
    }
    return manifest;
  }

  function performLoad() {
    if (!baseUrl) {
      return Promise.reject(new Error("계산기 카탈로그 기본 경로를 계산할 수 없습니다."));
    }

    var manifestUrl = appendQuery(
      baseUrl + "dist/catalog/hm-calculators-manifest.v1.js",
      "t",
      Date.now()
    );

    w.HM_CALCULATOR_CATALOG_MANIFEST = undefined;
    w.HM_CALCULATOR_PUBLIC_CATALOG = undefined;

    return loadScript(manifestUrl, "HM_CALCULATOR_CATALOG_MANIFEST")
      .then(validateManifest)
      .then(function (manifest) {
        loadedManifest = manifest;
        var catalogUrl = appendQuery(manifest.catalogUrl, "v", manifest.catalogHash);
        return loadScript(catalogUrl, "HM_CALCULATOR_PUBLIC_CATALOG");
      })
      .then(function (catalog) {
        if (!Array.isArray(catalog)) {
          throw new Error("계산기 공개 카탈로그가 배열이 아닙니다.");
        }
        if (catalog.length !== Number(loadedManifest.searchVisibleCount)) {
          throw new Error(
            "계산기 공개 카탈로그 개수가 매니페스트와 다릅니다: " +
            catalog.length + "/" + loadedManifest.searchVisibleCount
          );
        }
        loadedCatalog = catalog;
        emit("hm:calculator-catalog-ready", {
          manifest: loadedManifest,
          catalog: loadedCatalog
        });
        return loadedCatalog;
      });
  }

  function load() {
    if (loadingPromise) return loadingPromise;
    loadingPromise = performLoad().catch(function (error) {
      loadingPromise = null;
      loadedManifest = null;
      loadedCatalog = null;
      emit("hm:calculator-catalog-error", { error: error });
      throw error;
    });
    return loadingPromise;
  }

  var api = Object.freeze({
    load: load,
    getManifest: function () { return loadedManifest; },
    getCatalog: function () { return loadedCatalog; }
  });

  w.HM_CALCULATOR_CATALOG_LOADER = api;
  if (autoload) load().catch(function () {});
})(window, document);
