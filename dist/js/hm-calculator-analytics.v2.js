/* HealingMart Calculator Analytics v2.1.0
 * Calculator input values and raw calculation results are never accepted.
 */
(function (w, d) {
  "use strict";
  var EVENTS = [
    "calculator_open", "calculator_execute", "calculator_complete", "calculator_share",
    "calculator_result_copy", "calculator_search", "calculator_search_result_click",
    "calculator_search_no_result"
  ];
  var ALLOWED_KEYS = [
    "tool_id", "matched_tool_id", "category", "subcategory", "device_type",
    "result_count", "result_rank", "share_channel", "source"
  ];

  function deviceType() {
    var width = Math.max(d.documentElement.clientWidth || 0, w.innerWidth || 0);
    return width <= 767 ? "mobile" : width <= 1024 ? "tablet" : "desktop";
  }
  function cleanValue(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
    if (typeof value === "boolean") return value;
    if (value == null) return undefined;
    return String(value).slice(0, 120);
  }
  function track(eventName, metadata) {
    if (EVENTS.indexOf(eventName) === -1) return false;
    var payload = { event: eventName, device_type: deviceType() };
    metadata = metadata || {};
    ALLOWED_KEYS.forEach(function (key) {
      if (key === "device_type") return;
      var value = cleanValue(metadata[key]);
      if (value !== undefined) payload[key] = value;
    });
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(payload);
    try { d.dispatchEvent(new CustomEvent("hm:calculator-analytics", {detail:payload})); } catch (_) {}
    return true;
  }
  function toolMeta(calc) {
    return calc ? {tool_id:calc.id, category:calc.category, subcategory:calc.subcategory} : {};
  }

  w.HM_CALCULATOR_ANALYTICS = Object.freeze({
    events: Object.freeze(EVENTS.slice()),
    track: track,
    toolMeta: toolMeta,
    deviceType: deviceType
  });
})(window, document);
