# SBTI-PRO 人格测试

> **MBTI 已经过时，SBTI 来了。**

[![Deploy](https://img.shields.io/badge/deployed-sbti.ytht.io-517CA8?style=flat-square&logo=cloudflare)](https://sbti.ytht.io)
[![License](https://img.shields.io/badge/license-非商业-lightgrey?style=flat-square)](#license)
[![Version](https://img.shields.io/badge/version-2.1.0-brightgreen?style=flat-square)](#版本历史)

**在线体验：[sbti.ytht.io](https://sbti.ytht.io)**

本项目是 [蛆肉儿串儿](https://space.bilibili.com/417038183) 原创 SBTI 人格测试的 **Pro 版**，在保留原版测试内容与算法的基础上，进行了全面的功能增强和移动端优化。

---

## 什么是 SBTI

SBTI（Soul Bytes Type Indicator）是一套基于 **15 个心理维度**、涵盖 **27 种人格类型** 的电子时代人格测试。

| 维度模块 | 维度 |
|---------|------|
| 自我模型 | S1 自尊自信 · S2 自我清晰度 · S3 核心价值 |
| 情感模型 | E1 依恋安全感 · E2 情感投入度 · E3 边界与依赖 |
| 态度模型 | A1 世界观倾向 · A2 规则与灵活度 · A3 人生意义感 |
| 行动驱力 | Ac1 动机导向 · Ac2 决策风格 · Ac3 执行模式 |
| 社交模型 | So1 社交主动性 · So2 人际边界感 · So3 表达与真实度 |

答完 31 道题（含 1 道隐藏触发题），系统会从 25 种标准人格 + 2 种特殊人格中为你计算最佳匹配。

---

## 27 种人格类型

| 代码 | 中文名 | 代码 | 中文名 | 代码 | 中文名 |
|------|--------|------|--------|------|--------|
| CTRL | 拿捏者 | FREE | 自由人 | NICE | 老好人 |
| COLD | 冷漠者 | VOID | 虚无者 | LOST | 迷失者 |
| MASK | 伪装者 | SAGE | 智者 | WILD | 野生者 |
| BURN | 燃烧者 | FLOW | 流动者 | ROCK | 磐石者 |
| ECHO | 共鸣者 | NUMB | 麻木者 | ACHE | 隐痛者 |
| PLAY | 玩家 | SEEK | 探索者 | WALL | 壁垒者 |
| SHIT | 愤世者 | THAN-K | 感恩者 | GLUE | 黏合者 |
| PEAK | 巅峰者 | FLEX | 变形者 | BARE | 赤裸者 |
| ROOT | 根系者 | DRUNK | 🍺 隐藏人格 | HHHH | 系统兜底 |

> `DRUNK` 和 `HHHH` 为特殊人格，由特定答题组合触发。

---

## Pro 版新增功能

### 🐛 Bug 修复
- **THAN-K 无图片** — CSS 渐变 + 类型代码大字占位，优雅降级
- **Top 3 匹配未显示** — 结果页新增前三人格匹配卡片（相似度%）
- **DRUNK 次要人格** — 激活 DRUNK 时显示原始人格副卡
- **预览模式入口** — 首页新增"预览模式（显示维度标签）"按钮

### 🏠 首页升级
- **Apple 风格全屏 Hero** — 首屏完整展示标语，移动端 85dvh 留出内容预览
- **27 种人格手风琴展示** — 默认折叠，点击展开含图片/代码/简介/详情的卡片网格
- **SBTI 艺术字体** — Bebas Neue 加载，渐变色斜体渲染

### 📤 分享功能
- **URL 分享** — 测试结果写入 `location.hash`（如 `#CTRL`），直接打开链接可查看他人结果
- **生成分享图片** — 750×1334 Canvas 卡片，包含：
  - 人格类型图片（有图显示，无图跳过）
  - 类型代码 + 中文名 + 匹配度
  - 人格简介 + 详细描述
  - **QR 码**（扫码直达 `sbti.ytht.io/#TYPECODE`）
  - 适配微信长按保存到相册
- **OG/Twitter Meta** — 分享链接时展示卡片预览

### 📱 移动端优化
- **一屏一题** — 测试流程单题显示，选中后 280ms 自动进入下一题
- **上一题 / 下一题** 导航，进度实时更新
- **触控优化** — `touch-action: manipulation` 消除 300ms 延迟

### 🎨 视觉设计
- **NCB 双调色板** — 对齐项目 `docs/design/color-system.css`（`--pastel-*` / `--vivid-*`）
- **友情链接竖排** — 论坛 BBS · 修仙 MUD · Pro 版开源地址

---

## 版本历史

### v2.1.0（2026-04-10）
- 结果页移除"作者的话"折叠块
- 分享图片加入人格描述正文
- 修复 SBTI 标题换行 + I/来 字符碰撞
- 友情链接改为竖排，CSS 对齐 NCB 色彩系统

### v2.0.0（2026-04-10）
- 全面功能增强，见"Pro 版新增功能"
- 独立仓库 `yupoet/SBTI-PRO`，断开 fork 关联
- Cloudflare Pages 自动部署，绑定域名 `sbti.ytht.io`
- GitHub Actions CI：`git push` → CF Pages API → 自动上线

### v1.0.0（2026-04-10）
- Fork 自 `yupoet/SBTI-YTHT`
- 原版测试内容完整保留

---

## 技术栈

| 项目 | 方案 |
|------|------|
| 前端 | 单文件 HTML（CSS + Vanilla JS，无框架） |
| QR 码 | [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) v1.4.4（CDN） |
| 字体 | Google Fonts · Bebas Neue |
| 部署 | Cloudflare Pages（免费） |
| 域名 | `sbti.ytht.io`（Spaceship，自费） |
| CI/CD | GitHub Actions → Cloudflare Pages API |

---

## 本地运行

无需构建，直接打开即可：

```bash
git clone https://github.com/yupoet/SBTI-PRO.git
cd SBTI-PRO
open index.html   # 或用任意浏览器打开
```

---

## 致谢

- **原作者** [B站@蛆肉儿串儿](https://space.bilibili.com/417038183)（[原版视频介绍](https://www.bilibili.com/video/BV1LpDHByET6/)）——测试题目、27 种人格类型与全部描述文案均源自原作，版权归原作者所有
- **友情链接** [一塌糊涂 BBS](https://bbs.ytht.io) · [修仙 MUD](https://game.ytht.io)

---

## License

本项目内容（题目、人格描述文案）版权归原作者所有，**不得商业使用**。  
代码部分（Pro 版新增功能）以 MIT 协议开源。
