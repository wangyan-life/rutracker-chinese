Perf / 埋点与测量 (PR 描述)

本次 PR 包含以下改动（已在分支 `perf/instrumentation` 中实现）：

- 在 `build.js` 中添加了构建级埋点开关（`--stats`），用于在构建时保留性能测量代码。
- 在 `src/replace.js` 中增加了简单的运行时埋点（收集替换耗时、扫描节点数、替换次数等），仅在带埋点构建时启用。
- 新增 `tools/measure.js`（基于 Puppeteer），用于自动化在目标页面上注入本地构建的 userscript 并读取 `window.__rutracker_i18n_stats`。
- 新增 `build:stats` 脚本并在 `.github/workflows/measure.yml` 中添加测量工作流，工作流会在 release 发布、手动触发或 push 到 `main` 时运行并上传 `measure-results.json`。

本 PR 的目标是：在不影响正常发布的前提下，提供可选的埋点能力和自动化测量流水线，以便评估 i18n 文本替换对页面性能的影响并作为性能回归检测的基础。

本地验证步骤（建议）：

1. 构建带埋点的 userscript：

```pwsh
node build.js --stats 1
# 或使用 npm 脚本
npm run build:stats
```

2. 运行测量脚本（示例，运行 3 次并输出结果）：

```pwsh
node tools/measure.js --url https://rutracker.org --runs 3 --out measure-results.json
```

3. 检查输出 `measure-results.json`，文件包含每次运行的 `loadTime` 和可选的 `stats`（当启用了埋点时）。

CI 行为说明：

- 工作流路径：`.github/workflows/measure.yml`。
- 触发条件：`workflow_dispatch`（手动）、`release: published`、以及 `push` 至 `main`。
- 输出 artifact 名称：`i18n-measure-results`（包含 `measure-results.json`）。

注意事项：

- 为防止生产构建污染，默认构建不会包含埋点。仅在需要测量时使用 `--stats 1` 构建。
- 本地运行 `npm ci` 可能在 Windows 上遇到权限或缓存路径问题；参考仓库 README 中的 Troubleshooting 部分以解决常见问题。

如需我将此 PR 正式创建到仓库，请在 web 页面创建 PR 并将本文件内容贴入描述（或使用 `gh pr create --body-file PR_DESCRIPTION.md`）。
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
