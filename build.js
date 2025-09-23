const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const headerPath = path.resolve(__dirname, 'rutracker-header.txt');
const outDir = path.resolve(__dirname, 'dist');
const outFile = path.join(outDir, 'rutracker-chinese.user.js');
// also produce a single-file userscript at repo root for convenience
const rootOutFile = path.resolve(__dirname, 'rutracker-chinese.user.js');

const buildOptions = {
  entryPoints: [path.resolve(__dirname, 'src', 'index.js')],
  bundle: true,
  minify: false,
  sourcemap: false,
  platform: 'browser',
  target: ['es2019'],
  // Ensure output keeps UTF-8 characters (do not escape non-ASCII to \uXXXX)
  charset: 'utf8',
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

// parse CLI args: support --watch, --version <ver> or --version=<ver>, --bump <patch|minor|major> or --bump=<type>
const args = process.argv.slice(2);
const watch = args.includes('--watch');

function getArgValue(name) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === name && i + 1 < args.length) return args[i + 1];
    if (args[i].startsWith(name + '=')) return args[i].split('=')[1];
  }
  return null;
}

const versionArg = getArgValue('--version');
const bumpArg = getArgValue('--bump');
const statsArgRaw = getArgValue('--stats');
const statsFlag = statsArgRaw !== null ? statsArgRaw : (args.includes('--stats') ? '1' : null);

function bumpVersion(version, type) {
  const parts = version.split('.').map(n => parseInt(n, 10) || 0);
  while (parts.length < 3) parts.push(0);
  let [major, minor, patch] = parts;
  if (type === 'major') { major++; minor = 0; patch = 0; }
  else if (type === 'minor') { minor++; patch = 0; }
  else { patch++; }
  return [major, minor, patch].join('.');
}

async function buildWithVersion(watch) {
  // determine version from package.json and CLI
  const pkgPath = path.resolve(__dirname, 'package.json');
  let pkg = null;
  let version = null;
  if (fs.existsSync(pkgPath)) {
    try { pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')); } catch (e) { /* ignore */ }
    if (pkg && pkg.version) version = pkg.version;
  }

  if (versionArg) {
    version = versionArg;
  } else if (bumpArg && pkg && pkg.version) {
    version = bumpVersion(pkg.version, bumpArg);
    // update package.json with bumped version
    pkg.version = version;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log(`Bumped package.json version -> ${version}`);
  }

  // ensure outDir exists
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  if (watch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('Watching for changes...');
    return;
  }

  // Inject build-time define for instrumentation (dead-code elimination when disabled)
  buildOptions.define = buildOptions.define || {};
  // Use a short symbol to avoid referencing process.env at runtime
  buildOptions.define['__I18N_STATS__'] = JSON.stringify(statsFlag ? statsFlag : '0');

  await esbuild.build(buildOptions);

  // 拼接 header + bundle
  const bundle = fs.readFileSync(buildOptions.outfile, 'utf8');

  // read header from file if exists, otherwise use default header; then ensure @version is set
  let finalHeader = '';
  if (fs.existsSync(headerPath)) {
    finalHeader = fs.readFileSync(headerPath, 'utf8');
    if (version) {
      if (/@version\s+/m.test(finalHeader)) {
        finalHeader = finalHeader.replace(/(@version\s+)[^\r\n]*/m, `$1${version}`);
      } else {
        // add version line after first line of metadata
        finalHeader = finalHeader.replace(/(==\/UserScript==)/, `@version      ${version}\n$1`);
      }
    }
  } else {
    finalHeader = header.replace(/@version\s+\S+/, `@version      ${version || '1.0.0'}`);
  }

  fs.writeFileSync(outFile, finalHeader + bundle, 'utf8');
  // also mirror to repo root so single-file userscript is up-to-date
  try {
    fs.writeFileSync(rootOutFile, finalHeader + bundle, 'utf8');
    console.log(`Mirrored userscript to: ${rootOutFile}`);
  } catch (err) {
    console.warn(`Warning: failed to write root userscript: ${err.message}`);
  }
  fs.unlinkSync(buildOptions.outfile);

  console.log(`Built userscript: ${outFile}`);
}

buildWithVersion(watch).catch(err => { console.error(err); process.exit(1); });
