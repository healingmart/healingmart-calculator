/* HealingMart Calculator Validator v2.2.0 */
(function (w) {
  "use strict";
  var ALLOWED_STATUS = ["published","beta","development","maintenance","hidden","retired"];
  var ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

  function validate(options) {
    options = options || {};
    var categories = w.HM_CALCULATOR_CATEGORIES || [];
    var calculators = w.HM_CALCULATORS || [];
    var handlers = w.HM_CALCULATOR_HANDLERS || {};
    var errors = [], warnings = [];
    var ids = Object.create(null), names = Object.create(null), legacyIds = Object.create(null);
    var categoryMap = Object.create(null), subcategoryMap = Object.create(null);

    categories.forEach(function (cat) {
      categoryMap[cat.id] = cat;
      subcategoryMap[cat.id] = Object.create(null);
      (cat.subcategories || []).forEach(function (sub) { subcategoryMap[cat.id][sub.id] = sub; });
    });

    calculators.forEach(function (calc, index) {
      var label = calc.id || "#" + index;
      if (!calc.id || !ID_RE.test(calc.id)) errors.push({type:"invalid_id", id:label});
      if (ids[calc.id]) errors.push({type:"duplicate_id", id:calc.id});
      ids[calc.id] = true;
      if (!calc.legacyId || legacyIds[calc.legacyId]) errors.push({type:calc.legacyId?"duplicate_legacy_id":"missing_legacy_id", id:label});
      legacyIds[calc.legacyId] = true;
      if (!calc.name) errors.push({type:"missing_name", id:label});
      else if (names[calc.name]) errors.push({type:"duplicate_name", id:label, name:calc.name});
      names[calc.name] = true;
      ["shortName","description","category","subcategory","route","status","updatedAt","module","handlerId"].forEach(function (field) {
        if (!calc[field]) errors.push({type:"missing_"+field, id:label});
      });
      if (!Array.isArray(calc.aliases) || !calc.aliases.length) warnings.push({type:"missing_aliases", id:label});
      if (!Array.isArray(calc.keywords) || !calc.keywords.length) errors.push({type:"missing_keywords", id:label});
      if (typeof calc.searchVisible !== "boolean") errors.push({type:"invalid_search_visible", id:label});
      if (typeof calc.featured !== "boolean") errors.push({type:"invalid_featured", id:label});
      if (typeof calc.popular !== "boolean") errors.push({type:"invalid_popular", id:label});
      if (!categoryMap[calc.category]) errors.push({type:"invalid_category", id:label, category:calc.category});
      else if (!subcategoryMap[calc.category][calc.subcategory]) errors.push({type:"invalid_subcategory", id:label, subcategory:calc.subcategory});
      if (ALLOWED_STATUS.indexOf(calc.status) === -1) errors.push({type:"invalid_status", id:label, status:calc.status});
      if (!DATE_RE.test(calc.updatedAt || "")) errors.push({type:"invalid_updated_at", id:label, date:calc.updatedAt});
      if (calc.addedAt != null && !DATE_RE.test(calc.addedAt || "")) errors.push({type:"invalid_added_at", id:label, date:calc.addedAt});
      (calc.relatedIds || []).forEach(function (relatedId) {
        if (!(w.HM_CALCULATOR_BY_ID && w.HM_CALCULATOR_BY_ID[relatedId])) errors.push({type:"invalid_related_id", id:label, relatedId:relatedId});
      });
      if (options.checkHandlers !== false && calc.status === "published" && typeof handlers[calc.id] !== "function") {
        errors.push({type:"missing_handler", id:label});
      }
    });

    var report = {
      version:"2.2.0",
      totalRegistered:calculators.length,
      published:calculators.filter(function(c){return c.status==="published";}).length,
      searchVisible:calculators.filter(function(c){return c.status==="published"&&c.searchVisible!==false;}).length,
      categories:categories.length,
      normal:Math.max(0,calculators.length-errors.filter(function(e){return e.id;}).length),
      errorCount:errors.length,
      warningCount:warnings.length,
      errors:errors,
      warnings:warnings,
      ok:errors.length===0
    };
    return report;
  }

  function log(report) {
    report = report || validate();
    var method = report.ok ? "info" : "error";
    if (w.console && console[method]) {
      console[method]("[HM Calculator Validator]", {
        total:report.totalRegistered, published:report.published, searchVisible:report.searchVisible,
        categories:report.categories, errors:report.errorCount, warnings:report.warningCount
      });
      if (report.errors.length) console.table(report.errors);
      if (report.warnings.length) console.table(report.warnings);
    }
    return report;
  }

  w.HM_CALCULATOR_VALIDATOR = Object.freeze({validate:validate, log:log});
})(window);
