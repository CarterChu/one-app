# 安能光伏 · 代理商端 ONE App(H5 原型)

基于安能 **ADesign H5 组件库(`a-design-h5`)** 的 Vue3 移动端原型,作为正式开发起点,
从 Figma 设计稿逐屏还原,交互为真。飞检四块已打通:**列表 / 执行 / 详情 / 转办**,
其中「执行飞检」「详情」各有**两套方案**,用于 A/B 用户测试。

## 启动

```bash
npm install          # 已配 .npmrc 指向私有源 https://npm.chintanneng.com/
npm run dev          # 默认 http://localhost:5173
```

手机预览:局域网 IP 访问,或浏览器 DevTools 移动模拟。下方链接里的 `localhost:5173`
换成你的实际地址(本机 IP / 部署域名)。

---

## 🔗 测试链接(最常用,看这里就够)

### ① 给受访者做正式测试(干净,无切换开关)

| 发给哪组 | 链接 |
|---|---|
| **A 组 → 方案一** | `…/#/inspection` |
| **B 组 → 方案二** | `…/#/inspection?scheme=2` |

受访者点列表里的「执行飞检 / 详情」即自动在对应方案内走完,不会看到任何方案开关。

### ② 自己看 / 对比 / 导数据(带开关)

```
…/#/inspection?dev=1
```

进去后右下角悬浮面板:**方案一/方案二**随意翻、**导出CSV**、**清空**。

> 一句话:测试发 2 条(`#/inspection` 与 `#/inspection?scheme=2`);自己用 1 条(`#/inspection?dev=1`)。
> 执行页、详情页都靠点按钮进入,**不用记 URL**。

---

## 完整路由表(备查)

| 页面 | 路由 | 怎么到 |
|---|---|---|
| 飞检列表 | `/#/inspection` | 直接开 |
| 执行·方案一(长列表式) | `/#/inspection/execute/:id` | 列表点「执行飞检」 |
| 执行·方案二(向导式) | `/#/inspection/execute-v2/:id` | 列表(scheme=2)点「执行飞检」 |
| 详情·方案一(Tab 式) | `/#/inspection/detail/:id` | 列表点「详情」 |
| 详情·方案二(单页式) | `/#/inspection/detail-v2/:id` | 列表(scheme=2)点「详情」 |

**URL 参数开关**(加在列表链接后):
- `?scheme=2` —— 该链接进入方案二(默认方案一)
- `?dev=1` —— 显示悬浮方案开关 + 导出面板;`?dev=0` 关闭(状态存 localStorage)

---

## A/B 测试:数据采集

执行飞检 v1/v2 页已内置**行为埋点**(纯本地 localStorage,不接外部服务)。
受访者走完一次并「确认提交」即记一条,`?dev=1` 面板「导出CSV」下载(带 BOM,Excel 中文正常)。

### CSV 字段 → 对应指标

| 指标 | CSV 列 |
|---|---|
| 任务完成时间 | `durationSec`(进入执行页 → 确认提交) |
| 改动/返回次数 | `reedits`(改已答项)、`backClicks`(方案二返回)、`previewOpens`、`jumps` |
| 错误率 | `errorRate` + `missedDefect`(漏判)/`falseAlarm`(误判)/`correct`/`scored` |
| 原始作答 | `answers`(每项 JSON,可重新比对任意剧本) |
| 其他 | `scheme`、`result`、`totalItems`、`answered`、起止时间 |

### 测试剧本(ground truth)

`src/mock/scenario.ts` 定义这座电站「实际存在的缺陷项」。系统自动比对受访者作答,
算出漏判/误判/错误率。

- **改剧本**:只改 `DEFECT_IDS`(哪些检查项应为「不合格」)。
- 当前缺陷项:c2 支架腐蚀 / c9 汇流箱内部接线 / c18 断路器选型接线 / c23 接地电阻。
- `DEFECT_BRIEF` 是给主持人设定情境的话术清单。

> 注:两套方案都强制答完才可提交,故「提交时漏项」通常为 0;质量差异看 `errorRate`。
> 定量指标(时间/错误率/主观量表)每套方案建议 20–30 人;主观用 SEQ + SUS + NASA-TLX。

---

## 已实现页面

- **飞检列表**(`飞检列表页`):状态 Tab(带计数)、搜索、电站地址省市级联、飞检日期周期/自定义筛选、下拉加载。
- **执行飞检·方案一**(`执行飞检方案一`):Tab(基本信息/检查项目)+ 长列表,分组吸顶 + 底部锚点 + 全部分组弹窗 + 提交确认弹窗。
- **执行飞检·方案二**(`执行分检方案二`):向导式,基本信息→逐项(进度条+合格/不合格全宽)→预览全部→飞检结果整页。
- **详情·方案一**(`飞检详情页方案一`):Tab 式只读。
- **详情·方案二**(`飞检详情页方案二`):单页式(电站卡 + 全部项只读,点卡进基本信息)。
- **转办**(`转办`):执行飞检页右上角 → 转办弹窗 + 选择新负责人(搜索/单选/空态)。

---

## 目录结构

```
src/
├─ pages/inspection/
│  ├─ InspectionListPage.vue          列表主页(按 scheme 决定进 v1/v2)
│  ├─ ExecuteInspectionPage.vue       执行·方案一
│  ├─ ExecuteInspectionV2Page.vue     执行·方案二(stage 状态机)
│  ├─ DetailPage.vue                  详情·方案一
│  ├─ DetailV2Page.vue                详情·方案二
│  ├─ components/                     列表/筛选/转办等共享组件
│  ├─ execute/                        执行飞检子组件(BasicInfoTab/ChecklistTab/ChecklistItem/PhotoUpload/弹窗)
│  └─ execute2/                       方案二专属(StationCard/WizardItem)
├─ stores/
│  ├─ scheme.ts                       方案切换 + ?dev 开关
│  └─ tracker.ts                      A/B 行为埋点 + CSV 导出
├─ components/SchemeSwitcher.vue      悬浮方案开关(仅 ?dev=1)
├─ mock/                              mock 数据(inspections / executeInspection / detailInspection / people / scenario)
├─ types/                             数据模型
└─ router/index.ts                   路由
```

---

## 开发约定

1. 新页面放 `src/pages/<模块>/`,在 `src/router/index.ts` 注册路由。
2. **用 `a-design-h5` 组件**;分组按钮用 `a-button-group`,按钮**不要覆盖 radius**(标准 12px)。
3. 筛选单选 / 分段 / 合格不合格切换**自绘选中态**,勿用 `a-radio-group`(点击失效)。
4. CSS 引入是 `import "a-design-h5/style.css"`(不是 `/dist/style.css`)。
5. mock 数据先在 `src/mock/` 造,形状对齐 `types/`,后续替换真实接口。
