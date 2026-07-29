"use strict";

const DEFAULT_BASE_URL = "https://healingmart.github.io/healingmart-calculator/";
const ALLOWED_STATUSES = Object.freeze([
  "published",
  "beta",
  "development",
  "maintenance",
  "hidden",
  "retired"
]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NEW_WINDOW_DAYS = 30;

function normalizeBaseUrl(value) {
  const text = String(value || DEFAULT_BASE_URL).trim();
  return (text.endsWith("/") ? text : text + "/");
}

function kstDateString(now) {
  const date = now instanceof Date ? now : new Date(now || Date.now());
  return new Date(date.getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

function kstTimestamp(now) {
  const date = now instanceof Date ? now : new Date(now || Date.now());
  return new Date(date.getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .replace("Z", "+09:00");
}

function parseDateOnly(value) {
  if (!DATE_RE.test(String(value || ""))) return null;
  const timestamp = Date.parse(String(value) + "T00:00:00+09:00");
  return Number.isFinite(timestamp) ? timestamp : null;
}

function resolveBuildNow() {
  const configured = process.env.HM_CATALOG_NOW;
  if (!configured) return new Date();
  const date = new Date(configured);
  if (Number.isNaN(date.getTime())) {
    throw new Error("HM_CATALOG_NOW must be a valid ISO date/time");
  }
  return date;
}

function deriveIsNew(calc, now) {
  if (!calc || calc.status !== "published" || !calc.addedAt) return false;
  const added = parseDateOnly(calc.addedAt);
  if (added === null) return false;
  const today = parseDateOnly(kstDateString(now || resolveBuildNow()));
  const diff = Math.floor((today - added) / 86400000);
  return diff >= 0 && diff < NEW_WINDOW_DAYS;
}

function isPublished(calc) {
  return !!calc && calc.status === "published" && calc.enabled !== false;
}

function isSearchVisible(calc) {
  return isPublished(calc) && calc.searchVisible !== false;
}

function normalizeInternalCalculator(calc, now) {
  return Object.assign({}, calc, {
    addedAt: calc.addedAt || null,
    searchVisible: calc.searchVisible !== false,
    isNew: deriveIsNew(calc, now)
  });
}

function toPublicCatalogItem(calc, baseUrl, now) {
  const urlBase = normalizeBaseUrl(baseUrl);
  return {
    id: calc.id,
    type: "calculator",
    name: calc.name,
    shortName: calc.shortName,
    category: calc.category,
    subcategory: calc.subcategory,
    description: calc.description,
    aliases: Array.isArray(calc.aliases) ? calc.aliases.slice() : [],
    keywords: Array.isArray(calc.keywords) ? calc.keywords.slice() : [],
    status: "published",
    searchVisible: true,
    featured: calc.featured === true,
    featuredOrder: Number.isFinite(calc.featuredOrder) ? calc.featuredOrder : 9999,
    popular: calc.popular === true,
    addedAt: calc.addedAt || null,
    updatedAt: calc.updatedAt,
    isNew: deriveIsNew(calc, now),
    order: Number.isFinite(calc.order) ? calc.order : 0,
    url: urlBase + "?tool=" + encodeURIComponent(calc.id)
  };
}

module.exports = {
  DEFAULT_BASE_URL,
  ALLOWED_STATUSES,
  DATE_RE,
  ID_RE,
  NEW_WINDOW_DAYS,
  normalizeBaseUrl,
  kstDateString,
  kstTimestamp,
  parseDateOnly,
  resolveBuildNow,
  deriveIsNew,
  isPublished,
  isSearchVisible,
  normalizeInternalCalculator,
  toPublicCatalogItem
};
