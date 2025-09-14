# rutracker-chinese
RuTracker 汉化插件，RuTracker 中文化界面。

## 安装
[Github 仓库安装链接](https://github.com/wangyan-life/rutracker-chinese/raw/main/rutracker-chinese.user.js)
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
