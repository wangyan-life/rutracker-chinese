import { init as initUI } from './ui.js';
import { getCombinedTranslations } from './storage.js';
import { replaceText } from './replace.js';

// 模块私有当前生效翻译
let rutrackerCurrentTranslations = new Map();

export function init() {
  console.log('Rutracker 中文化插件初始化...');

  rutrackerCurrentTranslations = getCombinedTranslations();
  console.log(`加载了 ${rutrackerCurrentTranslations.size} 个翻译词条`);

  // 初始化 UI（UI 模块会与 storage/replace 交互）
  initUI({
    getCustomTranslations: () => rutrackerCurrentTranslations,
    refreshTranslations: () => {
      rutrackerCurrentTranslations = getCombinedTranslations();
      replaceText(document.body, rutrackerCurrentTranslations);
    }
  });

  // 初始替换
  replaceText(document.body, rutrackerCurrentTranslations);

  // 监听DOM变化
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        replaceText(node, rutrackerCurrentTranslations);
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('Rutracker 中文化插件已启动');
}

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 500);
}
