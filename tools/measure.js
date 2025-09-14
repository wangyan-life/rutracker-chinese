#!/usr/bin/env node
/*
  tools/measure.js
  Usage: node tools/measure.js --url <url> [--runs N] [--waitSelector <sel>] [--stats]

  This script launches Puppeteer, opens the page, waits for load and optional selector,
  then reads window.__rutracker_i18n_stats. If not present, it will try to call a
  global function to start measurement (if your userscript exposes one).
*/

const puppeteer = require('puppeteer');
const argv = require('minimist')(process.argv.slice(2));

(async () => {
  const url = argv.url || argv.u;
  const runs = parseInt(argv.runs || argv.r || 5, 10);
  const waitSelector = argv.waitSelector || argv.w || null;
  const statsOn = argv.stats !== undefined; // if provided, we build with stats externally

  if (!url) {
    console.error('Usage: node tools/measure.js --url <url> [--runs N] [--waitSelector <sel>] [--stats]');
    process.exit(2);
  }

  const browser = await puppeteer.launch({ headless: true });
  const results = [];

  for (let i = 0; i < runs; i++) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 900 });
    // disable cache
    await page.setCacheEnabled(false);

    const startLoad = Date.now();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    const loadTime = Date.now() - startLoad;

    // If a local built userscript exists, inject it so instrumentation runs
    const fs = require('fs');
    const path = require('path');
    const localScript = path.resolve(__dirname, '..', 'dist', 'rutracker-chinese.user.js');
    if (fs.existsSync(localScript)) {
      const content = fs.readFileSync(localScript, 'utf8');
      // Inject via evaluate so script runs in page context
      await page.evaluate(content);
    }

    if (waitSelector) {
      try {
        await page.waitForSelector(waitSelector, { timeout: 15000 });
      } catch (e) { /* ignore */ }
    }

    // attempt to read stats, wait a short time if not yet present
    let stats = await page.evaluate(() => (window.__rutracker_i18n_stats) ? window.__rutracker_i18n_stats : null);
    if (!stats) {
      // give the page a short time to run replacement and report
      await page.waitForTimeout(500);
      stats = await page.evaluate(() => (window.__rutracker_i18n_stats) ? window.__rutracker_i18n_stats : null);
    }

    results.push({ run: i + 1, loadTime, stats });
    console.log(`[run ${i + 1}] loadTime=${loadTime}ms stats=${stats ? 'present' : 'absent'}`);

    await page.close();
  }

  await browser.close();

  // summarize
  const have = results.filter(r => r.stats && r.stats.last && typeof r.stats.last.duration === 'number');
  if (have.length > 0) {
    const durations = have.map(r => r.stats.last.duration);
    const avg = durations.reduce((a,b) => a+b, 0)/durations.length;
    console.log(`Measured ${have.length}/${results.length} runs with i18n stats. avg duration=${avg.toFixed(2)}ms`);
  } else {
    console.log('No measured durations found in results. Ensure instrumentation was enabled in build and userscript executed.');
  }

  console.log('Full results:\n', JSON.stringify(results, null, 2));
})();
