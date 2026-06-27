# OpenHarmony 开发经验总结

> 最后更新：2026-03-26（BMI 项目迁移实战后全面更新）

---

## ⚠️ 最重要的经验教训

### 1. 不要在用户决策前擅自行动

**这次犯的错：** 用户说没有 DevEco Studio for OpenHarmony，我直接信了，然后开始改文件；用户删掉 DevEco 后，我还继续改项目文件——改完了他也用不了。

**正确做法：** 用户提出疑问 → 先确认实际情况 → 提出方案 → 等用户确认同意后再操作。

### 2. DevEco 安装错了不需要重装

**这次犯的错：** 看到 "No module found" 后，推荐用户删 DevEco 和 1.1GB SDK 重装。实际上问题不在 DevEco 版本，而在**项目本身需要迁移**。

**正确做法：** 先搜索错误信息，找到了 `Migrate Assistant` 迁移工具就能解决根本问题，不需要重装任何东西。

### 3. OpenHarmony 项目结构的核心关键

**DevEco 识别模块的核心逻辑：**
- 根 `build-profile.json5` 里必须有 **`modules` 数组**，声明每个模块的 `name` 和 `srcPath`
- 如果缺少 `modules` 数组，DevEco 的 projectModel 就是 null，同步必然失败
- `module.json5` 的内容本身反而不是第一位的——DevEco 先解析 `build-profile.json5` 的 modules 列表，再去找对应的 `module.json5`

---

## 📁 项目结构关键文件清单

### 根目录（必须存在）

| 文件 | 作用 |
|------|------|
| `build-profile.json5` | **必须包含 `modules` 数组**，声明所有模块 |
| `hvigor-config.json5` | hvigor 构建配置 |
| `hvigorfile.ts` | 导出构建任务 |
| `package.json` | 项目元信息 |
| `oh-package.json5` | OHPM 包描述 |
| `local.properties` | SDK 路径（`sdk.dir`） |

### entry 模块（必须存在）

| 文件 | 作用 |
|------|------|
| `src/main/module.json5` | 模块配置（module 类型、abilities、pages） |
| `src/main/ets/entryability/EntryAbility.ets` | 入口 Ability |
| `src/main/ets/pages/Index.ets` | 首页 |
| `src/main/resources/base/profile/main_pages.json` | 页面路由 |
| `hvigorfile.ts` | 导出 `hapTasks` |
| `oh-package.json5` | 模块包描述 |
| `build-profile.json5` | 模块级构建配置 |

### 注意：不存在的文件

- **`oh-uni-package.json`** — 这个文件不存在于 OpenHarmony 项目中，是 SDK 内部文件，不能手动创建
- **`build.gradle`** — 新版 hvigor 不使用 build.gradle，用 `build-profile.json5` + `hvigorfile.ts` 代替

---

## 🔧 build-profile.json5 正确格式

### 根目录格式（必须有 modules）

```json5
{
  "app": {
    "products": [{
      "name": "default",
      "signingConfig": "default",
      "compileSdkVersion": 10,
      "compatibleSdkVersion": 10
    }]
  },
  "modules": [
    {
      "name": "entry",
      "srcPath": "./entry",
      "targets": [{
        "name": "default",
        "applyToProducts": ["default"]
      }]
    }
  ]
}
```

### 模块目录格式（hvigor 3.x+）

```json5
{
  "apiType": "stageMode",
  "buildOption": {},
  "targets": [{ "name": "default" }]
}
```

---

## 🔧 hvigor-config.json5 格式变迁

### 旧版格式（会报错）

```json5
{
  "modelVersion": "6.0.1",
  "models": [{ "name": "default", "tools": { "hvigorVersion": "3.4.0" } }]
}
```

### 新版格式（必须）

```json5
{
  "modelVersion": "6.0.1",
  "dependencies": {},
  "execution": {},
  "logging": {},
  "debugging": {}
}
```

如果遇到 `Schema validate failed... must have required property 'dependencies'`，就是这个文件格式不对。

---

## ArkTS 严格模式常见错误

### 1. @State 变量名不能是组件内置属性名

```typescript
// ❌ 错误：height 是 Component 内置属性
@State height: number = 170;

// ✅ 正确：改名避免冲突
@State bodyHeight: number = 170;
```

### 2. 生命周期方法签名（OpenHarmony 10+）

```typescript
// ❌ 旧版（多余参数）
onCreate(want, launchParam) { ... }
onDestroy(want, launchParam) { ... }

// ✅ 新版（无参数）
onCreate() { ... }
onDestroy() { ... }

// ❌ loadContent 回调不能直接用对象字面量做类型
windowStage.loadContent('pages/Index', (err: { code: number }) => { ... });

// ✅ 用 try-catch 代替回调
windowStage.loadContent('pages/Index');
```

### 3. 不能用对象字面量作为类型声明

```typescript
// ❌ ArkTS 严格模式不允许
(err: { code: number }) => { ... }

// ✅ 改用 try-catch 或已声明的类型
```

### 4. 系统图标名称变更

```typescript
// ❌ 旧版名称，新版 SDK 不存在
$r('sys.media.ohos_ic_public_heart')
$r('sys.media.ohos_ic_public_favorites')

// ✅ 改用 emoji 或自定义图片资源
Text('❤️')
Image($r('app.media.icon'))
```

### 5. 对象字面量做类型声明

```typescript
// ❌ ArkTS 严格模式不允许对象字面量作为类型
animateTo({ duration: 400, curve: Curve.EaseOut }, () => { ... });
```

---

## 🚀 OpenHarmony 工程迁移流程

当 DevEco 提示 `工程结构及配置需要升级后才能使用` 时：

1. **不要重装 DevEco** — 迁移工具能解决
2. **使用 Migrate Assistant**：`Tools → Migrate Assistant`，或点击 Notifications 里的 Actions
3. 迁移会自动修改：
   - `hvigor-config.json5` 格式
   - `deviceTypes` 字段（`phone` → `default`）
   - 其他结构差异
4. 迁移后手动检查残留的旧格式问题（如本案例中的 `hvigor-config.json5`）

---

## 🗑️ 删除 DevEco 后的清理路径

如果确实需要重装，删除以下路径：

| 路径 | 大小 | 说明 |
|------|------|------|
| `/Applications/DevEco-Studio.app` | — | 主程序 |
| `~/Library/Application Support/Huawei/DevEcoStudio6.0/` | ~67MB | 配置 |
| `~/Library/Caches/Huawei/DevEcoStudio6.0/` | ~353MB | 缓存 |
| `~/Library/Logs/Huawei/DevEcoStudio6.0/` | — | 日志 |
| `~/Library/OpenHarmony/` | ~1.1GB | **SDK + 模拟器** |

---

## DevEco Studio 版本说明

- **DevEco Studio**（华为消费应用）= HarmonyOS 应用开发
- **DevEco Studio for OpenHarmony**（开源）= OpenHarmony 应用开发
- 两者界面几乎一样，区别在于内置 SDK 和项目模板
- **统一下载地址**：https://developer.huawei.com/consumer/en/download/
- 项目能不能跑取决于 SDK 版本和项目 API 版本是否匹配，不是 IDE 版本号

---

## 项目路径

- **当前问题项目**：`/Users/Ymir/Documents/trae_projects/OpenHarmony/bmilxf202404020218/`
- **作业目录**：`/Users/Ymir/Documents/trae_projects/`

---

## 相关文件

- BMI 计算器：`bmilxf202404020218/entry/src/main/ets/pages/Index.ets`
- EntryAbility：`bmilxf202404020218/entry/src/main/ets/entryability/EntryAbility.ets`
- 根构建配置：`bmilxf202404020218/build-profile.json5`
- 模块构建配置：`bmilxf202404020218/entry/build-profile.json5`
- Hvigor 配置：`bmilxf202404020218/hvigor/hvigor-config.json5`

---

## UI 布局设计（BMI 计算器实战）

### 单屏适配原则

目标：不依赖滚动，一个屏幕内展示完整内容。

**布局层次：**
```
Column(height:100%)
  ├── Column(height:固定值) → 渐变顶部背景
  └── Scroll(layoutWeight:1) → 占据剩余空间
        └── Column → 内容区（padding控制边距）
              ├── BMI大数字展示
              ├── 健康建议卡
              ├── 身高体重滑块
              └── BMI参考表格
```

**关键：**
- 外层 Column 不写 height，内容自然撑开
- Scroll 用 `layoutWeight(1)` 填满除顶部背景外的所有空间
- 顶部背景固定高度，内容区不蹭入背景

### BMI 计算器最终设计

- 大字体 BMI 数字（64px）+ 等级标签 + 身高体重文字
- 健康建议卡片（白色圆角 + 阴影）
- 两个 Slider 上下排列（带数值标签和两端 min/max 文字）
- Grid 2x2 做 BMI 参考表格
- 整体背景色 `#F6F8FF`，卡片白色

### 避开的坑

1. `EdgeEffect.Spring` 导致滚动自动弹回 → 改用 `EdgeEffect.None`
2. 渐变背景用 `height('100%')` 撑大 Stack → 固定 px 高度
3. Row/Column 构造参数里写 justifyContent → 链式调用
4. 健康建议不显示 → 简化结构排查

---

## 🆕 2026-04-02 新增：旋转风车项目踩坑总结

### 教训1：DevEco 无法识别项目的两个致命原因

**原因A：根目录 `hvigorfile.ts` 缺失**
- 这是 DevEco 识别项目根目录的核心文件
- 必须内容：`import { appTasks } from '@ohos/hvigor-ohos-plugin'; export default { system: appTasks, plugins: [] };`
- 手动创建项目时经常漏掉这个文件

**原因B：`hvigor/` 是 symlink 而非真实目录**
- 错误做法：从 DevEco 安装目录做符号链接 `ln -s /Applications/DevEco-Studio.app/Contents/tools/hvigor ./hvigor`
- 正确做法：`hvigor/` 必须是普通目录，里面只放 `hvigor-config.json5`

### 教训2：`module.json5` 缺少 `deviceTypes` 导致 BUILD FAILED

**症状：**
```
Error: Unable to obtain the module deviceTypes.
```

**必须包含的字段：**
```json5
{
  "module": {
    "name": "entry",
    "type": "entry",
    "mainElement": "MainAbility",      // 主 Ability 名称
    "deviceTypes": ["phone"],           // ⚠️ 必须有，否则编译失败
    "pages": "$profile:main_pages",     // ⚠️ 必须有
    "deliveryWithInstall": true,
    "installationFree": false,
    "abilities": [{
      "name": "MainAbility",
      "srcEntry": "./ets/entryability/EntryAbility.ets",
      ...
    }]
  }
}
```

### 教训3：`main_pages.json` 放错目录导致编译失败

**症状：**
```
Error: Config Error. Invalid node name 'src'.
Valid values: ["boolean","color","float","id","integer","pattern","plural","strarray","string","symbol","theme"]
```

**原因：** `main_pages.json` 错误地放在了 `resources/base/element/` 下

**正确位置：** `resources/base/profile/main_pages.json`

### 教训4：`.preview/` 目录损坏导致白屏

**症状：** Previewer 和模拟器都显示白屏，但 Build 成功，无报错

**原因：** `.preview/` 目录被删除或结构损坏（嵌套了 `.preview/.preview/`），里面的配置路径还指向旧项目

**修复方法：**
1. 从能正常 Preview 的项目（MyApplication）复制 `.preview/` 目录
2. 更新 `PreviewBuildParam.json` 和 `config/buildConfig.json` 中的所有路径
3. 或者更简单：**关闭 DevEco，然后重新打开目标项目**，DevEco 会自动重新生成

**`.preview/` 正常结构：**
```
entry/.preview/
├── PreviewBuildParam.json    # 包含项目路径（APP_RESOURCES、MODULE_RESOURCES 等）
├── config/
│   └── buildConfig.json      # 包含 localPropertiesPath、aceModuleRoot 等路径
└── default/
    ├── generated/
    ├── intermediates/
    └── cache/
```

### 教训5：每次创建项目必须包含的配置清单

| 文件 | 位置 | 必须性 |
|------|------|--------|
| `hvigorfile.ts` | 根目录 | 必须 |
| `hvigor/` | 根目录（普通目录，非 symlink） | 必须 |
| `hvigor-config.json5` | `hvigor/` 内 | 必须 |
| `build-profile.json5` | 根目录（含 modules[]） | 必须 |
| `oh-package.json5` | 根目录 | 必须 |
| `local.properties` | 根目录 | 必须 |
| `AppScope/app.json5` | AppScope 内 | 必须 |
| `entry/build-profile.json5` | entry 内 | 必须 |
| `entry/hvigorfile.ts` | entry 内 | 必须 |
| `entry/src/main/module.json5` | 含 deviceTypes、pages、mainElement | 必须 |
| `entry/src/main/ets/entryability/EntryAbility.ets` | 含 loadContent | 必须 |
| `entry/src/main/ets/pages/Index.ets` | 入口页面 | 必须 |
| `entry/src/main/resources/base/profile/main_pages.json` | 路由配置 | 必须 |

### 教训6：最可靠的项目创建流程

1. 在 DevEco 里 **New Project** 创建空项目（选 OpenHarmony Stage 模型）
2. DevEco 会生成 100% 正确的项目结构
3. 把 `pages/Index.ets` 替换成自己的代码
4. **不要删除 `.preview/` 目录**
5. **不要手动创建 hvigor 相关文件**（从 DevEco New Project 生成的结构出发）

### 教训7：白屏排查流程

1. 新建空项目 → Preview 能显示？→ YES = 项目配置问题，NO = DevEco/模拟器问题
2. 检查 `.preview/` 目录是否损坏/嵌套
3. 检查 `module.json5` 的 `deviceTypes`、`pages`、`mainElement`
4. 检查 `main_pages.json` 是否在 `profile/` 目录
5. 清理 build 缓存：`rm -rf entry/build build`，重新 Rebuild
6. 检查 `loadContent('pages/Index')` 路径和文件名是否匹配

---

## 🆕 2026-04-06 新增：二维码生成器项目（lxf202404020218erweima）

### 项目路径
`/Users/Ymir/DevEcoStudioProjects/lxf202404020218erweima/`

### 教训1：@kit.qrcode 包不存在于 ohpm

**症状：**
```
Error: ParsePkg fail, package "@kit.qrcode@1.0.0"
Error Message: Name can only contain URL-friendly characters
```

**原因：** `@kit.qrcode` 在 ohpm 仓库中不存在，无法通过 ohpm 安装

**解决方案：** 不使用 `@kit.qrcode`，改用：
1. **ArkUI 内置 QRCode 组件**（推荐）：`<QRCode value="内容" color="#000000" />`，完全不需要任何包
2. **HTTP API**：`@ohos.net.http` 请求在线 QR 生成 API（如 `api.qrserver.com`），但需要网络权限且模拟器可能无法访问外网

### 教训2：HTTP 请求的正确用法（@ohos.net.http）

```typescript
import http from '@ohos.net.http';

// 正确写法
const httpRequest = http.createHttp();
const result = await httpRequest.request(url, {
  method: http.RequestMethod.GET,           // 用 enum 值，不是字符串
  expectDataType: http.HttpDataType.ARRAY_BUFFER, // ARRAY_BUFFER = 2
  readTimeout: 10000                      // 注意：是 readTimeout，不是 timeout
});
if (result.responseCode === 200) { ... }  // responseCode 是数字
httpRequest.destroy();
```

**常见错误：**
- `timeout` → 应为 `readTimeout`
- `http.HttpDataType.ARRAY_BUFFER` → 写成数字 `2` 或 `http.HttpDataType.ARRAY_BUFFER`
- `method: 'GET'` → 应为 `method: http.RequestMethod.GET`
- `ResponseCode.OK` → 直接用数字 `200`

### 教训3：网络权限的正确配置

```json5
// module.json5 中
{
  "module": {
    "requestPermissions": [   // 注意：是 requestPermissions，不是 reqPermissions
      { "name": "ohos.permission.INTERNET" }
    ]
  }
}
```

### 教训4：ArkUI 内置 QRCode 组件用法

```typescript
// 基础用法（无需任何 import）
QRCode('要生成的内容')
  .width(200)
  .height(200)
  .color('#000000')
  .backgroundColor('#FFFFFF')
  .contentOpacity(1)

// 尺寸动态
const size: number = 200;
QRCode(content)
  .width(size)
  .height(size)

// 颜色选择（6种）
const colors: string[] = ['#000000', '#1E3A8A', '#DC2626', '#16A34A', '#F97316', '#9333EA'];
QRCode(content).color(colors[index])
```

### 教训5：布局问题修复

**问题1：Scroll 内二维码超出屏幕且不能滚动**
- 原因：`width()` + 固定 px 高度，超出屏幕固定布局
- 修复：`width('100%')` + `aspectRatio(1)` 让二维码自适应屏幕宽度

**问题2：Select 下拉选项文字截断（显示"小..."而不是"小 (100×100)"）**
- 原因：Select 组件默认宽度不够
- 修复：改用自定义按钮组替代 Select
```typescript
// ❌ Select 会截断
Select([{ value: '小 (100×100)' }])

// ✅ 自定义按钮组，完整显示
Row({ space: 8 }) {
  ForEach(['100', '200', '300'], (label: string, index: number) => {
    Column() {
      Text(label + 'px')
    }
    .width(80)
    .height(40)
    .backgroundColor(selectedIndex === index ? '#2979FF' : '#F0F0F0')
    .onClick(() => { selectedIndex = index; })
  })
}
```

**问题3：颜色色块溢出屏幕**
- 原因：6 个 30px 色块 + 间距超过屏幕宽度
- 修复：缩小到 28px，间距调整为 10px

### 教训6：ArkTS 严格模式常见编译错误

| 错误 | 原因 | 解决 |
|------|------|------|
| `Cannot read properties of undefined (reading 'text')` | ets 转换器崩溃，可能是使用了不存在的 API | 检查 @kit 导入是否正确 |
| `'method' does not exist in type 'AsyncCallback'` | HTTP 请求参数写错了 | 确认 `method` 在 `HttpRequestOptions` 里，不是 `AsyncCallback` |
| `Type '"GET"' is not assignable to type 'RequestMethod'` | 用了字符串 `'GET'` 而不是 enum | 用 `http.RequestMethod.GET` |
| `Property 'responseCode' does not exist on type 'void'` | HTTP 返回类型推断失败 | 确保使用 Promise 形式 `request(url, options)` |
| `Property 'alignItems' does not exist on type 'StackAttribute'` | Stack 没有 alignItems | 用 `alignContent(Alignment.Center)` |
| `fontSize` does not exist on type 'SelectAttribute' | Select 不支持 fontSize | 不设置 Select 的 fontSize，改用自定义按钮 |

### 教训7：oh-package.json5 依赖管理

- 依赖写在里面：`{ "@kit.qrcode": "1.0.0" }`
- ohpm 安装失败会阻止编译
- **不确定的包不要写进去**，先用空 dependencies 跑通编译

### 教训8：module.json5 缓存问题

- DevEco 会缓存 `module.json5` 内容
- 如果编译报错说 `reqPermissions` 无效，但文件里明明是 `requestPermissions`
- 解决：File → Invalidate Caches → Invalidate and Restart，或手动删除 `.preview` 和 `build` 目录
