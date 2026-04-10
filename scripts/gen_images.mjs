#!/usr/bin/env node
// gen_images.mjs — Generate images for new SBTI types via Alibaba Cloud DashScope
// Usage: DASHSCOPE_API_KEY=xxx node scripts/gen_images.mjs
// Images are saved to ../image/{CODE}.png

import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'image');

const API_KEY = process.env.DASHSCOPE_API_KEY;
if (!API_KEY) {
  console.error('Error: DASHSCOPE_API_KEY environment variable not set');
  process.exit(1);
}

const NEW_TYPES = [
  { code: 'PULL',  cn: '暗控者',   prompt: '幕后操控者，低调神秘，在暗中拨动棋子' },
  { code: 'NOPE',  cn: '回避者',   prompt: '警惕的孤独者，筑起高墙，内心藏有伤痕' },
  { code: 'LOOP',  cn: '死循环者', prompt: '陷入思维漩涡的智者，脑内无数标签页永不关闭' },
  { code: 'RUST',  cn: '内腐者',   prompt: '内心默默崩溃的存在，表面平静，内部锈蚀' },
  { code: 'CLOS',  cn: '封闭者',   prompt: '主动封闭自我的人，将门焊死，精心构建防御' },
  { code: 'CLIN',  cn: '黏附者',   prompt: '因恐惧而依附的人，紧紧抓住关系，害怕消失' },
  { code: 'MASK',  cn: '无感面具', prompt: '层层叠叠的面具下什么都没有，迷失自我的存在' },
  { code: 'WIRE',  cn: '高压线',   prompt: '高压运转的完美主义者，随时可能燃尽的高压线' },
  { code: 'FAWN',  cn: '讨好者',   prompt: '永远迎合他人、消灭冲突的和事佬，自我消融' },
  { code: 'ECHO',  cn: '回声室',   prompt: '镜子一般的人格，映射周围的一切，没有自己的声音' },
  { code: 'DRIFT', cn: '漂流者',   prompt: '随波漂流的存在，没有方向也没有锚点，悠然飘荡' },
  { code: 'KEEN',  cn: '探索狂',   prompt: '充满好奇心的冒险者，见什么都想尝试，活力四射' },
  { code: 'MIST',  cn: '焦虑虚空', prompt: '弥漫在焦虑与空虚之间的存在，找不到着陆点' },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        file.close();
        fs.unlinkSync(dest);
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function generateImage(type) {
  const outPath = path.join(OUT_DIR, `${type.code}.png`);
  if (fs.existsSync(outPath)) {
    console.log(`⏭  ${type.code}: already exists, skipping`);
    return;
  }

  console.log(`🎨 Generating ${type.code} (${type.cn})...`);

  const fullPrompt = `SBTI人格测试插画，赛博朋克水彩风格，角色代表「${type.cn}」人格，${type.prompt}，背景简洁，人物半身，参考已有SBTI人格图片风格，无文字水印，高质量插画`;

  const payload = {
    model: 'wanx2.1-t2i-turbo',
    input: { prompt: fullPrompt },
    parameters: { size: '768*1024', n: 1 }
  };

  try {
    const body = JSON.stringify(payload);
    const taskRes = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'dashscope.aliyuncs.com',
        path: '/api/v1/services/aigc/text2image/image-synthesis',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'Authorization': `Bearer ${API_KEY}`,
          'X-DashScope-Async': 'enable'
        }
      };
      const req = https.request(options, r => {
        let raw = '';
        r.on('data', d => raw += d);
        r.on('end', () => resolve({ status: r.statusCode, body: JSON.parse(raw) }));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });

    if (taskRes.status !== 200 && taskRes.status !== 202) {
      console.error(`  ❌ API error ${taskRes.status}:`, taskRes.body);
      return;
    }

    const taskId = taskRes.body?.output?.task_id;
    if (!taskId) {
      console.error('  ❌ No task_id in response:', taskRes.body);
      return;
    }

    console.log(`  ⏳ Task ${taskId}, polling...`);

    for (let i = 0; i < 30; i++) {
      await sleep(3000);
      const taskStatus = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'dashscope.aliyuncs.com',
          path: `/api/v1/tasks/${taskId}`,
          method: 'GET',
          headers: { Authorization: `Bearer ${API_KEY}` }
        };
        https.request(options, r => {
          let raw = '';
          r.on('data', d => raw += d);
          r.on('end', () => resolve({ status: r.statusCode, body: JSON.parse(raw) }));
        }).on('error', reject).end();
      });

      const status = taskStatus.body?.output?.task_status;
      if (status === 'SUCCEEDED') {
        const imageUrl = taskStatus.body?.output?.results?.[0]?.url;
        if (!imageUrl) { console.error('  ❌ No image URL in result'); return; }
        await downloadFile(imageUrl, outPath);
        console.log(`  ✅ Saved to ${outPath}`);
        return;
      } else if (status === 'FAILED') {
        console.error('  ❌ Task failed:', taskStatus.body?.output?.message);
        return;
      }
      console.log(`  ... status: ${status}`);
    }
    console.error('  ❌ Timeout waiting for task');
  } catch (err) {
    console.error(`  ❌ Error:`, err.message);
  }
}

async function main() {
  console.log(`Generating images for ${NEW_TYPES.length} new SBTI types...\n`);
  for (const type of NEW_TYPES) {
    await generateImage(type);
    await sleep(1000);
  }
  console.log('\nDone!');
}

main();
