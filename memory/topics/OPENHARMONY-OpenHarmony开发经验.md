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
