// replace.js
// 文本替换功能

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function replaceText(node, translations, matcher) {
  if (!translations || typeof translations.forEach !== 'function') return;

  // Build-time instrumentation flag. When building with --stats 1, build.js sets
  // __I18N_STATS__ to '1' via esbuild define. When disabled, DCE removes branches.
  const STATS_ENABLED = typeof __I18N_STATS__ !== 'undefined' && __I18N_STATS__ === '1';

  // runtime stats holder (only when enabled)
  let __i18nStats = null;
  if (STATS_ENABLED && typeof window !== 'undefined') {
    __i18nStats = window.__rutracker_i18n_stats = window.__rutracker_i18n_stats || { runs: 0, last: null };
  }

  // Build matcher once (pattern + map) and pass it during recursion
  if (!matcher) {
    const entries = [];
    translations.forEach((value, key) => {
      if (typeof key === 'string' && key.length > 0) entries.push([key, value]);
    });

    // Sort by key length descending so longer phrases are matched first
    entries.sort((a, b) => b[0].length - a[0].length);

    const map = new Map(entries.map(([k, v]) => [k, v]));
    if (entries.length === 0) {
      matcher = null;
    } else {
      const alternation = entries.map(([k]) => escapeRegExp(k)).join('|');
      // global replacement; keys order in alternation is longest-first
      const pattern = new RegExp(alternation, 'g');
      matcher = { pattern, map };
    }
  }

  if (node.nodeType === Node.TEXT_NODE) {
    if (!matcher) return;
    if (STATS_ENABLED && __i18nStats && __i18nStats.last) __i18nStats.last.nodesScanned++;
    let text = node.nodeValue;
    const newText = text.replace(matcher.pattern, matched => {
      if (STATS_ENABLED && __i18nStats && __i18nStats.last) __i18nStats.last.replacements++;
      return matcher.map.get(matched) || matched;
    });
    if (newText !== text) {
      node.nodeValue = newText;
      if (STATS_ENABLED && __i18nStats && __i18nStats.last) __i18nStats.last.nodesReplaced++;
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
      return;
    }

    if (node instanceof HTMLInputElement) {
      if (node.placeholder) {
        const placeholder = node.placeholder.replace(matcher ? matcher.pattern : /$^/, m => (matcher ? matcher.map.get(m) || m : m));
        node.placeholder = placeholder;
      }

      if (node.value && (node.type === 'button' || node.type === 'submit' || node.type === 'reset')) {
        const currentValue = node.value.replace(matcher ? matcher.pattern : /$^/, m => (matcher ? matcher.map.get(m) || m : m));
        node.value = currentValue;
      }
    }

    if (node.title) {
      const title = node.title.replace(matcher ? matcher.pattern : /$^/, m => (matcher ? matcher.map.get(m) || m : m));
      node.title = title;
    }

    node.childNodes.forEach(childNode => {
      replaceText(childNode, translations, matcher);
    });

    // If this is the top-level caller (no parent element) we can finalize timing
    // However, since this function is recursive we rely on the outermost caller
    // in the application to set end/duration. Helper below can be called by caller.
  }
}

// Helper to start/stop instrumentation mapping for external callers
export function i18nStatsStart() {
  if (typeof __I18N_STATS__ !== 'undefined' && __I18N_STATS__ === '1' && typeof window !== 'undefined') {
    window.__rutracker_i18n_stats = window.__rutracker_i18n_stats || { runs: 0, last: null };
    const s = window.__rutracker_i18n_stats;
    s.runs++;
    s.last = { start: performance.now(), end: null, duration: null, nodesScanned: 0, nodesReplaced: 0, replacements: 0 };
    return s.last;
  }
  return null;
}

export function i18nStatsEnd() {
  if (typeof __I18N_STATS__ !== 'undefined' && __I18N_STATS__ === '1' && typeof window !== 'undefined') {
    const s = window.__rutracker_i18n_stats;
    if (s && s.last && s.last.start) {
      s.last.end = performance.now();
      s.last.duration = s.last.end - s.last.start;
      return s.last;
    }
  }
  return null;
}
