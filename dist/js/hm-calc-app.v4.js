/* HealingMart Calculator Platform v4.0.0
 * Converter-style efficient directory layout for 180 calculators.
 * Blogger = user-facing shell, GitHub Pages = static assets.
 * Original work by Healing Mart.
 */
(function (w, d) {
  "use strict";

  var script = d.currentScript;
  var explicitBase = script && script.dataset ? (script.dataset.base || "") : "";
  var src = script && script.src ? script.src : "";
  var base = (explicitBase || src.replace(/\/dist\/js\/hm-calc-app\.v4(?:\.min)?\.js(?:\?.*)?$/, "")).replace(/\/$/, "");
  var dist = base + "/dist";
  var loadedScripts = Object.create(null);
  var originalTitle = d.title;
  var originalDescription = (d.querySelector('meta[name="description"]') || {}).content || "";
  var root = null;
  var stage = null;
  var appData = null;
  var sheet = null;
  var sheetPanel = null;
  var sheetTitle = null;
  var sheetBody = null;
  var bottomNavFrame = 0;
  var RECENT_KEY = "hmCalcRecentV4";

  function decodeEntities(value) {
    var text = String(value == null ? "" : value);
    var box = d.createElement("textarea");
    for (var i = 0; i < 4; i += 1) {
      box.innerHTML = text;
      var next = box.value;
      if (next === text) break;
      text = next;
    }
    return text;
  }

  function esc(value) {
    return decodeEntities(value).replace(/[&<>"']/g, function (ch) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch];
    });
  }

  function normalizeSearch(value) {
    return decodeEntities(value)
      .toLowerCase()
      .replace(/[·×→↔⇄()\[\],./_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function repairRenderedEntities(scope) {
    if (!scope || !d.createTreeWalker) return;
    var walker = d.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(function (n) {
      var next = decodeEntities(n.nodeValue);
      if (next !== n.nodeValue) n.nodeValue = next;
    });
  }

  function icon(id) {
    var paths = {
      life: '<path d="M5 4h14v16H5z"></path><path d="M8 8h8M8 12h3M13 12h3M8 16h3M13 16h3"></path>',
      finance: '<path d="M4 9h16M6 9V6l6-3 6 3v3M6 9v9M10 9v9M14 9v9M18 9v9M4 18h16v3H4z"></path>',
      health: '<path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z"></path><path d="M8.5 13h2l1-3 1.5 5 1-2h2"></path>',
      date: '<rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4M16 3v4M4 9h16M8 13h2M12 13h2M16 13h1"></path>',
      unit: '<path d="M4 7h16v10H4z"></path><path d="M7 7v4M10 7v2M13 7v4M16 7v2"></path>',
      math: '<path d="M5 6h6M8 3v6M14 5l5 5M19 5l-5 5M5 15h6M14 16h5"></path><circle cx="16.5" cy="13.5" r=".6"></circle><circle cx="16.5" cy="18.5" r=".6"></circle>',
      "payroll-tax": '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"></path><path d="M9 8h6M9 12h6M9 16h3"></path>',
      "real-estate": '<path d="M3 11l9-8 9 8"></path><path d="M5 10v10h14V10M9 20v-6h6v6"></path>',
      auto: '<path d="M5 16h14l-1-6-2-3H8L6 10l-1 6z"></path><path d="M4 16v3h3v-2h10v2h3v-3M7 13h2M15 13h2"></path>',
      education: '<path d="M4 5h7a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H4V5z"></path><path d="M20 5h-3a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h3V5z"></path>',
      food: '<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M16 3v18M16 3c3 2 4 5 4 8h-4"></path>',
      science: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"></path><path d="M8 15h8"></path>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (paths[id] || paths.life) + '</svg>';
  }

  function categoryCode(id) {
    return ({
      life:"LIFE", finance:"FIN", health:"HLTH", date:"DATE", unit:"UNIT", math:"MATH",
      "payroll-tax":"PAY", "real-estate":"HOME", auto:"AUTO", education:"EDU", food:"FOOD", science:"SCI"
    })[id] || "CALC";
  }

  function loadScript(url, attrs) {
    if (loadedScripts[url]) return loadedScripts[url];
    loadedScripts[url] = new Promise(function (resolve, reject) {
      var s = d.createElement("script");
      s.src = url;
      if (attrs) Object.keys(attrs).forEach(function (key) { s.setAttribute(key, attrs[key]); });
      s.onload = function () { resolve(s); };
      s.onerror = function () { reject(new Error("로드 실패: " + url)); };
      d.head.appendChild(s);
    });
    return loadedScripts[url];
  }

  function ensureCss() {
    if (d.getElementById("hm-calc-css-v4")) return;
    var link = d.createElement("link");
    link.id = "hm-calc-css-v4";
    link.rel = "stylesheet";
    link.href = dist + "/css/hm-calc.v4.css?v=4.0.0";
    d.head.appendChild(link);
  }

  async function ensureRegistry() {
    if (w.HM_CALC_INDEX) return w.HM_CALC_INDEX;
    await loadScript(dist + "/data/hm-calc-registry.v1.js?v=3.0.0");
    return w.HM_CALC_INDEX;
  }

  function getData() {
    var data = w.HM_CALC_INDEX || {categories:[], calculators:[]};
    var categories = (data.categories || [])
      .filter(function (c) { return c.enabled !== false; })
      .sort(function (a,b) { return (a.order || 0) - (b.order || 0); });
    var calculators = (data.calculators || [])
      .filter(function (c) { return c.enabled !== false && c.published === true; });
    return {version:data.version || "1", categories:categories, calculators:calculators};
  }

  function belongs(calc, categoryId) {
    var list = Array.isArray(calc.categories) ? calc.categories : [calc.category || calc.primaryCategory];
    return list.indexOf(categoryId) !== -1;
  }

  function categoryCalcs(categoryId) {
    return appData.calculators.filter(function (calc) { return belongs(calc, categoryId); });
  }

  function getCategory(id) {
    return appData.categories.find(function (cat) { return cat.id === id; }) || null;
  }

  function getCalculator(id) {
    return appData.calculators.find(function (calc) { return calc.id === id; }) || null;
  }

  function primaryCategory(calc) {
    return getCategory(calc.primaryCategory || calc.category || "life") || appData.categories[0];
  }

  function routePath(params) {
    var url = new URL(w.location.href);
    url.searchParams.delete("category");
    url.searchParams.delete("calc");
    if (params && params.category) url.searchParams.set("category", params.category);
    if (params && params.calc) url.searchParams.set("calc", params.calc);
    url.hash = "";
    return url.pathname + (url.search ? url.search : "");
  }

  function routeHref(params) {
    var url = new URL(w.location.href);
    url.searchParams.delete("category");
    url.searchParams.delete("calc");
    if (params && params.category) url.searchParams.set("category", params.category);
    if (params && params.calc) url.searchParams.set("calc", params.calc);
    url.hash = "";
    return url.href;
  }

  function currentRoute() {
    var p = new URLSearchParams(w.location.search);
    return {category:p.get("category") || "", calc:p.get("calc") || ""};
  }

  function validateRoute(route) {
    if (route.calc) {
      var calc = getCalculator(route.calc);
      if (calc) {
        var category = getCategory(route.category);
        if (!category || !belongs(calc, category.id)) category = primaryCategory(calc);
        return {view:"calculator", category:category.id, calc:calc.id};
      }
    }
    if (route.category && getCategory(route.category)) return {view:"category", category:route.category};
    return {view:"home"};
  }

  function setDocumentMeta(title, description) {
    d.title = title || originalTitle;
    var meta = d.querySelector('meta[name="description"]');
    if (meta && description) meta.content = description;
    else if (meta && originalDescription) meta.content = originalDescription;
  }

  function searchableText(calc) {
    return normalizeSearch([
      calc.name,
      calc.description,
      calc.id,
      (calc.keywords || []).join(" "),
      (primaryCategory(calc) || {}).name
    ].join(" "));
  }

  function findCalculators(term, limit) {
    var q = normalizeSearch(term);
    if (!q) return [];
    var words = q.split(" ").filter(Boolean);
    return appData.calculators
      .map(function (calc) {
        var hay = searchableText(calc);
        var score = 0;
        if (normalizeSearch(calc.name) === q) score += 100;
        if (normalizeSearch(calc.name).indexOf(q) === 0) score += 50;
        if (hay.indexOf(q) !== -1) score += 25;
        words.forEach(function (word) { if (hay.indexOf(word) !== -1) score += 8; });
        if (calc.popular) score += 3;
        return {calc:calc, score:score};
      })
      .filter(function (item) { return item.score > 0; })
      .sort(function (a,b) { return b.score - a.score || a.calc.name.localeCompare(b.calc.name, "ko"); })
      .slice(0, limit || 12)
      .map(function (item) { return item.calc; });
  }

  function getRecentIds() {
    try {
      var value = JSON.parse(w.localStorage.getItem(RECENT_KEY) || "[]");
      return Array.isArray(value) ? value.filter(Boolean).slice(0, 12) : [];
    } catch (_) { return []; }
  }

  function rememberCalculator(id) {
    try {
      var ids = getRecentIds().filter(function (item) { return item !== id; });
      ids.unshift(id);
      w.localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(0, 12)));
    } catch (_) {}
  }

  function recentCalculators() {
    return getRecentIds().map(getCalculator).filter(Boolean);
  }

  function calcCard(calc, className) {
    var cat = primaryCategory(calc);
    return '<a class="hm-c4-tool-card ' + (className || "") + ' is-' + esc(cat.id) + '" href="' + esc(routeHref({category:cat.id, calc:calc.id})) + '" data-hm-route="calculator" data-category-id="' + esc(cat.id) + '" data-calculator-id="' + esc(calc.id) + '">' +
      '<span class="hm-c4-tool-icon">' + icon(cat.id) + '</span>' +
      '<span class="hm-c4-tool-copy"><strong>' + esc(calc.name) + '</strong><small>' + esc(calc.description || "") + '</small></span>' +
      '<span class="hm-c4-tool-arrow" aria-hidden="true">→</span>' +
    '</a>';
  }

  function compactCard(calc) {
    var cat = primaryCategory(calc);
    return '<a class="hm-c4-popular-card is-' + esc(cat.id) + '" href="' + esc(routeHref({category:cat.id, calc:calc.id})) + '" data-hm-route="calculator" data-category-id="' + esc(cat.id) + '" data-calculator-id="' + esc(calc.id) + '">' +
      '<span class="hm-c4-popular-icon">' + icon(cat.id) + '</span>' +
      '<span><strong>' + esc(calc.name) + '</strong><small>' + esc(cat.name) + '</small></span>' +
      '<b aria-hidden="true">→</b>' +
    '</a>';
  }

  function categoryAccordion(cat) {
    var list = categoryCalcs(cat.id);
    var preview = list.slice(0, 8);
    return '<details class="hm-c4-acc is-' + esc(cat.id) + '" data-hm-category-details>' +
      '<summary class="hm-c4-acc-summary">' +
        '<span class="hm-c4-acc-code">' + esc(categoryCode(cat.id)) + '</span>' +
        '<span class="hm-c4-acc-copy"><strong>' + esc(cat.name) + '</strong><small>' + esc(cat.description || "") + '</small></span>' +
        '<span class="hm-c4-acc-count">' + list.length + '개</span>' +
        '<span class="hm-c4-acc-chevron" aria-hidden="true">⌄</span>' +
      '</summary>' +
      '<div class="hm-c4-acc-body">' +
        '<div class="hm-c4-acc-tools">' + preview.map(calcCard).join("") + '</div>' +
        '<div class="hm-c4-acc-actions"><a href="' + esc(routeHref({category:cat.id})) + '" data-hm-route="category" data-category-id="' + esc(cat.id) + '">' + esc(cat.name) + ' 계산기 ' + list.length + '개 전체보기 →</a></div>' +
      '</div>' +
    '</details>';
  }

  function searchResultsHtml(list, emptyText) {
    if (!list.length) return '<div class="hm-c4-empty">' + esc(emptyText || "검색 결과가 없습니다.") + '</div>';
    return '<div class="hm-c4-search-result-grid">' + list.map(calcCard).join("") + '</div>';
  }

  function bindHome(stageEl) {
    var input = stageEl.querySelector('[data-hm-home-search]');
    var results = stageEl.querySelector('[data-hm-home-results]');
    if (input && results) {
      input.addEventListener("input", function () {
        var q = input.value.trim();
        if (!q) {
          results.hidden = true;
          results.innerHTML = "";
          return;
        }
        var found = findCalculators(q, 12);
        results.hidden = false;
        results.innerHTML = '<div class="hm-c4-search-result-head"><strong>검색 결과</strong><span>' + found.length + '개</span></div>' + searchResultsHtml(found, "다른 계산 이름이나 키워드로 검색해 보세요.");
      });
    }

    var accordions = Array.prototype.slice.call(stageEl.querySelectorAll('[data-hm-category-details]'));
    accordions.forEach(function (details) {
      details.addEventListener("toggle", function () {
        if (!details.open) return;
        accordions.forEach(function (other) { if (other !== details) other.open = false; });
      });
    });
  }

  function renderHome() {
    setDocumentMeta(originalTitle, originalDescription);
    var popular = appData.calculators.filter(function (calc) { return calc.popular; }).slice(0, 8);
    var recent = recentCalculators().slice(0, 4);
    stage.innerHTML =
      '<div class="hm-c4-home">' +
        '<section class="hm-c4-hero">' +
          '<span class="hm-c4-eyebrow">HEALING MART CALCULATOR</span>' +
          '<h1>필요한 계산을<br><em>바로 찾아보세요</em></h1>' +
          '<p>생활·금융·건강·날짜·단위·수학 등 자주 쓰는 계산기를 한곳에서 빠르게 찾을 수 있습니다.</p>' +
          '<div class="hm-c4-search-box">' +
            '<span class="hm-c4-search-icon" aria-hidden="true">⌕</span>' +
            '<input type="search" data-hm-home-search placeholder="예: 퍼센트 · 대출 · BMI · 날짜 차이 · 평수" autocomplete="off">' +
            '<button type="button" data-hm-open-sheet="search">빠른찾기</button>' +
          '</div>' +
          '<div class="hm-c4-home-results" data-hm-home-results hidden></div>' +
          '<div class="hm-c4-guide"><span><b>1</b> 계산기 검색</span><span><b>2</b> 값 입력</span><span><b>3</b> 결과 확인</span></div>' +
        '</section>' +
        (recent.length ? '<section class="hm-c4-section hm-c4-recent-section"><div class="hm-c4-section-head"><div><h2>최근 사용한 계산기</h2><p>방금 사용한 계산기를 다시 열 수 있습니다.</p></div><button type="button" data-hm-open-sheet="recent">전체보기</button></div><div class="hm-c4-popular-grid">' + recent.map(compactCard).join("") + '</div></section>' : '') +
        '<section class="hm-c4-section"><div class="hm-c4-section-head"><div><h2>많이 사용하는 계산기</h2><p>자주 찾는 계산을 바로 시작하세요.</p></div></div><div class="hm-c4-popular-grid">' + popular.map(compactCard).join("") + '</div></section>' +
        '<section class="hm-c4-section" id="hmCalcCategories"><div class="hm-c4-section-head"><div><h2>계산 카테고리</h2><p>필요한 종류를 누르면 해당 카테고리만 펼쳐집니다.</p></div></div><div class="hm-c4-category-accordion">' + appData.categories.map(categoryAccordion).join("") + '</div></section>' +
      '</div>';
    repairRenderedEntities(stage);
    bindHome(stage);
  }

  function bindCategory(stageEl) {
    var input = stageEl.querySelector('[data-hm-category-search]');
    var cards = Array.prototype.slice.call(stageEl.querySelectorAll('[data-hm-category-card]'));
    var empty = stageEl.querySelector('[data-hm-category-empty]');
    if (!input) return;
    input.addEventListener("input", function () {
      var q = normalizeSearch(input.value);
      var shown = 0;
      cards.forEach(function (card) {
        var visible = !q || normalizeSearch(card.getAttribute("data-search") || "").indexOf(q) !== -1;
        card.hidden = !visible;
        if (visible) shown += 1;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  function renderCategory(categoryId) {
    var cat = getCategory(categoryId);
    if (!cat) return renderHome();
    var list = categoryCalcs(cat.id);
    var popular = list.filter(function (calc) { return calc.popular; }).slice(0, 4);
    if (popular.length < 4) {
      list.forEach(function (calc) {
        if (popular.length < 4 && popular.indexOf(calc) === -1) popular.push(calc);
      });
    }
    setDocumentMeta(cat.name + " 계산기 | 힐링편의점", cat.description || originalDescription);
    stage.innerHTML =
      '<div class="hm-c4-category-view is-' + esc(cat.id) + '">' +
        '<div class="hm-c4-toolbar"><a href="' + esc(routeHref({})) + '" data-hm-route="home">← 계산기 홈</a><button type="button" data-hm-open-sheet="categories">다른 카테고리</button></div>' +
        '<section class="hm-c4-category-intro">' +
          '<span class="hm-c4-category-intro-icon">' + icon(cat.id) + '</span>' +
          '<div><span class="hm-c4-category-overline">' + esc(categoryCode(cat.id)) + ' · ' + list.length + '개</span><h1>' + esc(cat.name) + ' 계산기</h1><p>' + esc(cat.description || "") + '</p></div>' +
        '</section>' +
        '<section class="hm-c4-section hm-c4-category-popular"><div class="hm-c4-section-head"><div><h2>먼저 많이 쓰는 계산기</h2><p>이 카테고리에서 자주 사용하는 계산입니다.</p></div></div><div class="hm-c4-popular-grid">' + popular.map(compactCard).join("") + '</div></section>' +
        '<section class="hm-c4-section"><div class="hm-c4-section-head hm-c4-list-head"><div><h2>' + esc(cat.name) + ' 전체 계산기</h2><p>총 ' + list.length + '개 계산기</p></div><input type="search" data-hm-category-search placeholder="' + esc(cat.name) + ' 계산기 검색"></div>' +
          '<div class="hm-c4-category-grid">' + list.map(function (calc) {
            return '<div data-hm-category-card data-search="' + esc(searchableText(calc)) + '">' + calcCard(calc) + '</div>';
          }).join("") + '</div><div class="hm-c4-empty" data-hm-category-empty hidden>검색 결과가 없습니다.</div>' +
        '</section>' +
      '</div>';
    repairRenderedEntities(stage);
    bindCategory(stage);
  }

  function contentHtml(calc) {
    var content = calc.content || {};
    var useCases = (content.useCases || []).map(function (v) { return '<li>' + esc(v) + '</li>'; }).join("");
    var notes = (content.notes || []).map(function (v) { return '<li>' + esc(v) + '</li>'; }).join("");
    var faq = (content.faq || []).map(function (v) { return '<details class="hm-seo-faq"><summary>' + esc(v.q) + '</summary><p>' + esc(v.a) + '</p></details>'; }).join("");
    var sections = "";
    if (useCases) sections += '<section><h2>이럴 때 사용해요</h2><ul>' + useCases + '</ul></section>';
    if (content.howItWorks) sections += '<section><h2>어떻게 계산하나요?</h2><p>' + esc(content.howItWorks) + '</p></section>';
    if (content.example) sections += '<section><h2>사용 예시</h2><p>' + esc(content.example) + '</p></section>';
    if (notes) sections += '<section><h2>알아두세요</h2><ul>' + notes + '</ul></section>';
    if (faq) sections += '<section><h2>자주 묻는 질문</h2>' + faq + '</section>';
    return sections ? '<article class="hm-seo-guide hm-c4-seo-guide">' + sections + '</article>' : "";
  }

  async function ensureCalculatorBase() {
    if (!w.HM_CALC || !w.HM_CALC.mount) await loadScript(dist + "/js/hm-calc-core.v1.min.js?v=3.0.0");
    if (!w.HM_CALC_SOUND) await loadScript(dist + "/js/hm-calc-sound.v1.min.js?v=3.0.0");
    if (!w.HM_CALC_SHARE) await loadScript(dist + "/js/hm-calc-share.v1.min.js?v=3.0.0");
  }

  async function mountCalculator(widget, calc) {
    try {
      await ensureCalculatorBase();
      if (!w.HM_CALC.has(calc.id)) await loadScript(dist + "/calculators/" + encodeURIComponent(calc.module || calc.id) + ".min.js?v=3.0.0");
      w.HM_CALC.mount(widget, calc.id);
      if (w.HM_CALC_SOUND && w.HM_CALC_SOUND.mount) w.HM_CALC_SOUND.mount(widget);
      if (w.HM_CALC_SHARE && w.HM_CALC_SHARE.mount) w.HM_CALC_SHARE.mount(widget);
    } catch (err) {
      widget.innerHTML = '<div class="hm-calc-error">계산기를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</div>';
      console.error(err);
    }
  }

  async function renderCalculator(calcId, categoryId) {
    var calc = getCalculator(calcId);
    if (!calc) return renderHome();
    var cat = getCategory(categoryId);
    if (!cat || !belongs(calc, cat.id)) cat = primaryCategory(calc);
    var related = categoryCalcs(cat.id).filter(function (item) { return item.id !== calc.id; }).slice(0, 4);
    setDocumentMeta(calc.name + " | 힐링편의점", calc.description || originalDescription);
    rememberCalculator(calc.id);

    stage.innerHTML =
      '<div class="hm-c4-detail is-' + esc(cat.id) + '">' +
        '<div class="hm-c4-toolbar"><a href="' + esc(routeHref({category:cat.id})) + '" data-hm-route="category" data-category-id="' + esc(cat.id) + '">← ' + esc(cat.name) + ' 계산기</a><a href="' + esc(routeHref({})) + '" data-hm-route="home">계산기 홈</a></div>' +
        '<header class="hm-c4-detail-heading">' +
          '<span class="hm-c4-detail-badge">' + icon(cat.id) + '<b>' + esc(cat.name) + '</b></span>' +
          '<h1>' + esc(calc.name) + '</h1>' +
          '<p>' + esc(calc.description || "") + '</p>' +
        '</header>' +
        '<section class="hm-c4-widget-shell"><div data-hm-calculator="' + esc(calc.id) + '"></div></section>' +
        contentHtml(calc) +
        (related.length ? '<section class="hm-c4-section hm-c4-related"><div class="hm-c4-section-head"><div><h2>같은 카테고리 계산기</h2><p>' + esc(cat.name) + '에서 함께 많이 찾는 계산입니다.</p></div><a href="' + esc(routeHref({category:cat.id})) + '" data-hm-route="category" data-category-id="' + esc(cat.id) + '">전체보기 →</a></div><div class="hm-c4-related-grid">' + related.map(compactCard).join("") + '</div></section>' : '') +
      '</div>';
    repairRenderedEntities(stage);
    var widget = stage.querySelector('[data-hm-calculator]');
    if (widget) await mountCalculator(widget, calc);
  }

  function fixedTopOffset() {
    var els = d.querySelectorAll('header,#header,.header,.header-wrapper,.header-outer,.site-header,.main-header,.navbar,.top-bar');
    var max = 0;
    for (var i = 0; i < els.length; i += 1) {
      var style = w.getComputedStyle(els[i]);
      var rect = els[i].getBoundingClientRect();
      if ((style.position === "fixed" || style.position === "sticky") && rect.height > 0 && rect.height < 180 && rect.top <= 4 && rect.bottom > 0) max = Math.max(max, rect.bottom);
    }
    return Math.max(0, Math.round(max));
  }

  function appTop() {
    return Math.max(0, Math.round(w.pageYOffset + stage.getBoundingClientRect().top - fixedTopOffset() - 2));
  }

  function jumpToApp(fixedTop) {
    var top = typeof fixedTop === "number" ? fixedTop : appTop();
    function run() { w.scrollTo({top:top, left:0, behavior:"auto"}); }
    run();
    w.requestAnimationFrame(run);
    w.setTimeout(run, 120);
  }

  async function renderApp(options) {
    options = options || {};
    var route = validateRoute(currentRoute());
    root.dataset.hmCalcView = route.view;
    if (route.view === "calculator") await renderCalculator(route.calc, route.category);
    else if (route.view === "category") renderCategory(route.category);
    else renderHome();
    updateBottomNavVisibility();
    if (options.scroll === true) jumpToApp(options.fixedTop);
  }

  async function navigate(next) {
    var top = appTop();
    w.scrollTo({top:top, left:0, behavior:"auto"});
    w.history.pushState({hmCalc:true}, "", routePath(next || {}));
    closeSheet();
    await renderApp({scroll:true, fixedTop:top});
  }

  function ensureSheet() {
    if (sheet) return sheet;
    sheet = d.querySelector('[data-hm-calc-sheet]');
    if (!sheet) {
      sheet = d.createElement("div");
      sheet.className = "hm-c4-sheet";
      sheet.hidden = true;
      sheet.setAttribute("data-hm-calc-sheet", "");
      sheet.innerHTML = '<div class="hm-c4-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="hmCalcSheetTitle"><div class="hm-c4-sheet-handle" aria-hidden="true"></div><div class="hm-c4-sheet-head"><h2 id="hmCalcSheetTitle" data-hm-sheet-title>계산기 찾기</h2><button type="button" data-hm-sheet-close aria-label="닫기">×</button></div><div class="hm-c4-sheet-body" data-hm-sheet-body></div></div>';
      d.body.appendChild(sheet);
    }
    sheetPanel = sheet.querySelector('.hm-c4-sheet-panel');
    sheetTitle = sheet.querySelector('[data-hm-sheet-title]');
    sheetBody = sheet.querySelector('[data-hm-sheet-body]');
    sheet.addEventListener("click", function (event) {
      if (event.target === sheet || event.target.closest('[data-hm-sheet-close]')) closeSheet();
    });
    return sheet;
  }

  function openSheet(type) {
    ensureSheet();
    var html = "";
    if (type === "search") {
      sheetTitle.textContent = "빠른 계산기 찾기";
      html = '<label class="hm-c4-sheet-search"><span>계산기 검색</span><input type="search" data-hm-sheet-search placeholder="예: 복리 · 대출 · BMI · 날짜 차이 · 평수" autocomplete="off"></label><div class="hm-c4-sheet-results" data-hm-sheet-results><div class="hm-c4-sheet-guide">계산 이름이나 사용 목적을 입력하세요.</div></div>';
    } else if (type === "recent") {
      var recent = recentCalculators();
      sheetTitle.textContent = "최근 사용한 계산기";
      html = recent.length ? '<div class="hm-c4-sheet-list">' + recent.map(calcCard).join("") + '</div><button type="button" class="hm-c4-clear-recent" data-hm-clear-recent>최근 기록 지우기</button>' : '<div class="hm-c4-sheet-guide">아직 사용한 계산기가 없습니다.</div>';
    } else {
      sheetTitle.textContent = "계산 카테고리";
      html = '<div class="hm-c4-sheet-categories">' + appData.categories.map(function (cat) {
        return '<a href="' + esc(routeHref({category:cat.id})) + '" data-hm-route="category" data-category-id="' + esc(cat.id) + '" class="is-' + esc(cat.id) + '"><span>' + icon(cat.id) + '</span><strong>' + esc(cat.name) + '</strong><small>' + categoryCalcs(cat.id).length + '개</small></a>';
      }).join("") + '</div>';
    }
    sheetBody.innerHTML = html;
    sheet.hidden = false;
    d.documentElement.classList.add("hm-c4-sheet-open");
    w.requestAnimationFrame(function () { sheet.classList.add("is-open"); });

    var search = sheet.querySelector('[data-hm-sheet-search]');
    var results = sheet.querySelector('[data-hm-sheet-results]');
    if (search && results) {
      w.setTimeout(function () { search.focus(); }, 80);
      search.addEventListener("input", function () {
        var found = findCalculators(search.value, 16);
        results.innerHTML = search.value.trim() ? searchResultsHtml(found, "검색 결과가 없습니다.") : '<div class="hm-c4-sheet-guide">계산 이름이나 사용 목적을 입력하세요.</div>';
      });
    }
    var clear = sheet.querySelector('[data-hm-clear-recent]');
    if (clear) clear.addEventListener("click", function () {
      try { w.localStorage.removeItem(RECENT_KEY); } catch (_) {}
      openSheet("recent");
    });
  }

  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove("is-open");
    d.documentElement.classList.remove("hm-c4-sheet-open");
    w.setTimeout(function () { if (sheet && !sheet.classList.contains("is-open")) sheet.hidden = true; }, 180);
  }

  function bindGlobalControls() {
    d.addEventListener("click", function (event) {
      var open = event.target.closest('[data-hm-open-sheet]');
      if (open) {
        event.preventDefault();
        openSheet(open.getAttribute("data-hm-open-sheet") || "search");
        return;
      }

      var nav = event.target.closest('[data-hm-calc-nav]');
      if (nav) {
        event.preventDefault();
        var action = nav.getAttribute("data-hm-calc-nav");
        if (action === "home") navigate({});
        else openSheet(action);
        return;
      }

      var routeLink = event.target.closest('[data-hm-route]');
      if (!routeLink || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      var action = routeLink.getAttribute("data-hm-route");
      if (action === "home") navigate({});
      else if (action === "category") navigate({category:routeLink.getAttribute("data-category-id") || ""});
      else if (action === "calculator") navigate({category:routeLink.getAttribute("data-category-id") || "", calc:routeLink.getAttribute("data-calculator-id") || ""});
    });

    d.addEventListener("keydown", function (event) { if (event.key === "Escape") closeSheet(); });
  }

  function updateBottomNavVisibility() {
    bottomNavFrame = 0;
    var nav = d.querySelector('.hm-calc-bottom-nav');
    var boundary = d.querySelector('[data-hm-calc-bottom-boundary]');
    if (!root || !nav || !boundary) return;
    var appRect = root.getBoundingClientRect();
    var boundaryRect = boundary.getBoundingClientRect();
    var viewportHeight = w.innerHeight || d.documentElement.clientHeight || 0;
    var navHeight = Math.max(nav.getBoundingClientRect().height || 0, 58);
    var gap = w.matchMedia && w.matchMedia('(max-width:760px)').matches ? 8 : 12;
    var navTopLine = viewportHeight - navHeight - gap;
    var visible = appRect.top < navTopLine && boundaryRect.top > navTopLine;
    nav.classList.toggle('hm-bottom-nav-outside', !visible);
    nav.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }

  function requestBottomNavUpdate() {
    if (bottomNavFrame) return;
    bottomNavFrame = w.requestAnimationFrame(updateBottomNavVisibility);
  }

  function bindBottomBoundary() {
    w.addEventListener('scroll', requestBottomNavUpdate, {passive:true});
    w.addEventListener('resize', requestBottomNavUpdate);
    w.addEventListener('orientationchange', requestBottomNavUpdate);
    if ('ResizeObserver' in w) {
      var ro = new ResizeObserver(requestBottomNavUpdate);
      ro.observe(root);
      var nav = d.querySelector('.hm-calc-bottom-nav');
      if (nav) ro.observe(nav);
    }
    if ('MutationObserver' in w) {
      var mo = new MutationObserver(requestBottomNavUpdate);
      mo.observe(stage, {childList:true, subtree:true});
    }
    requestBottomNavUpdate();
    w.setTimeout(requestBottomNavUpdate, 120);
  }

  async function bootRoot(target) {
    if (target.dataset.hmCalcAppMounted === "true") return;
    target.dataset.hmCalcAppMounted = "true";
    root = target;
    stage = root.querySelector('[data-hm-calc-stage]') || root;
    ensureCss();
    stage.innerHTML = '<div class="hm-c4-loading" role="status"><span></span><strong>계산기를 불러오는 중입니다.</strong></div>';
    try {
      await ensureRegistry();
      appData = getData();
      bindGlobalControls();
      bindBottomBoundary();
      await renderApp({scroll:false});
    } catch (err) {
      stage.innerHTML = '<div class="hm-c4-load-error"><strong>계산기 데이터를 불러오지 못했습니다.</strong><span>잠시 후 새로고침해 주세요.</span></div>';
      console.error(err);
    }
  }

  async function boot() {
    var target = d.querySelector('[data-hm-calc-app]');
    if (target) await bootRoot(target);
  }

  w.addEventListener("popstate", function () {
    if (!root || !appData) return;
    closeSheet();
    renderApp({scroll:false});
  });

  w.HM_CALC_APP_V4 = {
    render:function () { return renderApp({scroll:false}); },
    search:findCalculators,
    routeHref:routeHref,
    openSheet:openSheet
  };

  try {
    console.info('%cHealing Mart%c Calculator Platform v4.0.0', 'color:#2563eb;font-size:14px;font-weight:900;', 'color:#172033;font-weight:700;');
  } catch (_) {}

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, {once:true});
  else boot();
})(window, document);
