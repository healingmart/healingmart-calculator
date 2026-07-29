/* HealingMart Calculator Search v2.1.0 */
(function (w) {
  "use strict";

  var DEFAULT_SUGGESTIONS = ["디데이", "대출", "월급 실수령액", "BMI", "날짜 차이", "할인", "복리", "평수"];

  function normalize(value) {
    var text = String(value == null ? "" : value);
    try { text = text.normalize("NFKC"); } catch (_) {}
    text = text.toLowerCase().trim();
    text = text
      .replace(/d\s*[-_.·]?\s*day/gi, "디데이")
      .replace(/d\s*데이/gi, "디데이")
      .replace(/엔\s*빵/g, "n빵")
      .replace(/[’‘`´]/g, "'")
      .replace(/[·×→↔⇄()[\]{},./_:+%#@!?~\\|-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text;
  }

  function compact(value) {
    return normalize(value).replace(/\s+/g, "");
  }

  function categoryTitle(id) {
    var list = w.HM_CALCULATOR_CATEGORIES || [];
    var item = list.find(function (c) { return c.id === id; });
    return item ? (item.title || item.name || item.id) : id || "";
  }

  function subcategoryTitle(categoryId, subcategoryId) {
    var list = w.HM_CALCULATOR_CATEGORIES || [];
    var cat = list.find(function (c) { return c.id === categoryId; });
    var item = cat && (cat.subcategories || []).find(function (s) { return s.id === subcategoryId; });
    return item ? (item.title || item.id) : subcategoryId || "";
  }

  function fields(calc) {
    return {
      name: normalize(calc.name),
      nameCompact: compact(calc.name),
      shortName: normalize(calc.shortName),
      shortCompact: compact(calc.shortName),
      aliases: (calc.aliases || []).map(normalize),
      aliasesCompact: (calc.aliases || []).map(compact),
      keywords: (calc.keywords || []).map(normalize),
      keywordsCompact: (calc.keywords || []).map(compact),
      description: normalize(calc.description),
      category: normalize((calc.categories || [calc.category]).map(categoryTitle).join(" ")),
      categoryCompact: compact((calc.categories || [calc.category]).map(categoryTitle).join(" ")),
      subcategory: normalize(subcategoryTitle(calc.category, calc.subcategory)),
      subcategoryCompact: compact(subcategoryTitle(calc.category, calc.subcategory)),
      id: normalize(calc.id),
      legacyId: normalize(calc.legacyId)
    };
  }

  function scoreCalculator(calc, query) {
    var q = normalize(query);
    var qc = compact(query);
    if (!q) return null;
    var f = fields(calc);
    var score = 0;
    var matchedBy = [];
    var useCompact = qc.length >= 4 || /[가-힣]/.test(qc);

    function add(points, type) {
      if (points > score) score = points;
      if (matchedBy.indexOf(type) === -1) matchedBy.push(type);
    }
    function exact(value, valueCompact) { return value === q || (useCompact && valueCompact === qc); }
    function starts(value, valueCompact) { return value.indexOf(q) === 0 || (useCompact && valueCompact.indexOf(qc) === 0); }
    function contains(value, valueCompact) { return value.indexOf(q) !== -1 || (useCompact && valueCompact.indexOf(qc) !== -1); }

    if (exact(f.name, f.nameCompact)) add(1200, "name_exact");
    if (exact(f.shortName, f.shortCompact)) add(1120, "short_name_exact");
    if (f.aliases.some(function (v, i) { return exact(v, f.aliasesCompact[i]); })) add(1040, "alias_exact");
    if (starts(f.name, f.nameCompact)) add(900, "name_prefix");
    if (starts(f.shortName, f.shortCompact)) add(850, "short_name_prefix");
    if (f.aliases.some(function (v, i) { return starts(v, f.aliasesCompact[i]); })) add(780, "alias_prefix");
    if (f.keywords.some(function (v, i) { return exact(v, f.keywordsCompact[i]); })) add(720, "keyword_exact");
    if (contains(f.name, f.nameCompact)) add(650, "name_contains");
    if (contains(f.shortName, f.shortCompact)) add(620, "short_name_contains");
    if (f.aliases.some(function (v, i) { return contains(v, f.aliasesCompact[i]); })) add(570, "alias_contains");
    if (f.keywords.some(function (v, i) { return contains(v, f.keywordsCompact[i]); })) add(500, "keyword_contains");
    if (contains(f.description, compact(calc.description))) add(260, "description");
    if (contains(f.category, f.categoryCompact)) add(180, "category");
    if (contains(f.subcategory, f.subcategoryCompact)) add(190, "subcategory");
    if (exact(f.id, compact(calc.id)) || exact(f.legacyId, compact(calc.legacyId))) add(700, "id");

    var words = q.split(" ").filter(Boolean);
    if (words.length > 1) {
      var haystack = normalize([
        calc.name, calc.shortName, (calc.aliases || []).join(" "),
        (calc.keywords || []).join(" "), calc.description,
        categoryTitle(calc.category), subcategoryTitle(calc.category, calc.subcategory)
      ].join(" "));
      var all = words.every(function (word) { return haystack.indexOf(word) !== -1; });
      if (all) add(220 + words.length * 20, "all_tokens");
    }

    if (!score) return null;
    if (calc.featured) score += 8;
    return { calculator: calc, score: score, matchedBy: matchedBy };
  }

  function search(query, options) {
    options = options || {};
    var limit = Math.max(1, Math.min(Number(options.limit) || 20, 100));
    var category = options.category || "";
    var list = (w.HM_CALCULATORS || []).filter(function (calc) {
      return calc.status === "published" && calc.enabled !== false && (!category || calc.category === category || (calc.categories || []).indexOf(category) !== -1);
    });
    return list.map(function (calc) { return scoreCalculator(calc, query); })
      .filter(Boolean)
      .sort(function (a, b) {
        return b.score - a.score ||
          (a.calculator.featuredOrder || 9999) - (b.calculator.featuredOrder || 9999) ||
          (a.calculator.order || 0) - (b.calculator.order || 0) ||
          a.calculator.name.localeCompare(b.calculator.name, "ko");
      })
      .slice(0, limit);
  }

  function suggestions() { return DEFAULT_SUGGESTIONS.slice(); }

  w.HM_CALCULATOR_SEARCH = Object.freeze({
    normalize: normalize,
    compact: compact,
    search: search,
    score: scoreCalculator,
    suggestions: suggestions,
    categoryTitle: categoryTitle,
    subcategoryTitle: subcategoryTitle
  });
})(window);
