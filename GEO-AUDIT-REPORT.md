# GEO 审计报告：SBTI 人格测试

**审计日期：** 2026-04-10  
**URL：** https://sbti.ytht.io/  
**业务类型：** 工具型娱乐应用（中文人格测试 SPA）  
**分析页数：** 1（单页应用，无 sitemap，无多页结构）

---

## 执行摘要

**总体 GEO 评分：39 / 100（Critical — 严重不足）**

SBTI 人格测试拥有极具原创性和趣味性的内容——38 种人格类型、17 个维度、41 道题目，叙述风格独特。然而在 GEO（生成式引擎优化）层面几乎完全不可见：**全部内容通过 JavaScript 在客户端渲染**，主流 AI 爬虫（GPTBot、ClaudeBot、PerplexityBot）执行时看到的是一个近乎空白的页面骨架。加之缺少 Schema.org 标记、llms.txt、robots.txt 和 sitemap，AI 系统无法提取、引用或推荐该站内容。最大短板是技术架构（SPA），修复成本较低但影响深远。

---

## 评分总览

| 类别 | 得分 | 权重 | 加权得分 |
|------|------|------|----------|
| AI 可引用性（Citability） | 42/100 | 25% | 10.5 |
| 品牌权威度（Brand Authority） | 32/100 | 20% | 6.4 |
| 内容 E-E-A-T | 62/100 | 20% | 12.4 |
| 技术 GEO 基础设施 | 34/100 | 15% | 5.1 |
| Schema & 结构化数据 | 8/100 | 10% | 0.8 |
| 平台优化 | 42/100 | 10% | 4.2 |
| **总体 GEO 评分** | | | **39 / 100** |

---

## 严重问题（Critical — 立即修复）

### C-1：全部内容 JS 渲染，AI 爬虫不可读 ⚠️

**影响范围：** 所有 AI 引用系统（GPTBot、ClaudeBot、Perplexity Bot）

当 AI 爬虫抓取 `https://sbti.ytht.io/` 时，收到的实际内容如下：

```html
<body>
  <div class="shell"><!-- 空 --></div>
</body>
```

所有 38 种人格描述、41 道测试题、17 个维度解释、稀有度数据——全部封装在 `TYPE_LIBRARY`、`questions` 等 JavaScript 常量里，运行时渲染。AI 爬虫不执行 JS，因此这些内容对 AI 系统完全不可见。

**修复方案：**
1. 在 `<head>` 中通过 JSON-LD 内联所有人格类型数据（零服务端改动，纯前端可实现）
2. 添加 `<noscript>` 静态 HTML 回退，列出 38 种类型的完整描述
3. 长期：迁移至静态站点生成（如 `sbti.ytht.io/types/CTRL` 等独立可抓取页面）

---

### C-2：零 Schema.org 标记

**影响范围：** 实体识别、FAQ 可引用性、AI 知识图谱

站内没有任何 `<script type="application/ld+json">` 块，缺失以下关键类型：

| 缺失的 Schema | 优先级 | 原因 |
|--------------|--------|------|
| `WebApplication` | 🔴 Critical | AI 无法将 SBTI 识别为可使用的工具/产品 |
| `Organization` | 🔴 Critical | "SBTI" 未被注册为命名实体，AI 无法与其他提及关联 |
| `FAQPage` | 🟠 High | 41 道题目内容与常见问题可大幅提升可引用性 |
| `CreativeWork` | 🟠 High | 框架的作者、授权、版本信息无结构化表达 |
| `Person`（作者） | 🟡 Medium | 原作者蛆肉儿串儿无 Schema 关联 |

---

## 高优先级问题（High — 1 周内修复）

### H-1：缺少 llms.txt

`/llms.txt` 文件不存在。这是 AI 系统（尤其是 Claude、Gemini）发现站点结构、理解内容用途的新兴标准信号。

**建议内容：**
```
# SBTI 人格测试

> SBTI（Soul Bytes Type Indicator）是基于 17 个心理维度、涵盖 38 种人格类型的电子时代人格测试。

## 站点说明
- 测试入口：https://sbti.ytht.io/
- 人格类型数量：38 种标准人格 + DRUNK、HHHH 两种特殊人格
- 测试题目数：41 道
- 维度数：17 个
- 语言：中文（简体）

## 原作者
蛆肉儿串儿（Bilibili：https://space.bilibili.com/417038183）
Pro 版开发：yupoet（https://github.com/yupoet/SBTI-PRO）

## 数据来源
稀有度数据与人格金句：sbti-wiki（https://github.com/serenakeyitan/sbti-wiki，CC BY-NC-SA 4.0）

## 使用政策
本站内容可被 AI 系统引用、摘要、对比分析；不得用于商业推荐或临床心理诊断；引用需标注来源 sbti.ytht.io
```

### H-2：缺少 robots.txt 和 sitemap.xml

站点未提供 `robots.txt`（默认允许，但无法引导爬虫优先级），也没有 `sitemap.xml`。即使是单页应用，也可以通过查询参数形式为每种人格类型创建可索引 URL：

```
sitemap.xml 中列出：
https://sbti.ytht.io/?type=CTRL
https://sbti.ytht.io/?type=FUCK
... （38 种）
```

### H-3：缺少 meta description 和 OG 标签

**现状：** 页面无 `<meta name="description">`，无 `og:title`、`og:description`、`og:image`、`og:url`。  
**影响：** 链接分享时无预览卡片，AI 系统从 URL 共享中获取的上下文为零。

```html
<!-- 建议添加到 <head> -->
<meta name="description" content="SBTI 人格测试 — 基于 17 个心理维度、38 种人格类型的电子时代人格测试。比 MBTI 更毒舌，更准。">
<meta property="og:title" content="SBTI 人格测试">
<meta property="og:description" content="17 维度 · 38 种人格 · 41 道题 · 测出你的真实底色">
<meta property="og:image" content="https://sbti.ytht.io/image/CTRL.png">
<meta property="og:url" content="https://sbti.ytht.io/">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

### H-4：多镜像域名导致权重分散

审计发现 SBTI 存在多个镜像部署（sbti.dev、sbti.pics、sbti.one、sbti.cam、sbti.jerryz.com.cn 等），每个镜像独立运行，互无 canonical 声明。AI 引用时无法确定权威来源，链接权重被 7+ 个域名瓜分。

**修复：** 在 `sbti.ytht.io` 添加 canonical 标签指向自身（或确认哪个域为主站后互相指向）：
```html
<link rel="canonical" href="https://sbti.ytht.io/">
```

---

## 中等优先级问题（Medium — 1 个月内处理）

### M-1：E-E-A-T 信号薄弱

- 无独立的 `/about` 页面
- 原作者仅在页面右下角以最小化形式出现，无简介、无资质说明
- 无隐私政策、无服务条款、无联系方式
- 框架无学术或心理学背书（虽是娱乐定位，但仍影响 AI 可信度评估）

**建议：** 添加 `/about` 页面（或首页内嵌折叠区块），包含：
- 原作者 100 字简介 + Bilibili 链接
- Pro 版开发者信息
- 框架创作动机（"为什么做 SBTI"）
- 简短免责声明（仅供娱乐，非临床诊断）

### M-2：平台存在感依赖社区而非官方

知乎和小红书上存在大量用户自发讨论，但**无官方账号**。AI 训练数据爬取这些平台时，引用的是第三方分析而非原始权威来源，作者身份在 AI 知识图谱中变得模糊。

### M-3：内容对 AI 爬虫的哈希路由问题

`sbti.ytht.io/#CTRL` 中的 `#` 片段 ID 不会被任何 AI 爬虫作为独立 URL 爬取。38 种人格类型的深度链接（分享链接功能）对 AI 可见性无效。

---

## 低优先级问题（Low — 有余力时优化）

- 无 Twitter/X 账号（英文传播缺口）
- GitHub stars 数量和 Bilibili 播放量未在站内展示（社会证明缺失）
- 内容无明确更新时间戳（页面上 v3.0.0 版本号未显示）
- 38 种人格类型在首页手风琴里仅作展示，无独立可索引页面
- 无 RSS/Atom 订阅源

---

## 各类别深度分析

### AI 可引用性：42/100

内容本身质量极高——38 种人格的叙述独特、有深度、带文学性。问题完全在于**可达性**而非质量：JS 渲染架构使 AI 爬虫看到的是一个空壳。

| 子项 | 得分 |
|------|------|
| 可引用内容块 | 25/100（内容好但不可抓取）|
| Q&A 格式 | 15/100（无 FAQ 结构）|
| 直接回答密度 | 35/100（H1 和少量 meta 可见）|
| AI 爬虫可读性 | 10/100（JS SPA = 几乎不可见）|
| 内容新鲜度信号 | 50/100（v3.0 但未在页面显示）|
| 可引用价值 | 55/100（内容独特，架构阻碍引用）|

### 品牌权威度：32/100

SBTI 是一个定位清晰的原创中文人格框架，但对主流 AI 训练数据几乎不可见。知乎和小红书上的社区讨论是最强的 AI 可见性来源，但均为第三方内容。子域名（sbti.ytht.io）相比根域名（如 sbti.io）权威性更弱。

| 子项 | 得分 |
|------|------|
| 实体识别 | 25/100 |
| 第三方提及 | 28/100 |
| 域名权威度 | 20/100（子域名劣势）|
| 跨平台存在感 | 30/100 |
| 反向链接质量 | 15/100 |
| 社会证明 | 35/100 |

### 内容 E-E-A-T：62/100

这是六项中得分最高的类别。内容原创性强，作者署名（虽然简略）存在，sbti-wiki 数据来源有说明。扣分主要来自缺乏证书/资质、无隐私政策、娱乐定位弱化了专业权威感。

| 子项 | 得分 |
|------|------|
| 经验（Experience） | 60/100 |
| 专业度（Expertise） | 48/100 |
| 权威性（Authoritativeness） | 56/100 |
| 可信度（Trustworthiness） | 64/100（HTTPS 有但无法律页面）|
| 来源引用 | 70/100 |
| 内容原创性 | 85/100 |
| 作者署名 | 40/100 |

### 技术 GEO：34/100

技术基础（Cloudflare CDN、HTTPS、移动端优化）很好，但 GEO 层面的关键技术资产全部缺失。

| 子项 | 得分 |
|------|------|
| AI 爬虫访问 | 50/100（默认允许但 JS 渲染无效）|
| llms.txt | 0/100 |
| Meta 标签完整性 | 75/100（description 和 OG 存在）|
| 渲染架构 | 15/100（100% JS 渲染）|
| 页面速度 | 85/100（Cloudflare CDN）|
| 移动端优化 | 90/100 |
| 结构化数据 | 0/100 |

### Schema & 结构化数据：8/100

全站零 Schema.org 标记。8 分来自 HTTPS 和基本 meta 标签提供的最低可识别度。

**最高优先级缺失 Schema：**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SBTI 人格测试",
  "alternateName": "Soul Bytes Type Indicator",
  "description": "基于 17 个心理维度、涵盖 38 种人格类型的电子时代人格测试",
  "url": "https://sbti.ytht.io/",
  "inLanguage": "zh-CN",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CNY" },
  "author": {
    "@type": "Person",
    "name": "蛆肉儿串儿",
    "url": "https://space.bilibili.com/417038183"
  },
  "creator": {
    "@type": "Person",
    "name": "Paris Yu",
    "url": "https://github.com/yupoet"
  },
  "datePublished": "2026-04-10",
  "version": "3.0.0",
  "license": "https://opensource.org/licenses/MIT"
}
</script>
```

### 平台优化：42/100

| 平台 | 状态 | 说明 |
|------|------|------|
| Bilibili | ✅ 存在 | 原作者有频道，原版视频 BV1LpDHByET6 |
| GitHub | ✅ 存在 | 开源代码 + 社区 wiki |
| 知乎 | ⚠️ 仅社区 | 多篇用户分析文章，无官方账号 |
| 小红书 | ⚠️ 仅社区 | 病毒式传播来源，无官方账号 |
| 百度百科/维基百科 | ❌ 缺失 | 无词条 |
| Reddit / 英文社区 | ❌ 缺失 | 无 |
| Twitter/X | ❌ 缺失 | 无 |

---

## 快速胜利（本周可实施，无需后端）

以下 5 项改动全部在 `index.html` 中完成，30 分钟内可部署：

1. **添加 WebApplication + Organization JSON-LD**（预计 GEO +8 分）  
   在 `<head>` 中插入一个 `<script type="application/ld+json">` 块，声明站点为 WebApplication，注册原作者为 Person 实体。

2. **添加 llms.txt**（预计 GEO +5 分）  
   在 Cloudflare Pages 项目根目录创建 `/llms.txt`，内容见 H-1 建议。

3. **补全 OG 标签和 meta description**（预计 GEO +4 分）  
   添加 `og:title`、`og:description`、`og:image`、`og:url`、`twitter:card`（见 H-3）。

4. **创建 robots.txt**（预计 GEO +2 分）  
   ```
   User-agent: *
   Allow: /
   Sitemap: https://sbti.ytht.io/sitemap.xml
   ```

5. **生成 sitemap.xml（查询参数形式）**（预计 GEO +2 分）  
   为 38 种人格类型生成 `?type=CTRL` 形式的 URL 条目。

**5 项合计预计总分从 39 → 60（Fair）**

---

## 30 天行动计划

### 第 1 周：技术 GEO 基础设施
- [ ] 添加 WebApplication + Organization + CreativeWork JSON-LD 到 `<head>`
- [ ] 创建 `/llms.txt`
- [ ] 创建 `/robots.txt`
- [ ] 补全所有 OG / Twitter Card meta 标签
- [ ] 添加 `<link rel="canonical" href="https://sbti.ytht.io/">`
- [ ] 部署 `sitemap.xml`（含 38 种人格类型的查询参数 URL）

### 第 2 周：内容可抓取性
- [ ] 在 `<noscript>` 标签中渲染所有 38 种人格类型的静态 HTML（含名称、简介、desc、稀有度）
- [ ] 在 `<head>` 的 JSON-LD 中内联完整 TYPE_LIBRARY 数据（AI 爬虫可读）
- [ ] 添加 FAQPage schema（至少 5 个关于 SBTI 的常见问题）
- [ ] 在页面添加版本号和更新日期显示

### 第 3 周：E-E-A-T 与信任信号
- [ ] 添加 About 折叠区块（原作者简介 + Pro 版开发者 + 框架背景）
- [ ] 添加隐私声明（单段即可："本测试不收集任何用户数据，结果仅存在浏览器 URL 中"）
- [ ] 在知乎开设官方专栏，发布一篇"SBTI 是什么"权威解释文章
- [ ] 在 GitHub README 添加更详细的框架方法论说明

### 第 4 周：平台扩展
- [ ] 创建小红书官方账号，发布官方 SBTI 类型解析内容
- [ ] 联系 sbti.dev 等镜像站协商 canonical 引用或合并
- [ ] 评估是否需要独立根域名（如 sbti.io）
- [ ] 为最热门 6 种人格类型（CTRL、OJBK、THAN-K 等）创建独立静态 HTML 页面原型

---

## 附录：站点分析摘要

| 项目 | 现状 |
|------|------|
| URL | https://sbti.ytht.io/ |
| 页面数 | 1（SPA） |
| robots.txt | ❌ 不存在 |
| sitemap.xml | ❌ 不存在 |
| llms.txt | ❌ 不存在 |
| Schema.org | ❌ 零标记 |
| meta description | ❌ 缺失 |
| Open Graph | ❌ 缺失 |
| Twitter Card | ❌ 缺失 |
| JS 渲染 | ⚠️ 100%（AI 爬虫不可读）|
| HTTPS | ✅ Cloudflare |
| 移动端优化 | ✅ 优秀 |
| 页面速度 | ✅ 优秀（Cloudflare CDN）|
| 已知镜像域名 | sbti.dev, sbti.pics, sbti.one, sbti.cam, sbti.jerryz.com.cn |
| 知乎社区讨论 | ✅ 存在（非官方）|
| Bilibili 原作者 | ✅ 存在 |
| GitHub 开源 | ✅ 存在 |
| 预计修复后评分 | ~60（实施第 1 周方案后）|
