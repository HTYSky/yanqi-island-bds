# 雁栖岛 Minecraft 基岩版服务器

这是雁栖岛服务器项目，此仓库主要用于服务器备份整理和一起开发集成新功能，祝大家玩得愉快！

基于 **Minecraft Bedrock Dedicated Server (BDS)** 搭建，使用 **LeviLamina** 模组加载器并集成多个插件。

---

## 目录

- [服务器概览](#服务器概览)
- [项目结构](#项目结构)
- [核心组件](#核心组件)
- [插件列表](#插件列表)
- [配置说明](#配置说明)
- [快速开始](#快速开始)
- [卫星图系统](#卫星图系统)
- [权限管理](#权限管理)
- [世界信息](#世界信息)
- [网络统计](#网络统计)
- [Git LFS 说明](#git-lfs-说明)

---

## 服务器概览

| 项目 | 内容 |
|------|------|
| **服务器名称** | 雁栖岛 |
| **游戏模式** | 生存 (Survival) |
| **难度** | 普通 (Normal) |
| **IPv4 端口** | 2610 |
| **IPv6 端口** | 2611 |
| **最大玩家数** | 10 |
| **正版验证** | 关闭 (离线模式) |
| **世界名称** | YanqiLake |
| **世界种子** | 20260509 |
| **模组加载器** | LeviLamina v26.10.11 |
| **脚本引擎** | LegacyScriptEngine (QuickJS + Node.js) |

---

## 项目结构

```
bds-ll/
├── bedrock_server_mod.exe      # 服务器主程序（BDS Mod版）
├── bedrock_runtime_data         # 运行时数据
├── bedrock_server_how_to.html   # 官方BDS使用文档
├── release-notes.txt            # 版本发布说明
│
├── PreLoader.dll                # 预加载器（LeviLamina启动前置）
├── PreLoaderConfig.json         # 预加载器配置
├── PeEditor.exe                 # PE文件编辑器工具
│
├── server.properties            # 服务器主配置文件
├── permissions.json             # 玩家权限配置（OP列表）
├── allowlist.json               # 白名单（当前为空）
├── packetlimitconfig.json       # 数据包速率限制配置
├── profanity_filter.wlist       # 脏话过滤器词库
│
├── 7za.exe                      # 7-Zip压缩工具
├── bdsdown.exe                  # BDS下载器工具
│
├── libraries/                   # 运行库
│   └── ProtocolLib.dll          # 网络协议库
│
├── config/                      # 默认配置
│   └── default/
│       └── permissions.json     # 默认模块权限
│
├── data/                        # 数据文件
│   └── bootstrap.json           # 启动引导配置（日志等级）
│
├── definitions/                 # 游戏定义文件
│   ├── attachables/             # 装备模型定义
│   ├── disconnection_errors/    # 断线错误信息
│   ├── feature_rules/           # 特征规则
│   ├── features/                # 世界特征
│   ├── persona/                 # 角色相关
│   ├── sdl_layouts/             # SDL布局
│   └── spawn_groups/            # 生物生成组
│
├── behavior_packs/              # 行为包
│   ├── chemistry/               # 化学行为包（完整版）
│   ├── chemistry_1.20.50/       # 1.20.50版本化学更新
│   ├── chemistry_1.20.60/       # 1.20.60版本化学更新
│   ├── chemistry_1.21.0/        # 1.21.0版本化学更新
│   └── chemistry_1.21.10/       # 1.21.10版本化学更新
│
├── resource_packs/              # 资源包
│   └── chemistry/               # 化学资源包（含元素纹理、音效等）
│
├── plugins/                     # 插件目录
│   ├── LeviLamina/              # LeviLamina 模组加载器
│   ├── legacy-script-engine-quickjs/  # QuickJS脚本引擎
│   ├── legacy-script-engine-nodejs/   # Node.js脚本引擎
│   ├── BDSLM_JS/                # 卫星地图系统
│   ├── YEssential/              # 多功能基础插件
│   ├── ZXland/                  # 领地系统
│   ├── HuHoBot/                 # 机器人插件
│   ├── LKroBot/                 # LK机器人插件
│   ├── JustTPS/                 # TPS监控
│   ├── MGStatusBar/             # 状态栏插件
│   ├── FastMiner/               # 快速挖掘
│   ├── LegacyMoney/             # 经济系统
│   ├── LegacyRemoteCall/        # 远程调用支持
│   └── ProtocolBridge/          # 协议桥接
│
├── worlds/                      # 世界存档
│   ├── YanqiLake/               # 主世界
│   └── Bedrock level/           # 默认世界
│
├── logs/                        # 日志目录
│   └── crash/                   # 崩溃日志
│
└── tooth_lock.json              # 附加数据文件
```

---

## 核心组件

### LeviLamina（模组加载器）

**版本：** v26.10.11  
**类型：** preload-native（预加载原生插件）  
**说明：** LeviLamina 是基岩版服务器的核心模组加载框架，提供了插件加载、API接口、事件系统等基础能力。通过 `PreLoader.dll` 在 BDS 启动前注入，所有其他插件依赖此框架运行。

### LegacyScriptEngine（脚本引擎）

包含两个运行时：

| 引擎 | 版本 | 说明 |
|------|------|------|
| **legacy-script-engine-quickjs** | 0.18.2 | QuickJS 运行时，轻量级，大部分 LLSE 插件使用此引擎 |
| **legacy-script-engine-nodejs** | 0.18.2 | Node.js 运行时，支持完整的 npm 生态，供需要 Node.js API 的插件使用 |

两个引擎均依赖 `LegacyMoney` 和 `LegacyRemoteCall` 提供经济与远程调用支持。

### ProtocolLib（协议库）

位于 `libraries/ProtocolLib.dll`，提供底层网络协议处理能力，供 `ProtocolBridge` 等原生插件使用。

---

## 插件列表

### 功能性插件

| 插件名 | 版本 | 类型 | 说明 |
|--------|------|------|------|
| **YEssential** | 2.11.6 | QuickJS | 基岩版多功能基础插件，提供传送、家园、传送点、聊天等核心功能 |
| **ZXland** | 1.1.0 | QuickJS | 领地系统，玩家可认领和保护自己的领地 |
| **LegacyMoney** | 0.18.1 | Native | 经济系统（LLMoney），提供货币相关的API |
| **FastMiner** | 0.16.0 | Native | 快速挖掘插件 |
| **ProtocolBridge** | 1.0.0 | Native | 协议桥接，处理多版本协议兼容 |

### 显示与监控

| 插件名 | 版本 | 类型 | 说明 |
|--------|------|------|------|
| **BDSLM_JS** | 1.4.0 | Node.js | 卫星地图系统，提供Web端世界地图、玩家实时位置、网页聊天 |
| **JustTPS** | 1.0.0 | QuickJS | 计算并显示服务器TPS（每秒Tick数） |
| **MGStatusBar** | 2.2.1 | QuickJS | 极简状态栏，在玩家屏幕上显示服务器信息 |

### 机器人与自动化

| 插件名 | 版本 | 类型 | 说明 |
|--------|------|------|------|
| **HuHoBot** | - | QuickJS | 机器人插件 |
| **LKroBot** | 1.2.4 | QuickJS | LK机器人插件 |

### 基础设施

| 插件名 | 版本 | 类型 | 说明 |
|--------|------|------|------|
| **LegacyRemoteCall** | 0.18.0 | Native | 远程调用支持，为脚本引擎提供跨插件通信能力 |

---

## 配置说明

### server.properties 关键配置

```properties
server-name=雁栖岛                  # 服务器名称
gamemode=survival                   # 游戏模式：生存
difficulty=normal                   # 难度：普通
allow-cheats=false                  # 禁止作弊
max-players=10                      # 最大玩家数
online-mode=false                   # 离线模式（不验证Xbox Live）
server-port=2610                    # IPv4端口
server-portv6=2611                  # IPv6端口
level-name=YanqiLake                # 世界名称
level-seed=20260509                 # 世界种子
view-distance=32                    # 视距（区块数）
tick-distance=4                     # Tick距离
max-threads=0                       # 最大线程数（0=自动）
default-player-permission-level=member  # 默认权限级别
```

### 权限配置 (permissions.json)

当前配置了 3 名管理员（Operator），通过 XUID 标识。管理员拥有执行命令和管理服务器的权限。

### 数据包速率限制 (packetlimitconfig.json)

配置了两种数据包的速率限制：
- **数据包 #193, #4**：每秒释放 0.0013，最大桶大小 1（严格限制）
- **数据包 #9**：每秒释放 10，最大桶大小 50（较宽松）

### PreLoader 配置 (PreLoaderConfig.json)

```json
{
    "colorLog": true,       # 彩色日志输出
    "logLevel": 4,          # 日志等级
    "logPath": "./logs/",   # 日志存储路径
    "modsPath": "./plugins/", # 插件目录
    "version": 1
}
```

---

## 快速开始

### 环境要求

- **操作系统：** Windows 10 1703+ / Windows Server 2016+
- **处理器：** 64位 Intel 或 AMD，至少 2 核
- **内存：** 至少 1 GB RAM
- **运行库：** Visual C++ 运行时

### 启动服务器

1. 确保所有文件完整（包括 Git LFS 拉取的大文件）
2. 直接运行 `bedrock_server_mod.exe` 启动服务器
3. 首次启动会自动生成必要的文件夹和配置文件

```bash
# 启动服务器
./bedrock_server_mod.exe
```

### 连接服务器

- 在 Minecraft 基岩版中添加服务器地址 `服务器IP:2610`
- 由于关闭了正版验证（online-mode=false），离线玩家也可连接

### 常用管理命令

| 命令 | 说明 |
|------|------|
| `stop` | 优雅关闭服务器 |
| `op <玩家名>` | 提升玩家为管理员 |
| `deop <玩家名>` | 降级管理员为普通成员 |
| `kick <玩家名> <原因>` | 踢出玩家 |
| `save hold` | 准备备份（暂停文件写入） |
| `save query` | 查询备份就绪状态 |
| `save resume` | 恢复备份后的正常写入 |
| `allowlist add <玩家名>` | 添加白名单 |
| `allowlist remove <玩家名>` | 移除白名单 |
| `allowlist reload` | 重载白名单 |
| `permission reload` | 重载权限列表 |
| `changesetting <设置> <值>` | 动态修改服务器设置 |

---

## 卫星图系统

**BDSLM_JS** 是本服务器的一大亮点，提供了基于 Web 的实时世界地图。

### 功能特性

- **世界卫星图：** 使用 uNmINeD 渲染工具生成等角投影的世界地图
- **玩家实时追踪：** 在地图上显示在线玩家的实时位置和朝向
- **网页聊天：** 支持通过 Web 界面与游戏内玩家聊天（需登录）
- **自定义标记：** 支持多种标记图层（XYZ坐标、YEssential传送点/家园）
- **自动渲染：** 每 120 分钟自动重新渲染地图

### 访问方式

启动服务器后，浏览器访问：

```
http://localhost:5110
```

### 相关命令

| 命令 | 权限 | 说明 |
|------|------|------|
| `/slmrender` | OP | 手动触发卫星图渲染 |
| `/slmrender reload` | OP | 重载 BDSLM_JS 配置文件 |
| `/bdslm` | 所有人 | 打开卫星图密码设置菜单 |

### 配置文件

卫星图的主要配置位于 `plugins/BDSLM_JS/data/config.json`：

- `webserver.port` - Web服务器端口（默认 5110）
- `mapRender.zoomin` - 最大放大级别（当前 4）
- `mapRender.zoomout` - 最大缩小级别（当前 -5）
- `autoRend.isEnabled` - 是否启用自动渲染
- `autoRend.cycle` - 自动渲染周期（分钟）
- `webChat.isEnabled` - 是否启用网页聊天
- `yeEssentialSync.enabled` - 是否同步 YEssential 数据到地图

---

## 权限管理

### 权限级别

| 级别 | 说明 | 默认能力 |
|------|------|----------|
| **visitor** | 访客 | 基本游玩 |
| **member** | 成员（默认） | 基本游玩 + 部分命令 |
| **operator** | 管理员 | 全部命令和管理权限 |

### 管理员配置

通过 `permissions.json` 配置，使用玩家的 XUID 来指定：

```json
[
    {
        "permission": "operator",
        "xuid": "玩家的XUID"
    }
]
```

> **注意：** XUID 需要在 `online-mode=true` 时通过 Xbox Live 验证获取。离线模式下可使用 `/op <玩家名>` 临时授权。

---

## 世界信息

| 属性 | 值 |
|------|-----|
| **世界名称** | YanqiLake |
| **种子** | 20260509 |
| **存档位置** | `worlds/YanqiLake/` |

服务器还包含一个默认世界 `Bedrock level` 在 `worlds/Bedrock level/` 目录下。

---

## 网络统计

从 `packet-statistics.txt` 可以看到服务器运行约 **49 小时**（176838 秒）的网络数据：

- **总发送数据包：** ~1.6 亿个，共约 1338 MB
- **总接收数据包：** ~392 万个，共约 260 MB
- **带宽使用率：** 40.14%
- **发送量最大的数据包类型：** BlockActorDataPacket (2605 MB)、MoveActorDeltaPacket (878 MB)
- **接收量最大的数据包类型：** PlayerAuthInputPacket (206 MB)

---

## Git LFS 说明

本项目使用 Git LFS (Large File Storage) 管理大文件：

- `bedrock_server_mod.exe` — BDS 服务器主程序（超过 100MB）
- `plugins/legacy-script-engine-nodejs/libnode.dll` — Node.js 运行时库（超过 100MB）

克隆仓库后请确保已安装 Git LFS 并拉取了大文件：

```bash
git lfs install
git lfs pull
```

---

## 技术栈

| 层级 | 技术 |
|------|------|
| **服务器核心** | Minecraft Bedrock Dedicated Server |
| **模组框架** | LeviLamina (C++) |
| **脚本引擎** | QuickJS / Node.js (via LegacyScriptEngine) |
| **插件语言** | JavaScript (LLSE API)、C++ (Native DLL) |
| **Web服务** | Express.js (Node.js) |
| **地图渲染** | uNmINeD CLI |
| **地图前端** | OpenLayers |
| **认证** | JWT + bcryptjs |

---

## 备份说明

BDS 支持在线热备份，步骤如下：

1. 执行 `save hold` — 服务器准备备份
2. 反复执行 `save query` — 等待返回成功，获取文件列表
3. 按返回的文件列表复制文件（注意按指定长度截断）
4. 执行 `save resume` — 恢复服务器正常写入

建议将此流程编写为自动化脚本来定期备份世界数据。

---

## 相关链接

- [Minecraft 基岩版服务器下载](https://www.minecraft.net/en-us/download/server/bedrock)
- [LeviLamina 项目](https://github.com/LiteLDev/LeviLamina)
- [LegacyScriptEngine](https://github.com/LiteLDev/LegacyScriptEngine)
- [uNmINeD 地图渲染工具](https://unmined.net/)
- [Minecraft Bug 追踪 (BDS)](https://bugs.mojang.com/projects/BDS/issues)

---

*最后更新：2026-05-31*
