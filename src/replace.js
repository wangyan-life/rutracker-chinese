// replace.js
// 文本替换功能

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Backup storage
// originalNodeMap: map from element/node object -> info (for quick restore while node exists)
const originalNodeMap = new Map();
// originalIdMap: map from generated id -> info (allows restoring when DOM was re-created
// by matching elements that carry the same data-rutracker-i18n-id attribute)
const originalIdMap = new Map();

let __rutracker_i18n_id_counter = 1;
function genI18nId() {
  return `rutracker-i18n-${__rutracker_i18n_id_counter++}`;
}

function setDataIdOnElement(el, id) {
  try { el.setAttribute('data-rutracker-i18n-id', id); } catch (e) { /* ignore */ }
}

function getDataIdFromElement(el) {
  try { return el.getAttribute && el.getAttribute('data-rutracker-i18n-id'); } catch (e) { return null; }
}

const ATTRS_TO_BACKUP = ['placeholder', 'value', 'title', 'aria-label', 'alt', 'aria-labelledby', 'aria-describedby'];

function captureAttrs(node, info) {
  if (!info.attrs) info.attrs = {};
  for (const a of ATTRS_TO_BACKUP) {
    try {
      // prefer getAttribute to capture exact string
      if (node.hasAttribute && node.hasAttribute(a) && typeof info.attrs[a] === 'undefined') {
        info.attrs[a] = node.getAttribute(a);
      }
    } catch (e) { /* ignore per-attr errors */ }
  }
}

export const DEFAULT_MAX_TRANSLATE_LENGTH = 80;

// replaceText(node, translations, matcher, options)
// options: { maxTranslateLength: number }
export function replaceText(node, translations, matcher, options) {
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

  const maxLen = options && typeof options.maxTranslateLength === 'number' ? options.maxTranslateLength : DEFAULT_MAX_TRANSLATE_LENGTH;

  if (node.nodeType === Node.TEXT_NODE) {
    if (!matcher) return;
    if (STATS_ENABLED && __i18nStats && __i18nStats.last) __i18nStats.last.nodesScanned++;
    let text = node.nodeValue;
    // skip translation for long strings to avoid partial in-line mixing of languages
    if (text && text.length > maxLen) return;
    const newText = text.replace(matcher.pattern, matched => {
      if (STATS_ENABLED && __i18nStats && __i18nStats.last) __i18nStats.last.replacements++;
      return matcher.map.get(matched) || matched;
    });
    if (newText !== text) {
      // Backup original text. Text nodes can't carry attributes, so we wrap the
      // original text node with a span that contains a data id and the translated text.
      const parent = node.parentNode;
      if (parent) {
        const id = genI18nId();
        const info = { type: 'text', original: text };
        originalIdMap.set(id, info);
        // create wrapper span
        const span = document.createElement('span');
        setDataIdOnElement(span, id);
        // store original text in a data attribute (encoded) to help restore after DOM rebuild
        try { span.setAttribute('data-rutracker-i18n-orig', encodeURIComponent(text)); } catch (e) { /* ignore */ }
        span.textContent = newText;
        // replace the text node with the span
        parent.replaceChild(span, node);
        // also keep a direct reference in originalNodeMap for quick restore while node exists
        originalNodeMap.set(span, info);
      } else {
        // fallback: mutate node directly and store backup by reference
        if (!originalNodeMap.has(node)) originalNodeMap.set(node, { nodeValue: text, attrs: {} });
        node.nodeValue = newText;
      }
      if (STATS_ENABLED && __i18nStats && __i18nStats.last) __i18nStats.last.nodesReplaced++;
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
      return;
    }

    if (node instanceof HTMLInputElement) {
      if (node.placeholder) {
        const placeholderRaw = node.placeholder;
        const id = getDataIdFromElement(node) || genI18nId();
        setDataIdOnElement(node, id);
        const info = originalNodeMap.get(node) || { type: 'element', attrs: {} };
        if (typeof info.attrs.placeholder === 'undefined') info.attrs.placeholder = node.placeholder;
        originalNodeMap.set(node, info);
        originalIdMap.set(id, info);
        // only replace if not too long
        if (!(placeholderRaw && placeholderRaw.length > maxLen)) {
          const placeholder = placeholderRaw.replace(matcher ? matcher.pattern : /$^/, m => (matcher ? matcher.map.get(m) || m : m));
          node.placeholder = placeholder;
        }
      }

      if (node.value && (node.type === 'button' || node.type === 'submit' || node.type === 'reset')) {
  const valueRaw = node.value;
  const id = getDataIdFromElement(node) || genI18nId();
  setDataIdOnElement(node, id);
  const info = originalNodeMap.get(node) || { type: 'element', attrs: {} };
  if (typeof info.attrs.value === 'undefined') info.attrs.value = node.value;
  captureAttrs(node, info);
  originalNodeMap.set(node, info);
  originalIdMap.set(id, info);
  // also store encoded attrs snapshot for robustness if DOM is serialized/recreated
  try { node.setAttribute('data-rutracker-i18n-orig', encodeURIComponent(JSON.stringify(info.attrs))); } catch (e) { }
  // only replace if not too long
  if (!(valueRaw && valueRaw.length > maxLen)) {
    const currentValue = valueRaw.replace(matcher ? matcher.pattern : /$^/, m => (matcher ? matcher.map.get(m) || m : m));
    node.value = currentValue;
  }
      }
    }

    if (node.title) {
      // skip translation for long titles
      const titleRaw = node.title;
      if (titleRaw && titleRaw.length > maxLen) {
        // still capture original attrs for potential restore
      } else {
        const title = titleRaw.replace(matcher ? matcher.pattern : /$^/, m => (matcher ? matcher.map.get(m) || m : m));
        const id = getDataIdFromElement(node) || genI18nId();
        setDataIdOnElement(node, id);
        const info = originalNodeMap.get(node) || { type: 'element', attrs: {} };
        if (typeof info.attrs.title === 'undefined') info.attrs.title = node.title;
        captureAttrs(node, info);
        originalNodeMap.set(node, info);
        originalIdMap.set(id, info);
        try { node.setAttribute('data-rutracker-i18n-orig', encodeURIComponent(JSON.stringify(info.attrs))); } catch (e) { }
        node.title = title;
      }
    }

    node.childNodes.forEach(childNode => {
      replaceText(childNode, translations, matcher, options);
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

// Build reverse map: translation -> original (keep longest original on collisions)
export function buildReverseMap(translations) {
  const rev = new Map();
  const entries = [];
  translations.forEach((v, k) => {
    if (v) entries.push([k, v]);
  });
  // sort by translated value length desc to prefer longer matches first
  entries.sort((a, b) => (b[1] ? b[1].length - (a[1] ? a[1].length : 0) : 0));
  for (const [orig, trans] of entries) {
    if (!trans) continue;
    if (!rev.has(trans) || orig.length > (rev.get(trans) || '').length) {
      rev.set(trans, orig);
    }
  }
  return rev;
}

// Restore backed-up originals to DOM. If a predicate function is provided it
// will be called with (node, info) and only nodes for which it returns true
// will be restored. By default all backed-up nodes are restored.
export function restoreOriginals(predicate) {
  try {
    // First, restore by matching elements that have data-rutracker-i18n-id
    if (typeof document !== 'undefined' && document.querySelectorAll) {
      const els = document.querySelectorAll('[data-rutracker-i18n-id]');
      els.forEach(el => {
        try {
          const id = getDataIdFromElement(el);
          if (!id) return;
              let info = originalIdMap.get(id);
              // If we don't have an entry, try to read a serialized backup from attribute
              if (!info) {
                try {
                  const raw = el.getAttribute && el.getAttribute('data-rutracker-i18n-orig');
                  if (raw) {
                    const decoded = decodeURIComponent(raw);
                    try {
                      const parsed = JSON.parse(decoded);
                      info = { type: 'element', attrs: parsed };
                    } catch (e) {
                      // decoded might be plain text original for text nodes
                      info = { type: 'text', original: decoded };
                    }
                  }
                } catch (e) { /* ignore attr decode errors */ }
                if (!info) return;
              }
          if (typeof predicate === 'function' && !predicate(el, info)) return;
          if (info.type === 'text') {
            // restore original text: replace element with a text node of original
            const txt = document.createTextNode(info.original);
            el.parentNode && el.parentNode.replaceChild(txt, el);
          } else if (info.type === 'element') {
            if (info.attrs) {
              if (typeof info.attrs.placeholder !== 'undefined') try { el.placeholder = info.attrs.placeholder; } catch (e) { }
              if (typeof info.attrs.value !== 'undefined') try { el.value = info.attrs.value; } catch (e) { }
              if (typeof info.attrs.title !== 'undefined') try { el.title = info.attrs.title; } catch (e) { }
            }
          }
          // cleanup
          originalIdMap.delete(id);
          originalNodeMap.delete(el);
          try { el.removeAttribute && el.removeAttribute('data-rutracker-i18n-id'); } catch (e) { }
        } catch (e) { /* ignore per-element errors */ }
      });
    }

    // Fallback: restore any direct node references still held in originalNodeMap
    for (const [node, info] of Array.from(originalNodeMap.entries())) {
      try {
        if (typeof predicate === 'function' && !predicate(node, info)) continue;
        if (node.nodeType === Node.TEXT_NODE) {
          if (info && typeof info.nodeValue !== 'undefined' && info.nodeValue !== null) node.nodeValue = info.nodeValue;
        } else {
          if (info && info.attrs) {
            if (typeof info.attrs.placeholder !== 'undefined') try { node.placeholder = info.attrs.placeholder; } catch (e) { }
            if (typeof info.attrs.value !== 'undefined') try { node.value = info.attrs.value; } catch (e) { }
            if (typeof info.attrs.title !== 'undefined') try { node.title = info.attrs.title; } catch (e) { }
          }
        }
      } catch (e) {
        // ignore individual restore errors
      }
      originalNodeMap.delete(node);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('restoreOriginals outer error', e);
  }
}
