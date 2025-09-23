// ui.js
// 负责创建翻译面板 UI 与事件逻辑（包括导入预览/进度）

import { getCustomTranslations, saveCustomTranslations, getCombinedTranslations, getTranslationEnabled, saveTranslationEnabled } from './storage.js';
import { replaceText, escapeRegExp, restoreOriginals } from './replace.js';

export function init(options) {
  // options: { getCustomTranslations, refreshTranslations }
  const floatBtn = document.createElement('div');
  floatBtn.innerHTML = '✎';
  floatBtn.style.cssText = `position: fixed; top: 100px; right: 20px; width: 50px; height: 50px; background: #4a76a8; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; z-index: 9999; box-shadow: 0 2px 10px rgba(0,0,0,0.2); transition: all 0.3s ease;`;
  floatBtn.addEventListener('mouseenter', () => { floatBtn.style.transform = 'scale(1.1)'; floatBtn.style.background = '#3a6390'; });
  floatBtn.addEventListener('mouseleave', () => { floatBtn.style.transform = 'scale(1)'; floatBtn.style.background = '#4a76a8'; });

  const panel = document.createElement('div');
  panel.id = 'rutracker-translation-panel';
  panel.style.cssText = `position: fixed; top: 160px; right: 20px; width: 350px; background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); padding: 15px; z-index: 9998; display: none; font-family: Arial, sans-serif; max-height: 80vh; overflow-y: auto;`;

  panel.innerHTML = `
            <h3 style="margin-top: 0; color: #4a76a8; border-bottom: 1px solid #eee; padding-bottom: 10px;">添加自定义翻译</h3>
            <div style="display:flex; gap:8px; align-items:center; margin-bottom:10px;">
                <label style="font-size:13px; color:#333;">翻译:</label>
                <button id="toggle-translation-btn" style="background:#17a2b8; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer;">加载中...</button>
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">原文:</label>
                <input type="text" id="custom-translation-original" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">译文:</label>
                <input type="text" id="custom-translation-translated" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <button id="add-custom-translation" style="background: #4a76a8; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; width: 100%; font-weight: bold;">添加翻译</button>
            <div id="translation-feedback" style="margin-top: 10px; padding: 8px; border-radius: 4px; display: none;"></div>

            <hr style="margin: 15px 0;">

            <h4 style="margin-bottom: 10px; color: #4a76a8;">自定义翻译列表</h4>
            <div id="custom-translations-list" style="margin-bottom: 15px; max-height: 200px; overflow-y: auto; border: 1px solid #eee; padding: 10px; border-radius: 4px;">
                <p style="color: #999; margin: 0; text-align: center;">暂无自定义翻译</p>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="reset-custom-translations" style="background: #ff6b6b; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; flex: 1;">重置所有翻译</button>
                <button id="refresh-page" style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; flex: 1;">刷新页面</button>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button id="export-custom-translations" style="background: #17a2b8; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; flex: 1;">导出翻译</button>
                <button id="export-all-translations" style="background: #20c997; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; flex: 1;">导出全部（内置+自定义）</button>
                <button id="import-custom-translations-replace" style="background: #6c757d; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; flex: 1;">导入（替换）</button>
                <button id="import-custom-translations-merge" style="background: #007bff; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; flex: 1;">导入（合并）</button>
            </div>

            <div style="font-size: 13px; color: #666; margin-top: 15px;">
                <p><strong>提示:</strong> 添加、编辑、导入或删除翻译后会立即生效（无需刷新）。</p>
            </div>
        `;

  document.body.appendChild(floatBtn);
  document.body.appendChild(panel);

  let editingKey = null;

  floatBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = panel.style.display === 'block';
    panel.style.display = isVisible ? 'none' : 'block';

    if (!isVisible) {
      updateCustomTranslationsList();
      resetEditState();
  // sync toggle button label when opening panel
  syncToggleLabel();
    }
  });

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== floatBtn) {
      panel.style.display = 'none';
      resetEditState();
    }
  });

  panel.addEventListener('click', (e) => { e.stopPropagation(); });

  // Toggle button logic
  const toggleBtn = null;
  function syncToggleLabel() {
    try {
      const enabled = getTranslationEnabled();
      const btn = document.getElementById('toggle-translation-btn');
      if (!btn) return;
      btn.textContent = enabled ? '关闭翻译' : '显示翻译';
      btn.style.background = enabled ? '#dc3545' : '#17a2b8';
    } catch (e) { /* ignore */ }
  }

  document.addEventListener('DOMContentLoaded', syncToggleLabel);
  // Also call now in case DOMContentLoaded already fired
  setTimeout(syncToggleLabel, 0);

  document.getElementById('toggle-translation-btn').addEventListener('click', () => {
    const enabled = getTranslationEnabled();
    const next = !enabled;
    if (!saveTranslationEnabled(next)) {
      showFeedback('切换失败，请检查控制台。', 'error');
      return;
    }
    if (next) {
      // enable: apply translations immediately
      options.refreshTranslations();
      replaceText(document.body, getCombinedTranslations());
      showFeedback('已启用翻译。', 'success');
    } else {
      // disable: restore originals
      restoreOriginals();
      showFeedback('已恢复为原文显示。', 'success');
    }
    syncToggleLabel();
  });

  document.getElementById('add-custom-translation').addEventListener('click', () => {
    const original = document.getElementById('custom-translation-original').value.trim();
    const translated = document.getElementById('custom-translation-translated').value.trim();

    if (!original) { showFeedback('请输入原文', 'error'); return; }
    if (!translated) { showFeedback('请输入译文', 'error'); return; }

    const custom = getCustomTranslations();

    if (editingKey) {
      if (editingKey !== original) custom.delete(editingKey);
      custom.set(original, translated);

      if (saveCustomTranslations(custom)) {
        options.refreshTranslations();
        showFeedback('翻译已更新并已应用到当前页面。', 'success');
        editingKey = null;
      } else {
        showFeedback('更新失败，请检查控制台获取详细信息', 'error');
        return;
      }
    } else {
      custom.set(original, translated);
      if (saveCustomTranslations(custom)) {
        options.refreshTranslations();
        showFeedback('翻译已添加并已应用到当前页面。', 'success');
      } else {
        showFeedback('保存失败，请检查控制台获取详细信息', 'error');
        return;
      }
    }

    document.getElementById('custom-translation-original').value = '';
    document.getElementById('custom-translation-translated').value = '';
    document.getElementById('add-custom-translation').textContent = '添加翻译';
    updateCustomTranslationsList();
  });

  document.getElementById('reset-custom-translations').addEventListener('click', () => {
    if (confirm('确定要重置所有自定义翻译吗？此操作不可撤销。')) {
      if (saveCustomTranslations(new Map())) {
        options.refreshTranslations();
        replaceText(document.body, getCombinedTranslations());
        showFeedback('已重置所有自定义翻译并已应用到当前页面。', 'success');
        updateCustomTranslationsList();
        resetEditState();
      } else {
        showFeedback('重置失败，请检查控制台获取详细信息', 'error');
      }
    }
  });

  document.getElementById('refresh-page').addEventListener('click', () => { location.reload(); });

  const hiddenFileInput = document.createElement('input');
  hiddenFileInput.type = 'file';
  hiddenFileInput.accept = '.json,application/json';
  hiddenFileInput.style.display = 'none';
  document.body.appendChild(hiddenFileInput);

  // Import preview modal 创建（同之前版本）
  const importPreviewModal = document.createElement('div');
  importPreviewModal.id = 'import-preview-modal';
  importPreviewModal.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; max-width: 95%; background: white; border-radius: 8px; box-shadow: 0 8px 40px rgba(0,0,0,0.3); padding: 16px; z-index: 10000; display: none; max-height: 80vh; overflow: auto; font-family: Arial, sans-serif;`;

  importPreviewModal.innerHTML = `
            <h3 style="margin-top:0; color:#4a76a8;">导入预览</h3>
            <div id="import-preview-summary" style="font-size:13px; color:#333; margin-bottom:8px;"></div>
            <div style="display:flex; gap:10px;">
                <div style="flex:1;">
                    <h4 style="margin:6px 0; font-size:13px; color:#666;">将新增（示例）</h4>
                    <div id="import-preview-add" style="font-size:12px; color:#28a745; border:1px solid #eee; padding:8px; height:120px; overflow:auto;"></div>
                </div>
                <div style="flex:1;">
                    <h4 style="margin:6px 0; font-size:13px; color:#666;">将覆盖（示例）</h4>
                    <div id="import-preview-overwrite" style="font-size:12px; color:#dc3545; border:1px solid #eee; padding:8px; height:120px; overflow:auto;"></div>
                </div>
            </div>
            <div id="import-preview-progress" style="margin-top:10px; font-size:13px; color:#333; display:none;"></div>
            <div style="display:flex; gap:10px; margin-top:12px; justify-content:flex-end;">
                <button id="import-confirm-btn" style="background:#28a745; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">确认导入</button>
                <button id="import-cancel-btn" style="background:#6c757d; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">取消</button>
            </div>
        `;

  document.body.appendChild(importPreviewModal);

  // 参数
  const IMPORT_LARGE_THRESHOLD = 500;
  const IMPORT_CHUNK_SIZE = 200;

  function showImportPreview(parsedObj, mode) {
    const parsedMap = new Map(Object.entries(parsedObj));
    const current = getCustomTranslations();

    const toAdd = [];
    const toOverwrite = [];

    parsedMap.forEach((v, k) => {
      if (current.has(k)) {
        toOverwrite.push({ key: k, old: current.get(k), newVal: v });
      } else {
        toAdd.push({ key: k, newVal: v });
      }
    });

    let removedCount = 0;
    if (mode === 'replace') {
      current.forEach((v, k) => {
        if (!parsedMap.has(k)) removedCount++;
      });
    }

    const summaryEl = document.getElementById('import-preview-summary');
    summaryEl.innerHTML = `模式：<strong>${mode === 'replace' ? '替换' : '合并'}</strong>；导入条目：<strong>${parsedMap.size}</strong>；新增：<strong>${toAdd.length}</strong>；覆盖：<strong>${toOverwrite.length}</strong>` + (mode === 'replace' ? `；将被移除：<strong>${removedCount}</strong>` : '');

    const addEl = document.getElementById('import-preview-add');
    const overEl = document.getElementById('import-preview-overwrite');
    addEl.innerHTML = '';
    overEl.innerHTML = '';

    const SAMPLE_MAX = 20;
    toAdd.slice(0, SAMPLE_MAX).forEach(item => {
      addEl.innerHTML += `<div style="margin-bottom:6px; word-break:break-word;"><strong>${escapeHtml(item.key)}</strong> → ${escapeHtml(item.newVal)}</div>`;
    });
    if (toAdd.length > SAMPLE_MAX) addEl.innerHTML += `<div style="color:#666;">... (${toAdd.length - SAMPLE_MAX} more)</div>`;

    toOverwrite.slice(0, SAMPLE_MAX).forEach(item => {
      overEl.innerHTML += `<div style="margin-bottom:6px; word-break:break-word;"><strong>${escapeHtml(item.key)}</strong><div style="color:#999; font-size:12px;">旧：${escapeHtml(item.old)}</div><div style="color:#28a745; font-size:12px;">新：${escapeHtml(item.newVal)}</div></div>`;
    });
    if (toOverwrite.length > SAMPLE_MAX) overEl.innerHTML += `<div style="color:#666;">... (${toOverwrite.length - SAMPLE_MAX} more)</div>`;

    const progressEl = document.getElementById('import-preview-progress');
    if (parsedMap.size > IMPORT_LARGE_THRESHOLD) {
      progressEl.style.display = 'block';
      progressEl.innerHTML = `<strong style="color:#a00;">注意：</strong> 导入包含 <strong>${parsedMap.size}</strong> 条目，可能会导致页面卡顿。建议在导入前备份现有翻译。导入将以分块方式应用并显示进度。`;
    } else {
      progressEl.style.display = 'none';
    }

    importPreviewModal.style.display = 'block';

    const confirmBtn = document.getElementById('import-confirm-btn');
    const cancelBtn = document.getElementById('import-cancel-btn');

    function cleanup() { importPreviewModal.style.display = 'none'; confirmBtn.removeEventListener('click', onConfirm); cancelBtn.removeEventListener('click', onCancel); }

    function onConfirm() { cleanup(); applyImportWithProgress(parsedMap, mode); }
    function onCancel() { cleanup(); showFeedback('已取消导入。', 'error'); }

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
  }

  function applyImportWithProgress(parsedMap, mode) {
    const total = parsedMap.size;
    let processed = 0;
    const progressEl = document.getElementById('import-preview-progress');
    progressEl.style.display = 'block';
    progressEl.innerHTML = `正在准备导入：0 / ${total}`;

    if (mode === 'replace') {
      const newMap = new Map();
      const entries = Array.from(parsedMap.entries());

      function processChunk() {
        const chunk = entries.splice(0, IMPORT_CHUNK_SIZE);
        chunk.forEach(([k, v]) => { newMap.set(k, v); processed++; });
        progressEl.innerHTML = `正在构建新翻译：${processed} / ${total}`;
        if (entries.length > 0) { setTimeout(processChunk, 10); }
        else {
          if (saveCustomTranslations(newMap)) {
            options.refreshTranslations();
            replaceText(document.body, getCombinedTranslations());
            updateCustomTranslationsList();
            resetEditState();
            progressEl.innerHTML = `导入完成：${total} 条目已导入（替换模式）。`;
            showFeedback('导入成功（已替换）并已应用。', 'success');
            setTimeout(() => { progressEl.style.display = 'none'; }, 2000);
          } else { progressEl.innerHTML = '保存失败，请检查控制台。'; showFeedback('导入失败，保存错误。', 'error'); }
        }
      }

      processChunk();
    } else {
      const custom = getCustomTranslations();
      const entries = Array.from(parsedMap.entries());

      function processChunk() {
        const chunk = entries.splice(0, IMPORT_CHUNK_SIZE);
        chunk.forEach(([k, v]) => { custom.set(k, v); processed++; });
        progressEl.innerHTML = `正在合并：${processed} / ${total}`;
        if (entries.length > 0) { setTimeout(processChunk, 10); }
        else {
          if (saveCustomTranslations(custom)) {
            options.refreshTranslations();
            replaceText(document.body, getCombinedTranslations());
            updateCustomTranslationsList();
            resetEditState();
            progressEl.innerHTML = `导入完成：${total} 条目已合并。`;
            showFeedback('导入成功（已合并）并已应用。', 'success');
            setTimeout(() => { progressEl.style.display = 'none'; }, 2000);
          } else { progressEl.innerHTML = '保存失败，请检查控制台。'; showFeedback('导入失败，保存错误。', 'error'); }
        }
      }

      processChunk();
    }
  }

  function escapeHtml(s) { if (s === null || s === undefined) return ''; return String(s).replace(/[&<>\\"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // 导出/导入/更新按钮事件
  document.getElementById('export-custom-translations').addEventListener('click', () => {
    const custom = getCustomTranslations();
    const obj = Object.fromEntries(custom);
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'rutracker-custom-translations.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    showFeedback('已导出自定义翻译文件。', 'success');
  });

  document.getElementById('export-all-translations').addEventListener('click', () => {
    const merged = getCombinedTranslations();
    const obj = Object.fromEntries(merged);
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'rutracker-all-translations.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    showFeedback('已导出全部翻译（内置+自定义）。', 'success');
  });

  document.getElementById('import-custom-translations-replace').addEventListener('click', () => {
    hiddenFileInput.onchange = (e) => {
      const file = e.target.files && e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (evt) => {
        try { const parsed = JSON.parse(evt.target.result); if (typeof parsed !== 'object' || parsed === null) throw new Error('Invalid JSON'); showImportPreview(parsed, 'replace'); }
        catch (err) { console.error('导入错误:', err); showFeedback('导入失败：无效的 JSON 文件。', 'error'); }
      }; reader.readAsText(file); hiddenFileInput.value = '';
    };
    hiddenFileInput.click();
  });

  document.getElementById('import-custom-translations-merge').addEventListener('click', () => {
    hiddenFileInput.onchange = (e) => {
      const file = e.target.files && e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (evt) => {
        try { const parsed = JSON.parse(evt.target.result); if (typeof parsed !== 'object' || parsed === null) throw new Error('Invalid JSON'); showImportPreview(parsed, 'merge'); }
        catch (err) { console.error('导入错误:', err); showFeedback('导入失败：无效的 JSON 文件。', 'error'); }
      }; reader.readAsText(file); hiddenFileInput.value = '';
    };
    hiddenFileInput.click();
  });

  function showFeedback(message, type) {
    const feedback = document.getElementById('translation-feedback');
    feedback.textContent = message; feedback.style.display = 'block'; feedback.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da'; feedback.style.color = type === 'success' ? '#155724' : '#721c24'; feedback.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
    setTimeout(() => { feedback.style.display = 'none'; }, 3000);
  }

  function updateCustomTranslationsList() {
    const listContainer = document.getElementById('custom-translations-list');
    const custom = getCustomTranslations();
    if (custom.size === 0) { listContainer.innerHTML = '<p style="color: #999; margin: 0; text-align: center;">暂无自定义翻译</p>'; return; }
    let html = '<div style="font-size: 13px;">';
    custom.forEach((value, key) => {
      html += `\n                <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;">\n                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">\n                        <div style="flex: 1;">\n                            <div style="font-weight: bold; word-break: break-word;">${key}</div>\n                            <div style="color: #28a745; word-break: break-word;">→ ${value}</div>\n                        </div>\n                        <div style="display: flex; gap: 5px; margin-left: 10px;">\n                            <button class="edit-translation" data-key="${key}" data-value="${value}" style="background: #ffc107; color: #000; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;">编辑</button>\n                            <button class="delete-translation" data-key="${key}" style="background: #dc3545; color: white; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;">删除</button>\n                        </div>\n                    </div>\n                </div>`;
    });
    html += '</div>';
    listContainer.innerHTML = html;

    document.querySelectorAll('.edit-translation').forEach(button => {
      button.addEventListener('click', (e) => {
        const key = e.target.getAttribute('data-key');
        const value = e.target.getAttribute('data-value');
        document.getElementById('custom-translation-original').value = key;
        document.getElementById('custom-translation-translated').value = value;
        editingKey = key; document.getElementById('add-custom-translation').textContent = '更新翻译'; panel.scrollTop = 0;
      });
    });

    document.querySelectorAll('.delete-translation').forEach(button => {
      button.addEventListener('click', (e) => {
        const key = e.target.getAttribute('data-key');
        if (confirm(`确定要删除翻译 "${key}" 吗？`)) {
          const custom = getCustomTranslations(); custom.delete(key);
          if (saveCustomTranslations(custom)) { options.refreshTranslations(); replaceText(document.body, getCombinedTranslations()); showFeedback('翻译已删除并已应用到当前页面。', 'success'); updateCustomTranslationsList(); if (editingKey === key) resetEditState(); }
          else { showFeedback('删除失败，请检查控制台获取详细信息', 'error'); }
        }
      });
    });
  }

  function resetEditState() { editingKey = null; document.getElementById('add-custom-translation').textContent = '添加翻译'; document.getElementById('custom-translation-original').value = ''; document.getElementById('custom-translation-translated').value = ''; }
}
