# SBTI Stats — Cloudflare KV 绑定配置

统计功能需要在 Cloudflare 控制台做一次性配置（已配置过请跳过）。

## 1. 创建 KV Namespace

1. 进入 [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → KV
2. 点击 **Create namespace**，名称填写：`SBTI_STATS`
3. 记下生成的 Namespace ID

## 2. 绑定到 Pages 项目

1. 进入 Workers & Pages → **sbti-pro**（你的 Pages 项目名）
2. Settings → Functions → **KV namespace bindings**
3. 点击 Add binding：
   - Variable name: `SBTI_STATS`
   - KV namespace: 选择刚创建的 `SBTI_STATS`
4. 保存

## 3. 触发重新部署

绑定保存后，推送任意 commit 到 main 分支即可触发新部署。
或在 Pages 控制台手动点击 **Retry deployment**。

## 4. 验证

部署完成后：

```bash
# 测试 track 接口（返回 {"ok":true}）
curl -s -X POST https://sbti.ytht.io/api/track \
  -H 'Content-Type: application/json' \
  -d '{"type":"CTRL"}' | python3 -m json.tool

# 测试 stats 接口
curl -s https://sbti.ytht.io/api/stats | python3 -m json.tool

# 验证非法 type 被拒绝（应返回 400）
curl -s -o /dev/null -w "%{http_code}" -X POST https://sbti.ytht.io/api/track \
  -H 'Content-Type: application/json' \
  -d '{"type":"FAKE_TYPE"}'
```

## 本地开发

```bash
cd games/SBTI-PRO
npx wrangler pages dev . --kv SBTI_STATS
# 访问 http://localhost:8788
```
