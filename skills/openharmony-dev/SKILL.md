# OpenHarmony 开发技能

基于实践总结的 OpenHarmony 应用开发规范，涵盖 Stage 模型项目结构、hvigor 构建系统、DevEco Studio 工作流，以及常见问题的根因和解决方案。

---

## 1. OpenHarmony 与 HarmonyOS 的区别

| | OpenHarmony | HarmonyOS |
|---|---|---|
| **定位** | 开源项目，由 OpenAtom 基金会运营 | 华为商业闭源版本 |
| **包管理** | ohpm（OpenHarmony Package Manager） | hpm（Huawei Package Manager） |
| **SDK 版本** | integer（如 `10`） | string（如 `"5.0.5(17)"`） |
| **生态** | 第三方厂商（美的、OPPO 等） | 华为设备，预装 HMS Core |
| **API 来源** | 完全开源 | 部分闭源，含华为专有服务 |
| **典型场景** | IoT 设备、第三方厂商定制系统 | 华为手机、平板、消费设备 |

**对于开发者来说最重要的区别：**
- OpenHarmony 项目用 `compileSdkVersion: 10`（整数）
- HarmonyOS 项目用 `"compileSdkVersion": "5.0.5(17)"`（字符串格式）
- 小黒的课程是 OpenHarmony 开发，所以用整数格式

---

## 2. Stage 模型核心概念

Stage 模型是 OpenHarmony 5.0+ 推荐的应用架构，与 FA 模型（早期）区分。

### 核心模块

```
entry/                    # 主模块（应用入口）
├── src/main/
│   ├── ets/
│   │   ├── entryability/   # UIAbility 生命周期管理
│   │   └── pages/          # 页面（ArkUI 组件）
│   ├── module.json5        # 模块配置（必须）
│   └── resources/           # 资源文件
├── build-profile.json5     # 模块级构建配置
├── hvigorfile.ts           # 模块构建入口
└── oh-package.json5         # 模块依赖配置

AppScope/                 # 应用级共享配置
├── app.json5              # bundleName、版本、图标
└── resources/              # 应用级资源

hvigor/                    # hvigor 构建工具包（从 DevEco Studio SDK 复制）
hvigor-ohos-plugin/        # OpenHarmony 构建插件

build-profile.json5         # 工程级构建配置
hvigor-config.json5         # hvigor 行为配置
hvigorfile.ts              # 工程级构建入口
package.json                # npm 包配置（无依赖时可为空对象）
oh-package.json5            # ohpm 包配置（无依赖时为空对象）
```

---

## 3. 关键配置文件详解

### 3.1 build-profile.json5（工程级）

```json5
{
  "app": {
    "products": [
      {
        "name": "default",
        "signingConfig": "default",
        "compileSdkVersion": 10,           // OpenHarmony 5.0 对应 10（整数）
        "compatibleSdkVersion": 10          // 最低兼容 SDK 版本
      }
    ]
  }
}
```

**常见错误：**
- `compileSdkVersion: 5` → 新版 hvigor（6.x）要求 `> 7`，否则报 `exclusiveMinimum` 错误
- 同时在 app 和 product 中设置 SDK 版本 → 报 `modules must be an array` 错误
- 缺少 `compileSdkVersion` 在新版中可省略（默认使用 DevEco Studio 配套 SDK）

### 3.2 build-profile.json5（模块级 entry/）

```json5
{
  "apiType": "stageMode",
  "buildOption": {
    "resOptions": {
      "copyCodeResource": { "enable": false }
    }
  },
  "targets": [
    { "name": "default" }
  ]
}
```

### 3.3 module.json5（模块配置，最核心）

```json5
{
  "module": {
    "name": "entry",                  // 模块名，必须
    "type": "entry",                  // entry | har | hsp | feature
    "description": "$string:module_desc",  // 引用资源文件
    "mainElement": "EntryAbility",    // 主 UIAbility
    "deviceTypes": ["phone", "tablet"],  // 支持设备类型
    "deliveryWithInstall": true,
    "installationFree": false,
    "pages": "$profile:main_pages",   // 页面路由配置
    "abilities": [
      {
        "name": "EntryAbility",       // UIAbility 类名
        "srcEntry": "./ets/entryability/EntryAbility.ets",
        "description": "$string:entry_desc",
        "icon": "$media:icon",
        "label": "$string:entry_label",
        "startWindowIcon": "$media:icon",
        "startWindowBackground": "$color:start_window_background",
        "exported": true,
        "skills": [
          {
            "entities": ["entity.system.home"],
            "actions": ["action.system.home"]
          }
        ]
      }
    ]
  }
}
```

### 3.4 hvigor-config.json5

```json5
{
  "modelVersion": "6.21.1",    // 必须使用新版格式（旧版 "hvigor": "2.4.2" 会导致路径解析错误）
  "dependencies": {},
  "execution": {
    "daemon": true,
    "incremental": true,
    "parallel": true
  },
  "logging": { "level": "info" },
  "debugging": { "stacktrace": false },
  "nodeOptions": { "maxOldSpaceSize": 8192 }
}
```

### 3.5 oh-package.json5（模块级依赖）

```json5
{
  "name": "entry",
  "version": "1.0.0",
  "description": "BMI Calculator Module",
  "main": "",
  "author": "",
  "license": "",
  "dependencies": {}           // 系统 API（@ohos/hilog 等）不需要在此声明！
}
```

**重要：`@ohos/hilog`、`@ohos.app.ability.UIAbility` 等系统 API 是 SDK 内置的，不需要通过 ohpm 安装，也不需要写在 dependencies 里。**

### 3.6 hvigorfile.ts（工程级）

```typescript
import { appTasks } from '@ohos/hvigor-ohos-plugin';

export default {
  system: appTasks,
  plugins: []
};
```

### 3.7 hvigorfile.ts（模块级 entry/）

```typescript
import { hapTasks } from '@ohos/hvigor-ohos-plugin';

export default {
  system: hapTasks,
  plugins: []
};
```

---

## 4. DevEco Studio 与 hvigor 的关系

### 4.1 架构对比

| 组件 | 位置 | 作用 |
|---|---|---|
| DevEco Studio | `/Applications/DevEco-Studio.app/` | 集成开发环境，内部调用 hvigor |
| hvigor（Java daemon） | Studio 内置，通过 `hvigorw` 启动 | 实际构建引擎 |
| ohpm | Studio 内置 | 包管理器 |
| hvigorw | 项目根目录 | 启动脚本（设置环境后调用 Java daemon） |

### 4.2 hvigorw 脚本原理

`hvigorw` 是一个 shell 脚本，内部流程：
1. 设置 `DEVECO_SDK_HOME` 和 `HVIGOR_USER_HOME` 环境变量
2. 调用 Java daemon（`hvigor-java-daemon.jar`）启动 hvigor 服务
3. hvigor daemon 在 `~/.hvigor/project_caches/<hash>/workspace/` 下创建 `node_modules/@ohos/hvigor` 软链接，指向项目目录或 SDK 目录

### 4.3 为什么 hvigorw CLI 经常报错？

**关键发现：DevEco Studio 的 hvigor 和项目自带的 hvigor 是同一个包（版本 6.21.1）**，但 CLI 方式依赖正确设置环境变量。Studio 内部设置了完整环境，CLI 脚本只是部分配置。

**最佳实践：**
- 日常开发用 **DevEco Studio 的 Run 按钮**
- hvigorw CLI 可用，但需要确保 `DEVECO_SDK_HOME` 指向正确位置
- CLI 构建：`./hvigorw -p product=default assembleHap`

### 4.4 hvigor 缓存路径问题（最常见根因）

hvigor 在 `~/.hvigor/project_caches/<hash>/workspace/node_modules/@ohos/` 下创建软链接。当：
- 项目从 `OpenHarmony/` 目录移动到 `openharmony/` 下（同一目录，大小写不同）
- hvigor daemon 缓存了旧的绝对路径

**解决方案：**
```bash
# 方案 1：删除缓存让 hvigor 重建
rm -rf ~/.hvigor/project_caches/<对应hash>/workspace

# 方案 2：手动修正 symlink 指向新路径
# 先查 cache hash：
ls ~/.hvigor/project_caches/
# 然后修正：
ln -sf "/正确路径/hvigor" ~/.hvigor/project_caches/<hash>/workspace/node_modules/@ohos/hvigor
ln -sf "/正确路径/hvigor-ohos-plugin" ~/.hvigor/project_caches/<hash>/workspace/node_modules/@ohos/hvigor-ohos-plugin
```

---

## 5. 项目创建标准流程（重要）

### 5.1 手动创建项目的正确顺序

很多问题源于项目结构不完整。按照这个顺序创建：

```
1. 创建工程目录
mkdir -p bmilxf202404020218
cd bmilxf202404020218

2. 复制完整的工具链（从已知可用的项目复制）
   - hvigor/
   - hvigor-ohos-plugin/
   - hvigorw
   - hvigorw.js

3. 创建目录结构
mkdir -p entry/src/main/ets/entryability
mkdir -p entry/src/main/ets/pages
mkdir -p entry/src/main/resources/base/element
mkdir -p entry/src/main/resources/base/media
mkdir -p entry/src/main/resources/base/profile
mkdir -p AppScope/resources/base/element

4. 创建配置文件（按以下顺序）
   - build-profile.json5（工程级）
   - hvigor-config.json5
   - hvigorfile.ts（工程级）
   - package.json
   - oh-package.json5
   - entry/build-profile.json5
   - entry/hvigorfile.ts
   - entry/oh-package.json5
   - entry/src/main/module.json5
   - entry/src/main/resources/base/element/string.json
   - entry/src/main/resources/base/element/color.json
   - entry/src/main/resources/base/profile/main_pages.json
   - AppScope/app.json5
   - AppScope/resources/base/element/string.json

5. 复制或创建源码
   - EntryAbility.ets
   - Index.ets
   - icon.png（从 SDK 或其他项目复制）

6. 创建 IDE 缓存目录（可选，防止 Studio 报非致命错误）
   mkdir -p .idea
   mkdir -p .deveco
```

### 5.2 使用 DevEco Studio 的正确打开方式

1. **不要直接双击打开项目** → 先关闭当前项目再 Open
2. 如果弹出 "Upgrade project" 对话框 → **让 DevEco 自动升级配置**，不要 Cancel
3. 项目同步完成后（右下角 ✓ Sync Finished）再看 Run 按钮
4. 如果 Run 按钮仍然灰的 → 检查设备配置（需要模拟器或真机）

---

## 6. Canvas 绑定常见错误

OpenHarmony 的 Canvas API 与 Web API 略有不同：

### 6.1 Context 初始化
```typescript
// ✅ 正确：启用抗锯齿
private settings: RenderingContextSettings = new RenderingContextSettings(true);
private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings);

// ❌ 错误：直接 new
private context: CanvasRenderingContext2D = new CanvasRenderingContext2D();
```

### 6.2 lineCap 属性
```typescript
// ✅ 正确：使用字符串
ctx.lineCap = "round";
ctx.lineCap = "butt";
ctx.lineCap = "square";

// ❌ 错误：使用 RoundCap 枚举（OpenHarmony 没有这个枚举）
ctx.lineCap = RoundCap.Round;  // 编译报错
```

---

## 7. 常见错误速查表

| 错误信息 | 根因 | 解决方案 |
|---|---|---|
| `ENOENT: @ohos/hvigor/bin/hvigor.js` | hvigor 缓存 symlink 指向错误路径 | 删除 `~/.hvigor/project_caches/<hash>/workspace` 重新构建 |
| `exclusiveMinimum: compileSdkVersion must be > 7` | `compileSdkVersion: 5` 太旧 | 改为 `10`（OpenHarmony 5.0） |
| `modules must be an array` | DevEco 升级后要求 modules 字段 | 在 build-profile.json5 的 app 对象外添加 `modules: [{ "name": "entry", "srcPath": "./entry" }]` |
| `Missing file "oh-package.json5"` | 项目根目录缺 oh-package.json5 | 创建空的 `oh-package.json5` |
| `@ohos/xxx not found from registry` | 系统 API 误写在 dependencies 里 | 删除 oh-package.json5 中对 `@ohos/*` 的依赖，系统 API 不需要安装 |
| `Run 按钮灰色` | 没有可用设备 | 启动模拟器或连接真机 |
| `hvigorw 报 shell 语法错误` | DevEco 的 hvigorw.js 解析问题 | 这是 IDE 误报，不影响实际构建 |
| `Schema validate failed at build-profile.json5` | 配置格式不符合当前 hvigor 版本规范 | 对照官方文档修正 JSON5 格式 |

---

## 8. API 版本与 SDK 版本对照

| OpenHarmony 版本 | compileSdkVersion | DevEco Studio 版本 |
|---|---|---|
| 5.0 | 10 | 5.0.3+ |
| 4.1 | 9 | 4.1+ |
| 4.0 | 8 | 4.0+ |
| 3.2 | 7 | 3.1+ |

**小黒的课程项目使用 OpenHarmony 5.0 → `compileSdkVersion: 10`**

---

## 9. 从 DevEco Studio 角度看项目是否合法

DevEco Studio 识别项目的条件（按优先级）：
1. 根目录有 `build-profile.json5` 和 `hvigor-config.json5`
2. `hvigor-config.json5` 使用 `modelVersion: "6.21.1"` 格式（旧版 `hvigor: "2.x"` 可能触发升级提示）
3. entry 模块的 `module.json5` 存在且 `name` 字段有效
4. 至少有一个 `.ets` 或 `.ts` 源文件
5. 资源文件目录结构完整（即使为空也可以）

**只要满足这些条件，Studio 就会显示项目并启用 Run 按钮。**

---

## 10. DevEco Studio 项目迁移

当用新版 DevEco 打开旧版项目时，会弹出 "Upgrade project" 对话框。迁移内容通常包括：
- `build-profile.json5` 的 SDK 版本格式更新
- `hvigor-config.json5` 的 modelVersion 格式
- `module.json5` 的 schema 版本

**不要手动阻止升级**，让 DevEco 自动处理。迁移后建议验证：
1. `compileSdkVersion` 是否为有效值
2. `hvigor-config.json5` 的 `modelVersion` 是否为 `"6.21.1"`
3. `modules` 数组是否正确（如果 Studio 要求的话）

---

## 11. 最佳实践

1. **始终用 DevEco Studio 创建新项目** → 获得完整正确的目录结构和配置文件
2. **工具链文件（hvigor/hvigor-ohos-plugin）从 DevEco Studio SDK 复制**，不要从 npm 安装
3. **不要在 oh-package.json5 的 dependencies 里声明系统 API**（`@ohos/*`），这些已经内置在 SDK 中
4. **修改项目路径后删除 hvigor 缓存**：`rm -rf ~/.hvigor/project_caches/`
5. **不要手动修改 `.idea` 和 `.deveco` 目录**，这些是 Studio 的内部缓存
6. **用 DevEco Studio 的 GUI 而非 CLI** 来运行和调试项目
7. **创建项目后立即用 Git 管理**，方便追踪配置变更
