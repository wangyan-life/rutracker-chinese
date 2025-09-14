const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const headerPath = path.resolve(__dirname, 'rutracker-header.txt');
const outDir = path.resolve(__dirname, 'dist');
const outFile = path.join(outDir, 'rutracker-chinese.user.js');

const buildOptions = {
  entryPoints: [path.resolve(__dirname, 'src', 'index.js')],
  bundle: true,
  minify: false,
  sourcemap: false,
  platform: 'browser',
  target: ['es2019'],
  outfile: path.join(outDir, 'bundle.js')
};

const header = fs.existsSync(headerPath) ? fs.readFileSync(headerPath, 'utf8') : `// ==UserScript==\n// @name         Rutracker 中文化插件增强版\n// @namespace    https://github.com/wangyan-life\n// @match        https://rutracker.org/*\n// @match        https://rutracker.me/*\n// @version      1.5.0\n// @description  Rutracker 汉化插件，支持自定义翻译词条，可编辑和删除\n// @author       wangyan-life\n// @grant        GM_setValue\n// @grant        GM_getValue\n// @grant        GM_registerMenuCommand\n// @license      MIT\n// ==/UserScript==\n\n`;

async function build(watch) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  if (watch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('Watching for changes...');
    return;
  }

  await esbuild.build(buildOptions);

  // 拼接 header + bundle
  const bundle = fs.readFileSync(buildOptions.outfile, 'utf8');
  fs.writeFileSync(outFile, header + bundle, 'utf8');
  fs.unlinkSync(buildOptions.outfile);

  console.log(`Built userscript: ${outFile}`);
}

const args = process.argv.slice(2);
const watch = args.includes('--watch');
build(watch).catch(err => { console.error(err); process.exit(1); });
