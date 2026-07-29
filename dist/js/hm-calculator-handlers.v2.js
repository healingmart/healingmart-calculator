/* HealingMart Calculator Handlers v2.0.0 */
(function (w, d) {
  "use strict";
  var config = {base:"", version:"6.1.2"};
  var loaded = Object.create(null);
  var publicHandlers = w.HM_CALCULATOR_HANDLERS || Object.create(null);

  function loadScript(url) {
    if (loaded[url]) return loaded[url];
    loaded[url] = new Promise(function (resolve, reject) {
      var script = d.createElement("script");
      script.src = url;
      script.onload = function () { resolve(script); };
      script.onerror = function () { reject(new Error("로드 실패: " + url)); };
      d.head.appendChild(script);
    });
    return loaded[url];
  }

  async function ensureBase() {
    var dist = config.base.replace(/\/$/, "") + "/dist";
    if (!w.HM_CALC || !w.HM_CALC.mount) await loadScript(dist + "/js/hm-calc-core.v1.min.js?v=" + config.version);
    if (!w.HM_CALC_SOUND) await loadScript(dist + "/js/hm-calc-sound.v1.min.js?v=" + config.version);
    if (!w.HM_CALC_SHARE) await loadScript(dist + "/js/hm-calc-share.v1.min.js?v=" + config.version);
  }

  function instrument(root, calc) {
    if (!root || root.dataset.hmAnalyticsBound === "true") return;
    root.dataset.hmAnalyticsBound = "true";
    var analytics = w.HM_CALCULATOR_ANALYTICS;
    var pendingComplete = false;
    var meta = analytics ? analytics.toolMeta(calc) : {};

    root.addEventListener("click", function (event) {
      var share = event.target.closest("[data-share]");
      if (share) {
        var channel = share.getAttribute("data-share") || "unknown";
        if (channel !== "more" && analytics) analytics.track("calculator_share", Object.assign({share_channel:channel}, meta));
        if (channel === "copy" && analytics) analytics.track("calculator_result_copy", Object.assign({source:"share_link"}, meta));
        return;
      }
      var copy = event.target.closest("[data-copy-result],[data-hm-copy-result]");
      if (copy && analytics) analytics.track("calculator_result_copy", meta);
      var button = event.target.closest("button");
      if (!button || button.disabled) return;
      var label = (button.textContent || "").trim();
      if (/초기화|지우기|닫기|공유|복사/.test(label)) return;
      if (button.classList.contains("hm-calc-btn") || button.closest(".hm-calc-actions")) {
        pendingComplete = true;
        if (analytics) analytics.track("calculator_execute", meta);
      }
    }, true);

    if (w.MutationObserver) {
      var observer = new MutationObserver(function () {
        if (!pendingComplete) return;
        var result = root.querySelector(".hm-calc-result:not([hidden]), .hm-calc-result-card:not([hidden])");
        if (result && result.textContent.trim()) {
          pendingComplete = false;
          if (analytics) analytics.track("calculator_complete", meta);
        }
      });
      observer.observe(root, {childList:true, subtree:true, attributes:true, attributeFilter:["hidden","class"]});
    }
  }

  async function mount(calc, root) {
    if (!calc || !root) throw new Error("계산기 또는 마운트 대상이 없습니다.");
    await ensureBase();
    var dist = config.base.replace(/\/$/, "") + "/dist";
    if (!w.HM_CALC.has(calc.handlerId)) {
      await loadScript(dist + "/calculators/" + encodeURIComponent(calc.module || calc.handlerId) + ".min.js?v=" + config.version);
    }
    w.HM_CALC.mount(root, calc.handlerId, {publicId:calc.id});
    if (w.HM_CALC_SOUND && w.HM_CALC_SOUND.mount) w.HM_CALC_SOUND.mount(root);
    if (w.HM_CALC_SHARE && w.HM_CALC_SHARE.mount) w.HM_CALC_SHARE.mount(root);
    instrument(root, calc);
    return root;
  }

  function registerAll(calculators) {
    (calculators || []).forEach(function (calc) {
      publicHandlers[calc.id] = function (root) { return mount(calc, root); };
    });
    return publicHandlers;
  }

  function configure(next) {
    next = next || {};
    if (next.base != null) config.base = String(next.base).replace(/\/$/, "");
    if (next.version) config.version = String(next.version);
    return Object.assign({}, config);
  }

  w.HM_CALCULATOR_HANDLERS = publicHandlers;
  w.HM_CALCULATOR_HANDLER_REGISTRY = Object.freeze({configure:configure, registerAll:registerAll, mount:mount});
})(window, document);
