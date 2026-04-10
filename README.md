# SBTI-PRO 人格测试

> **MBTI 已经过时，SBTI 来了。**

[![Deploy](https://img.shields.io/badge/deployed-sbti.ytht.io-517CA8?style=flat-square&logo=cloudflare)](https://sbti.ytht.io)
[![License](https://img.shields.io/badge/license-非商业-lightgrey?style=flat-square)](#license)
[![Version](https://img.shields.io/badge/version-3.0.0-brightgreen?style=flat-square)](#版本历史)

**在线体验：[sbti.ytht.io](https://sbti.ytht.io)**

本项目是 [蛆肉儿串儿](https://space.bilibili.com/417038183) 原创 SBTI 人格测试的 **Pro 版**，在保留原版测试内容与算法的基础上，进行了全面的功能增强和移动端优化。

---

## 什么是 SBTI

SBTI（Soul Bytes Type Indicator）是一套基于 **17 个心理维度**、涵盖 **38+ 种人格类型** 的电子时代人格测试。

| 维度模块 | 维度 |
|---------|------|
| 自我模型 | S1 自尊自信 · S2 自我清晰度 · S3 核心价值 |
| 情感模型 | E1 依恋安全感 · E2 情感投入度 · E3 边界与依赖 |
| 态度模型 | A1 世界观倾向 · A2 规则与灵活度 · A3 人生意义感 |
| 行动驱力 | Ac1 动机导向 · Ac2 决策风格 · Ac3 执行模式 |
| 社交模型 | So1 社交主动性 · So2 人际边界感 · So3 表达与真实度 |
| 神经质·开放性 | N1 焦虑基线 · N2 探索开放 |

答完 41 道常规题（含 1 道隐藏触发题），系统会从 38 种标准人格 + 2 种特殊人格中为你计算最佳匹配。

---

## 38 种标准人格类型

| 代码 | 中文名 | 稀有度 | 代码 | 中文名 | 稀有度 |
|------|--------|--------|------|--------|--------|
| CTRL | 拿捏者 | 3.61% | FUCK | 草者 | 3.38% |
| ATM-er | 送钱者 | 2.46% | DEAD | 死者 | 2.50% |
| Dior-s | 屌丝 | 5.23% | IMFW | 废物 | 2.12% |
| BOSS | 领导者 | 1.53% | PULL | 暗控者 | — |
| THAN-K | 感恩者 | 7.76% | NOPE | 回避者 | — |
| OH-NO | 哦不人 | 3.05% | LOOP | 死循环者 | — |
| GOGO | 行者 | 3.05% | RUST | 内腐者 | — |
| SEXY | 尤物 | 5.94% | CLOS | 封闭者 | — |
| LOVE-R | 多情者 | 4.23% | CLIN | 黏附者 | — |
| MUM | 妈妈 | 5.14% | MASK | 无感面具 | — |
| FAKE | 伪人 | 6.61% | WIRE | 高压线 | — |
| OJBK | 无所谓人 | 9.92% | FAWN | 讨好者 | — |
| MALO | 吗喽 | 5.71% | ECHO | 回声室 | — |
| JOKE-R | 小丑 | 2.99% | DRIFT | 漂流者 | — |
| WOC! | 握草人 | 2.04% | KEEN | 探索狂 | — |
| THIN-K | 思考者 | 2.24% | MIST | 焦虑虚空 | — |
| SHIT | 愤世者 | 2.53% | ZZZZ | 装死者 | 4.68% |
| POOR | 贫困者 | 1.68% | MONK | 僧人 | 2.80% |
| IMSB | 傻者 | 4.21% | SOLO | 孤儿 | 3.72% |

> `DRUNK` 和 `HHHH` 为特殊人格，由特定答题组合触发。稀有度数据来自 [sbti-wiki](https://github.com/serenakeyitan/sbti-wiki)。

---

## Pro 版功能

### v3.0 新增
- **17 个维度** — 新增 N1 焦虑基线 + N2 探索开放（填补 Big Five 空白）
- **38 种人格** — 8 个亚型分裂 + 5 个全新填补类型
- **41 道题目** — 含 2 道新维度题 + 7 道亚型鉴别题
- **sbti-wiki 数据** — 稀有度、一句话简介来自 [serenakeyitan/sbti-wiki](https://github.com/serenakeyitan/sbti-wiki)
- **图生图** — 新类型图片通过通义万相生成

### 分享功能
- **URL 分享** — 结果写入 `location.hash`（如 `#CTRL`），直接打开可查看他人结果
- **生成分享图片** — 750×1334 Canvas 卡片，含 QR 码（扫码直达 `sbti.ytht.io/#TYPECODE`）
- **OG/Twitter Meta** — 分享链接时展示卡片预览

### 移动端
- **一屏一题** — 选中后 280ms 自动进入下一题
- **触控优化** — `touch-action: manipulation` 消除 300ms 延迟

---

## 版本历史

### v3.0.0（2026-04-10）
- 维度扩展至 17 个（N1/N2）
- 类型扩展至 38 种（8亚型 + 5新增）
- 题目扩展至 41 道
- 整合 sbti-wiki 稀有度和一句话简介

### v2.1.0（2026-04-10）
- 分享图片加入人格描述正文
- 修复 SBTI 标题换行 + I/来 字符碰撞
- 友情链接改为竖排，CSS 对齐 NCB 色彩系统

### v2.0.0（2026-04-10）
- Apple 风格全屏 Hero、手风琴人格展示、Bebas Neue 艺术字
- 分享图片 + QR 码功能
- Cloudflare Pages 自动部署

### v1.0.0（2026-04-10）
- 原版测试内容完整保留

---

## 技术栈

| 项目 | 方案 |
|------|------|
| 前端 | 单文件 HTML（CSS + Vanilla JS，无框架） |
| QR 码 | qrcode-generator v1.4.4（CDN） |
| 字体 | Google Fonts · Bebas Neue |
| 部署 | Cloudflare Pages（免费） |
| 域名 | `sbti.ytht.io` |
| CI/CD | GitHub Actions → Cloudflare Pages API |

---

## 本地运行

```bash
git clone https://github.com/yupoet/SBTI-PRO.git
cd SBTI-PRO
open index.html
```

---

## 致谢

- **原作者** [B站@蛆肉儿串儿](https://space.bilibili.com/417038183)（[原版视频介绍](https://www.bilibili.com/video/BV1LpDHByET6/)）——测试题目、27 种人格类型与全部描述文案均源自原作，版权归原作者所有
- **SBTI Wiki** [serenakeyitan/sbti-wiki](https://github.com/serenakeyitan/sbti-wiki) —— 提供稀有度数据、人格金句与一句话简介，遵循 CC BY-NC-SA 4.0
- **友情链接** [一塌糊涂 BBS](https://bbs.ytht.io) · [修仙 MUD](https://game.ytht.io)

---

## License

本项目内容（题目、人格描述文案）版权归原作者所有，**不得商业使用**。  
代码部分（Pro 版新增功能）以 MIT 协议开源。
