// replace.js
// 文本替换功能

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function replaceText(node, translations) {
  if (!translations || typeof translations.forEach !== 'function') return;

  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.nodeValue;
    let replaced = false;

    translations.forEach((value, key) => {
      if (text.includes(key)) {
        text = text.replace(new RegExp(escapeRegExp(key), 'g'), value);
        replaced = true;
      }
    });

    if (replaced) {
      node.nodeValue = text;
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
      return;
    }

    if (node instanceof HTMLInputElement) {
      if (node.placeholder) {
        let placeholder = node.placeholder;
        translations.forEach((value, key) => {
          placeholder = placeholder.replace(new RegExp(escapeRegExp(key), 'g'), value);
        });
        node.placeholder = placeholder;
      }

      if (node.value && (node.type === 'button' || node.type === 'submit' || node.type === 'reset')) {
        let currentValue = node.value;
        translations.forEach((translated, original) => {
          currentValue = currentValue.replace(new RegExp(escapeRegExp(original), 'g'), translated);
        });
        node.value = currentValue;
      }
    }

    if (node.title) {
      let title = node.title;
      translations.forEach((value, key) => {
        title = title.replace(new RegExp(escapeRegExp(key), 'g'), value);
      });
      node.title = title;
    }

    node.childNodes.forEach(childNode => {
      replaceText(childNode, translations);
    });
  }
}
