/* HealingMart Calculator Router v2.0.0 */
(function (w) {
  "use strict";

  function byId(id) {
    if (!id) return null;
    return (w.HM_CALCULATOR_BY_ID && w.HM_CALCULATOR_BY_ID[id]) ||
      (w.HM_CALCULATOR_BY_LEGACY_ID && w.HM_CALCULATOR_BY_LEGACY_ID[id]) ||
      (w.HM_CALCULATORS || []).find(function (c) { return c.route === id || c.id === id || c.legacyId === id; }) || null;
  }

  function categoryExists(id) {
    return !!(w.HM_CALCULATOR_CATEGORIES || []).find(function (c) { return c.id === id && c.enabled !== false; });
  }

  function current() {
    var params = new URLSearchParams(w.location.search);
    var rawTool = params.get("tool") || "";
    var legacyCalc = params.get("calc") || "";
    var calc = byId(rawTool || legacyCalc);
    var category = params.get("category") || "";
    if (calc) {
      return {
        view: "calculator",
        toolId: calc.id,
        calculator: calc,
        category: categoryExists(category) ? category : calc.category,
        migrated: !!legacyCalc || (!!rawTool && rawTool !== calc.id)
      };
    }
    if (categoryExists(category)) return { view: "category", category: category, toolId: "", calculator: null, migrated: false };
    return { view: "home", category: "", toolId: "", calculator: null, migrated: !!rawTool || !!legacyCalc };
  }

  function buildUrl(next, absolute) {
    next = next || {};
    var url = new URL(w.location.href);
    url.searchParams.delete("tool");
    url.searchParams.delete("calc");
    url.searchParams.delete("category");
    if (next.toolId) url.searchParams.set("tool", next.toolId);
    else if (next.category) url.searchParams.set("category", next.category);
    url.hash = "";
    return absolute ? url.href : url.pathname + (url.search || "");
  }

  function replaceCanonical(route) {
    route = route || current();
    var next = route.view === "calculator" ? {toolId: route.toolId} : route.view === "category" ? {category: route.category} : {};
    w.history.replaceState({hmCalc:true, toolId:route.toolId || "", category:route.category || ""}, "", buildUrl(next, false));
  }

  function push(next) {
    next = next || {};
    w.history.pushState({hmCalc:true, toolId:next.toolId || "", category:next.category || ""}, "", buildUrl(next, false));
  }

  w.HM_CALCULATOR_ROUTER = Object.freeze({
    byId: byId,
    current: current,
    buildUrl: buildUrl,
    href: function (next) { return buildUrl(next, true); },
    path: function (next) { return buildUrl(next, false); },
    push: push,
    replaceCanonical: replaceCanonical
  });
})(window);
