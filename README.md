# rutracker-chinese

RuTracker 中文化 userscript 的源码与构建说明。

本仓库将 userscript 的源码模块化（`src/`），并提供一个小型构建脚本 `build.js`（基于 esbuild）来打包生成可安装的 `dist/rutracker-chinese.user.js`。

## 快速开始（开发者）

1. 克隆仓库并切换到项目目录：

```pwsh
git clone https://github.com/wangyan-life/rutracker-chinese.git
cd rutracker-chinese
```

2. 安装依赖：

```pwsh
# 首次安装
npm install
# 或在 CI 环境使用更确定的安装
npm ci
```

3. 本地构建（生成 userscript）：

```pwsh
npm run build
# 生成文件：dist/rutracker-chinese.user.js
```

4. 开发时监听变动：

```pwsh
npm run watch
```

## 主要脚本说明（package.json）

- `npm run build` —— 普通构建（使用 package.json 中的 version）。
- `npm run watch` —— 开启 watch 模式（构建器会监听源码变化并重建）。
- `npm run build:version -- <ver>` —— 以指定版本号构建（示例：`npm run build:version -- 2.0.1`）。
- `npm run build:bump` —— 自动增加 patch 并构建（等同 `node build.js --bump patch`）。
- `npm run release` —— 自动增加 minor 并构建（等同 `node build.js --bump minor`）。
- `npm run build:stats` —— 构建并包含埋点（用于性能测量，等同 `node build.js --stats 1`）。
- `npm run measure` —— 运行 `tools/measure.js`（Puppeteer 脚本）对指定页面执行自动测量。

## 性能测量与埋点

本项目提供可选的构建级埋点（通过 `--stats` 打开），以及一个 Puppeteer 驱动的测量脚本：

1. 构建带埋点的 userscript：

```pwsh
npm run build:stats
```

2. 运行测量脚本（示例）：

```pwsh
node tools/measure.js --url https://rutracker.org --runs 3 --out measure-results.json
```

说明：测量脚本会在页面上注入本地生成的 `dist/rutracker-chinese.user.js`（如果存在）并读取 `window.__rutracker_i18n_stats`。

## CI（GitHub Actions）

已添加一个可触发的工作流 `.github/workflows/measure.yml`：

- 触发器：手动（workflow_dispatch）、发布 release（published）、以及 push 到 `main`。
- 步骤：checkout → 安装依赖 → `npm run build:stats` → 运行 `node tools/measure.js` → 上传 `measure-results.json` 作为 artifact。

如果希望在 PR 合并后自动运行测量，请确保将分支合并到 `main`（或调整 workflow 触发规则）。

## 常见问题与故障排除

- 问：`npm ci` 时出现 `EPERM` 权限错误？
	- 解决：以管理员身份运行 PowerShell，或将 npm 缓存更改为用户可写目录：

```powershell
mkdir -Force $env:USERPROFILE\.npm-cache
npm config set cache "$env:USERPROFILE\.npm-cache" --global
npm ci
```

- 问：测量脚本没有返回任何埋点数据？
	- 确认是否使用 `npm run build:stats` 生成了带埋点的 userscript；测量脚本会尽量注入本地 `dist` 文件并读取 `window.__rutracker_i18n_stats`。

## PR 与贡献

- 分支策略：功能分支推送到远程并创建 PR（示例：`perf/instrumentation` → `main`）。
- 我已在分支 `perf/instrumentation` 添加相关变更，并提供 `PR_DESCRIPTION.md`（仓库根）作为 PR body 的建议文本，内容包括变更清单与运行说明。

创建 PR 的快速方式（本地）：

```pwsh
# 使用 gh（若已安装并登录）
gh pr create --base main --head perf/instrumentation --title "perf: instrumentation + measurement CI" --body-file PR_DESCRIPTION.md
```

或者在 GitHub 网页上新建 PR，选择 base 为 `main`，compare 为 `perf/instrumentation`，并把 `PR_DESCRIPTION.md` 内容粘贴到描述。

## 许可证

MIT

````markdown
# rutracker-chinese
RuTracker 汉化插件，RuTracker 中文化界面。

## 安装
[Github 仓库安装链接](https://github.com/wangyan-life/rutracker-chinese/raw/main/dist/rutracker-chinese.user.js)
[Greasy Fork 安装链接](https://greasyfork.org/scripts/510791)

## 模块化源码与构建
本仓库现在包含模块化源码（位于 `src/`），并提供一个小型构建脚本使用 `esbuild` 将模块打包回可安装的 userscript：

快速开始

1. 安装依赖：

```pwsh
npm install
```

2. 构建 userscript：

```pwsh
npm run build
```

3. 输出文件：`dist/rutracker-chinese.user.js`，在油猴/插件管理器中安装该文件。

构建脚本会在打包文件顶部注入 userscript 头部注释（例如 `@name`、`@match` 等）。

## 版本控制与自动化构建

构建脚本支持在生成 userscript 时指定或自动增加版本号。推荐的工作流：

- 将 `package.json` 的 `version` 作为项目主版本来源（已更新为 `2.0.0`）。
- 日常快速构建（使用 package.json 中的版本）：

```pwsh
npm install
npm run build
```

- 手动指定生成脚本的 `@version`（不会修改 `package.json`）：

```pwsh
node build.js --version 2.0.0
```

- 自动增加版本并写回 `package.json`：

```pwsh
node build.js --bump patch   # 增加补丁号并写回 package.json
node build.js --bump minor   # 增加次版本号
node build.js --bump major   # 增加主版本号
```

- 辅助 npm 脚本（方便记忆）：

```pwsh
npm run build:version -- 2.0.1   # 使用指定版本（注意需要加 -- 将参数传递给脚本）
npm run build:bump               # 自动增加 patch 并构建
npm run release                  # 自动增加 minor 并构建（可用于发布）
```

注意：`--bump` 会修改 `package.json` 的 `version` 字段；`--version` 只在生成的 userscript header 中写入指定版本，而不修改 `package.json`。

## Troubleshooting: Windows `npm ci` permission errors

If you see errors like `EPERM: operation not permitted, open 'C:\\Program Files\\nodejs\\node_cache\\_cacache\\tmp\\...'` when running `npm ci` on Windows, try the following steps in an elevated PowerShell (right-click -> Run as Administrator) or change the npm cache location to a user-writable folder:

1) Run PowerShell as Administrator and retry installation:

```powershell
# Start an elevated shell manually, then:
npm ci
```

2) Or set npm cache to a user-writable folder and retry (no administrator needed):

```powershell
# create a cache folder in your user profile if needed
mkdir -Force $env:USERPROFILE\\.npm-cache
npm config set cache "$env:USERPROFILE\\.npm-cache" --global
# Then install
npm ci
```

3) If OneDrive or antivirus locks files, point npm cache and temp to a non-synced folder:

```powershell
$cache = "$env:LOCALAPPDATA\\Temp\\npm-cache"
mkdir -Force $cache
npm config set cache $cache --global
npm ci
```

Notes:
- Using `npm ci` requires correct permissions to write into npm's cache and tmp directories. Pointing the cache to a user-writable path avoids EPERM on protected locations.
- If using `puppeteer`, Chromium will be downloaded during install; CI runners handle this automatically, but locally ensure you have network access and sufficient disk space.

````
# rutracker-chinese
RuTracker 汉化插件，RuTracker 中文化界面。

## 安装
[Github 仓库安装链接](https://github.com/wangyan-life/rutracker-chinese/raw/main/dist/rutracker-chinese.user.js)
[Greasy Fork 安装链接](https://greasyfork.org/scripts/510791)

## 模块化源码与构建
本仓库现在包含模块化源码（位于 `src/`），并提供一个小型构建脚本使用 `esbuild` 将模块打包回可安装的 userscript：

快速开始

1. 安装依赖：

```pwsh
npm install
```

2. 构建 userscript：

```pwsh
npm run build
```

3. 输出文件：`dist/rutracker-chinese.user.js`，在油猴/插件管理器中安装该文件。

构建脚本会在打包文件顶部注入 userscript 头部注释（例如 `@name`、`@match` 等）。

## 版本控制与自动化构建

构建脚本支持在生成 userscript 时指定或自动增加版本号。推荐的工作流：

- 将 `package.json` 的 `version` 作为项目主版本来源（已更新为 `2.0.0`）。
- 日常快速构建（使用 package.json 中的版本）：

```pwsh
npm install
npm run build
```

- 手动指定生成脚本的 `@version`（不会修改 `package.json`）：

```pwsh
node build.js --version 2.0.0
```

- 自动增加版本并写回 `package.json`：

```pwsh
node build.js --bump patch   # 增加补丁号并写回 package.json
node build.js --bump minor   # 增加次版本号
node build.js --bump major   # 增加主版本号
```

- 辅助 npm 脚本（方便记忆）：

```pwsh
npm run build:version -- 2.0.1   # 使用指定版本（注意需要加 -- 将参数传递给脚本）
npm run build:bump               # 自动增加 patch 并构建
npm run release                  # 自动增加 minor 并构建（可用于发布）
```

注意：`--bump` 会修改 `package.json` 的 `version` 字段；`--version` 只在生成的 userscript header 中写入指定版本，而不修改 `package.json`。
