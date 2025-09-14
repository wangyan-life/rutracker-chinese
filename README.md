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
