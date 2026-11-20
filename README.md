<div align="center">
<img width="100" height="100" alt="图片商标" src="https://github.com/user-attachments/assets/37af7e75-43df-45e3-bf8c-d76eedd52d81">
</div>

<h1 align="center">TitanCore (泰坦核心) </h1>

<p align="center">
  <b>干净、透明、现代化的次时代 Steam 游戏管理与原生增强工作站</b>
</p>

<div align="center">

[English](./README.en.md) | 简体中文

</div>


<div align="center">
<img width="150" height="150" alt="picture猫猫头图" src="https://github.com/user-attachments/assets/dd316ec1-fba0-488c-a51e-fcc03a69e131">
</div>

<div align="center">

[![GitHub Star](https://img.shields.io/github/stars/TitanCoreTeam/TitanCore?style=flat-square&color=f1c40f)](https://github.com/TitanCoreTeam/TitanCore/stargazers)
[![GitHub Fork](https://img.shields.io/github/forks/TitanCoreTeam/TitanCore?style=flat-square&color=2ecc71)](https://github.com/TitanCoreTeam/TitanCore/network/members)
[![GitHub Repo Languages](https://img.shields.io/github/languages/top/TitanCoreTeam/TitanCore?style=flat-square&color=e74c3c)](https://github.com/TitanCoreTeam/TitanCore/search?l=c%23)
[![NET 7.0](https://img.shields.io/badge/dotnet-7.0-512bd4.svg?style=flat-square&color=512bd4)](https://learn.microsoft.com/zh-cn/dotnet/core/whats-new/dotnet-7)
[![C# 11](https://img.shields.io/badge/c%23-11-239120.svg?style=flat-square&color=239120)](https://learn.microsoft.com/zh-cn/dotnet/csharp/whats-new/csharp-11)

[![QQ群](https://img.shields.io/badge/QQ群-1075291325-12b7f5.svg?style=flat-square&color=12b7f5&logo=qq)](https://qm.qq.com/q/5af5EvIjXa)
[![TitanCore玩家社区](https://img.shields.io/badge/TitanCore玩家社区-modvips.com-222222.svg?style=flat-square&color=222222&logo=homebrew)](https://www.modvips.com/)
[![GitHub Star](https://img.shields.io/github/stars/TitanCoreTeam/TitanCore.svg?logo=github&style=flat-square)](https://github.com/TitanCoreTeam/TitanCore)
[![Gitee Fork](https://gitee.com/cclive-zhuang/TitanCore/badge/fork.svg)](https://gitee.com/cclive-zhuang/TitanCore)
[![爱发电](https://img.shields.io/badge/爱发电-TitanCore-pink.svg?style=flat-square&color=ea4aaa&logo=github-sponsors)](https://ifdian.net/a/TitanCore)

</div>

## 📖 项目愿景

**TitanCore** 是一个专为游戏玩家与极客打造的次时代桌面增强终端。

在充斥着闭源黑盒、动态下发恶意执行代码、流氓捆绑与杀毒频繁报毒的传统游戏工具生态中，TitanCore 坚持**“完全开源、代码干净、架构透明、零黑盒”**的第一性原则：
1. **100% 源码透明**：从前端 UI 到 C++ 底层注入，无任何未经审计的隐藏逻辑或动态后门代码；
2. **零信任与离线友好**：原生支持全单机离线模式，即使断开任何网络，依然能流畅管理本地游戏库与启动增强；
3. **现代技术栈**：基于 Vue 3、Tailwind CSS 4、Electron 42 与 Win32 C++ 原生扩展打造，手感丝滑、界面硬核。

---

## ✨ 核心特性

* 🎮 **本地游戏全景库**：内置高性能 SQLite 引擎（`better-sqlite3`），秒级检索并呈现本地 Steam 游戏元数据与高清封面；
* ⚡ **纯净挂起注入引擎**：C++ 原生模块（`native/tc_native.cc`）实现低权限令牌降权（Medium Integrity）与挂起创建（`CREATE_SUSPENDED`），避免子进程与反作弊机制冲突；
* 🚀 **极速并发下载底座**：深度集成开源下载利器 `aria2c`，通过 WebSocket JSON-RPC 协议实现多线程极速并发下载与断点续传；
* 🎨 **次时代双模视觉架构**：
  * **硬核机能风 (Minimal Tech)**：冷酷黑曜石质感、机能流光边框、冷光指示器；
  * **赛博二次元风 (Anime Future)**：灵动渐变、呼吸光效、看板娘实时物理交互；
* 🛡️ **标准环境变量配置**：敏感节点与云端鉴权全部解耦，支持通过 `.env.example` 轻松接入开发者自建的服务端。

---

## 🏛️ 系统架构速览

```
TitanCore 桌面应用
├── [前端渲染层 (Renderer)]
│   ├── Vue 3 (Composition API) + Pinia 状态管理
│   ├── Tailwind CSS 4 原子化样式
│   └── Pixi.js 2D 动效引擎
│
├── [Electron 主进程 (Main Process)]
│   ├── services/       业务服务层 (游戏服务、下载调度、配置同步)
│   ├── db.ts           SQLite 数据库持久层 (WAL 模式)
│   └── TitanNet.ts     网络通信抽象层
│
└── [C++ 原生扩展层 (Native Addon)]
    └── native/tc_native.cc (Win32 API: 挂起创建进程、DLL 内存加载、降权启动)
```

---

## 🚀 快速开始

### 1. 克隆代码
```powershell
git clone https://github.com/YourUsername/TitanCore.git
cd TitanCore
```

### 2. 安装依赖并编译 C++ 模块
```powershell
# 安装依赖并重编 native 模块
npm install

# 编译 C++ 原生模块 (tc_native.node)
npm run build:native
```

### 3. 运行开发环境
```powershell
npm run dev
```

详细的依赖版本要求与排错方案，请参阅 📖 **[BUILD.md 构建指南](BUILD.md)**。

---

## ⚙️ 环境变量配置

在单机模式下，无需任何配置即可正常使用全部本地功能。如果需要对接您自己的云端后端，请复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

并在 `.env.local` 中配置您的节点 URL 与通信密钥：
```env
TITAN_NODE_1=https://your-server.com/titan_config.json
TITAN_SALT=YOUR_CUSTOM_SALT
```

---

## 📄 开源许可证

本项目基于 **[MIT License](LICENSE)** 协议开源。任何人均可自由使用、复制、修改、合并、发布、分发及销售本软件的副本。
