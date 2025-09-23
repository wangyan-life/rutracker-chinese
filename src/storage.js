// storage.js
// 负责读取和保存自定义翻译（使用 GM_* API）

export function getCustomTranslations() {
  try {
    const custom = GM_getValue('customTranslations', '{}');
    return new Map(Object.entries(JSON.parse(custom)));
  } catch (e) {
    console.error('Error loading custom translations:', e);
    return new Map();
  }
}

export function saveCustomTranslations(translations) {
  try {
    const obj = Object.fromEntries(translations);
    GM_setValue('customTranslations', JSON.stringify(obj));
    return true;
  } catch (e) {
    console.error('Error saving custom translations:', e);
    return false;
  }
}

import { builtInI18n } from './builtInI18n.js';

export function getCombinedTranslations() {
  const combined = new Map([...builtInI18n]);
  const custom = getCustomTranslations();
  for (let [key, value] of custom) {
    combined.set(key, value);
  }
  return combined;
}

// Persisted translation enabled state (used by UI and build)
export function getTranslationEnabled() {
  try {
    return GM_getValue('translationEnabled', true);
  } catch (e) {
    return true;
  }
}

export function saveTranslationEnabled(enabled) {
  try {
    GM_setValue('translationEnabled', !!enabled);
    return true;
  } catch (e) {
    console.error('Error saving translation enabled state:', e);
    return false;
  }
}
