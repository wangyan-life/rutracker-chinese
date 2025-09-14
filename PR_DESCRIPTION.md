Perf/Instrumentation PR

This PR contains the following changes (already on branch `perf/instrumentation`):

- Add build-time instrumentation support (`--stats`) in `build.js`.
- Instrument `src/replace.js` to collect simple runtime metrics when built with `--stats 1`.
- Add `tools/measure.js` (Puppeteer) to automate measurements and read `window.__rutracker_i18n_stats`.
- Add `build:stats` npm script and a GitHub Actions workflow `.github/workflows/measure.yml` to run measurements and upload `measure-results.json` as an artifact.

How to run locally (quick):

1. Build with instrumentation enabled:
```
node build.js --stats 1
```

2. Run the measurement script (example):
```
node tools/measure.js --url https://rutracker.org --runs 3 --out measure-results.json
```

Notes:
- Building with `--stats 1` is required so that `window.__rutracker_i18n_stats` is populated. Without it the measurement will see the stats object absent or empty.
- If you have local `npm ci` permission issues on Windows, run PowerShell as Administrator or set npm cache to a user-writable folder before running `npm ci` (see the repository README or the PR comments for commands).

Expected artifact:
- `measure-results.json` will be produced locally or uploaded by CI; it contains an array of run objects with `loadTime` and optional `stats` (when instrumentation is enabled).

Please review and run the steps above if you want to verify instrumentation.
