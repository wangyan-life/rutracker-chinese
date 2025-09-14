# rutracker-chinese

RuTracker 中文化 userscript — 源码、构建与测量说明。

此仓库将 userscript 拆分为模块源码（位于 `src/`），使用 `esbuild` 通过 `build.js` 打包并在顶部注入 userscript metadata，生成可安装的 `dist/rutracker-chinese.user.js`。

## 快速开始

克隆仓库并进入目录：

```pwsh
git clone https://github.com/wangyan-life/rutracker-chinese.git
cd rutracker-chinese
```

安装依赖：

```pwsh
npm install
```

本地构建（生成 userscript 到 `dist/`）：

```pwsh
npm run build
```

开发时可启动监听：

```pwsh
npm run watch
```

## 常用脚本说明

- `npm run build`：普通构建（使用 `package.json` 中的 `version`）。
- `npm run watch`：监听源码并实时重建。
- `npm run build:version -- <ver>`：使用指定版本号构建（示例：`npm run build:version -- 2.0.1`）。
- `npm run build:bump`：自动增加 patch 并构建（`node build.js --bump patch`）。
- `npm run release`：自动增加 minor 并构建（`node build.js --bump minor`）。
- `npm run build:stats`：构建并包含性能埋点（`node build.js --stats 1`）。
- `npm run measure`：运行 `tools/measure.js`（Puppeteer 测量脚本）。

## 测量与埋点（简介）

为便于量化替换性能，项目支持可选的构建级埋点：在构建时传入 `--stats 1`，构建产物会在运行时把替换统计写入 `window.__rutracker_i18n_stats`。

测量脚本位于 `tools/measure.js`，使用 Puppeteer 打开目标页面、注入本地 userscript（若存在）并读取埋点数据：

```pwsh
# 构建带埋点的 userscript
npm run build:stats

# 运行测量脚本（示例）
node tools/measure.js --url https://rutracker.org --runs 3 --out measure-results.json
```

测量输出 `measure-results.json` 包含每次运行的 `loadTime`，以及当启用埋点时的 `stats` 对象（包含耗时、节点统计等）。

## CI（GitHub Actions）

工作流文件：`.github/workflows/measure.yml`。当前配置触发条件：

- 手动触发（`workflow_dispatch`）
- 发布 release 时（`release: published`）
- push 到 `main`

工作流会安装依赖、执行 `npm run build:stats`、运行测量脚本并把 `measure-results.json` 作为 artifact 上传（名为 `i18n-measure-results`）。

如果需要在 PR 合并时自动运行测量，请将分支合并到 `main` 或调整工作流触发规则。

## 常见问题与故障排查

- Windows 下 `npm ci` 出现 `EPERM` 权限错误：

	- 以管理员权限运行 PowerShell（右键 → Run as Administrator），或将 npm cache 指向用户可写目录：

		```pwsh
		mkdir -Force $env:USERPROFILE\.npm-cache
		npm config set cache "$env:USERPROFILE\.npm-cache" --global
		npm ci
		```

	- 若 OneDrive 或杀毒软件会锁定文件，请把 cache/temp 指向非同步目录（如 `%LOCALAPPDATA%\Temp`）。

- 测量脚本没有返回埋点数据：

	- 请确认已使用 `npm run build:stats` 构建带埋点的 userscript，且本地 `dist/rutracker-chinese.user.js` 可被 `tools/measure.js` 注入。

## 贡献与 PR

推荐流程：

1. 新建功能分支并推送到远程（例如 `perf/instrumentation`）。
2. 在 GitHub 仓库中新建 PR，目标分支为 `main`。

仓库已在 `perf/instrumentation` 分支添加测量相关改动，并提供 `PR_DESCRIPTION.md` 作为 PR 描述模板（位于仓库根）。

可在本地使用 `gh` 创建 PR（若已安装并登录）：

```pwsh
gh pr create --base main --head perf/instrumentation --title "perf: instrumentation + measurement CI" --body-file PR_DESCRIPTION.md
```

或在 GitHub 网页上手动创建 PR。

## 许可证

本项目采用 MIT 许可证。详情见仓库中的 `LICENSE` 文件。

---

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
