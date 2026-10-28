# 安能光伏 · 代理商端 ONE APP(H5 原型)

基于安能 **ADesign H5 组件库(`a-design-h5`)** 的 Vue3 移动端原型,作为正式开发起点。
从 Figma 设计稿逐屏还原,交互为真(搜索 / 状态切换 / 筛选下拉 / 下拉加载)。

## 技术栈

- Vue 3 + `<script setup>` + TypeScript
- Vite 构建,H5 移动端
- 组件库:`a-design-h5`(底层 Vant 4),私有源 `https://npm.chintanneng.com/`
- 路由:vue-router(hash 模式)

## 启动

```bash
npm install          # 已配 .npmrc 指向私有源
npm run dev          # 默认 http://localhost:5173
```

手机预览:`npm run dev` 后用局域网 IP 访问,或浏览器开 DevTools 移动模拟。

## 目录

```
src/
├─ pages/inspection/              飞检管理
│  ├─ InspectionListPage.vue      列表主页(导航/搜索/状态Tab/筛选/列表)
│  └─ components/
│     ├─ InspectionCard.vue        列表卡片(随飞检状态变化)
│     ├─ FilterBar.vue             筛选触发行 + 下拉浮层容器
│     ├─ AddressFilterPanel.vue    电站地址:省/市两级联动
│     └─ DateFilterPanel.vue       飞检日期:周期分段 + 自定义起止时间
├─ mock/inspections.ts            mock 数据 + 地区/Tab 配置
├─ types/inspection.ts            数据模型(接口形状预留)
└─ router/index.ts                路由(新页面往这里加)
```

## 已实现页面

- **飞检管理列表页**(Figma `飞检列表页`)
  - 状态 Tab:全部 / 待检查 / 通过 / 不通过(带计数)
  - 搜索:电站编号 / 业主姓名
  - 筛选:电站地址(省市级联)、飞检日期(周期 / 自定义范围)
  - 卡片按状态呈现:待检查显示「执行飞检」,已检显示缺陷统计 + 整改状态

## 新增页面约定

1. 在 `src/pages/<模块>/` 下建页面组件。
2. 在 `src/router/index.ts` 注册路由。
3. 复用 `a-` 组件;筛选类单选/分段用自绘选中态(勿用 `a-radio-group`)。
4. 接口数据先在 `src/mock/` 造,形状与 `types/` 对齐,后续替换为真实接口。
