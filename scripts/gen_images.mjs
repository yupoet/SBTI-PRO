#!/usr/bin/env node
// gen_images.mjs — Generate images for new SBTI types via qwen-image-2.0-pro (img2img style transfer)
// Usage: DASHSCOPE_API_KEY=xxx node scripts/gen_images.mjs
// Images are saved to ../image/{CODE}.png
// Uses CTRL.png + OJBK.png as style reference to match original low-poly paper-fold 3D character style

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

// Style reference images — text-free crops of original SBTI characters (low-poly paper-fold 3D style)
const REF_IMAGES = [
  'https://sbti.ytht.io/image/CTRL_ref.png',
  'https://sbti.ytht.io/image/OJBK_ref.png',
];

const NEW_TYPES = [
  {
    code: 'PULL', cn: '暗控者',
    pose: '站立，一只手伸向远处像在拨动看不见的棋子，神秘低调，眼神锐利，轻微侧身'
  },
  {
    code: 'NOPE', cn: '回避者',
    pose: '背对观众，双臂环绕自己，侧脸微微回头，警惕神情，防御姿态'
  },
  {
    code: 'LOOP', cn: '死循环者',
    pose: '坐在地上，双手抱头，眉头紧皱，陷入思考，佝偻蜷缩'
  },
  {
    code: 'RUST', cn: '内腐者',
    pose: '站立但身体轻微佝偻内缩，双臂垂落，表情麻木空洞，略微低头'
  },
  {
    code: 'CLOS', cn: '封闭者',
    pose: '站立，双臂紧紧交叉在胸前，侧身，表情冷漠防御，闭目'
  },
  {
    code: 'CLIN', cn: '黏附者',
    pose: '微微弯腰向前，双手向前伸出抓握，表情渴望依附，眉眼向上'
  },
  {
    code: 'MASK', cn: '无感面具',
    pose: '站立，双手捂住脸，面部完全遮住，身体僵直，空洞感'
  },
  {
    code: 'WIRE', cn: '高压线',
    pose: '站立，全身紧绷，双臂向两侧伸直，身体僵硬，表情紧张焦虑'
  },
  {
    code: 'FAWN', cn: '讨好者',
    pose: '深深弯腰鞠躬，双手合十或向前，表情讨好，眼神向上看'
  },
  {
    code: 'ECHO', cn: '回声室',
    pose: '站立，双臂微张，表情空洞茫然，像在等待回应，身体略向前倾'
  },
  {
    code: 'DRIFT', cn: '漂流者',
    pose: '放松飘逸姿态，一臂向侧伸展，身体微微倾斜，表情淡然惬意'
  },
  {
    code: 'KEEN', cn: '探索狂',
    pose: '跳跃欢快姿态，双臂张开，腿部弯曲，表情兴奋好奇，充满活力'
  },
  {
    code: 'MIST', cn: '焦虑虚空',
    pose: '站立，双臂向前摸索，眼神迷茫空洞，身体轻微颤抖感，找不到方向'
  },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const doRequest = (u) => {
      https.get(u, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          doRequest(res.headers.location);
          return;
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', err => {
        try { fs.unlinkSync(dest); } catch (_) {}
        reject(err);
      });
    };
    doRequest(url);
  });
}

async function apiPost(body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const options = {
      hostname: 'dashscope.aliyuncs.com',
      path: '/api/v1/services/aigc/multimodal-generation/generation',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${API_KEY}`,
      }
    };
    const req = https.request(options, r => {
      let raw = '';
      r.on('data', d => raw += d);
      r.on('end', () => {
        try { resolve({ status: r.statusCode, body: JSON.parse(raw) }); }
        catch (e) { reject(new Error(`JSON parse failed: ${raw.slice(0, 200)}`)); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function generateImage(type, force = false) {
  const outPath = path.join(OUT_DIR, `${type.code}.png`);
  if (!force && fs.existsSync(outPath)) {
    console.log(`⏭  ${type.code}: already exists, skipping`);
    return;
  }

  console.log(`🎨 Generating ${type.code} (${type.cn})...`);

  const prompt = `参考这两张图片的3D低多边形折纸小人风格，生成全新人格角色「${type.cn}」：${type.pose}，纯白背景。重要：画面内绝对不含任何文字、汉字、字母、标题、水印、标签。只有人物角色和白色背景。`;

  const requestBody = {
    model: 'qwen-image-2.0-pro',
    input: {
      messages: [{
        role: 'user',
        content: [
          ...REF_IMAGES.map(url => ({ image: url })),
          { text: prompt }
        ]
      }]
    },
    parameters: {
      size: '768*1024',
      watermark: false,
      prompt_extend: false,
      negative_prompt: 'text, label, watermark, chinese characters, letters, typography, words, caption, title, crown, special props, weapons, accessories',
    }
  };

  // Retry up to 5 times on 429
  let res;
  for (let attempt = 1; attempt <= 5; attempt++) {
    res = await apiPost(requestBody);
    if (res.status === 429) {
      const waitSec = 60 * attempt;
      console.log(`  ⏳ Rate limited (attempt ${attempt}), waiting ${waitSec}s...`);
      await sleep(waitSec * 1000);
      continue;
    }
    break;
  }

  try {
    if (res.status !== 200) {
      console.error(`  ❌ API error ${res.status}:`, JSON.stringify(res.body).slice(0, 300));
      return;
    }

    const imageUrl = res.body?.output?.choices?.[0]?.message?.content?.[0]?.image;
    if (!imageUrl) {
      console.error('  ❌ No image URL in response:', JSON.stringify(res.body).slice(0, 300));
      return;
    }

    await downloadFile(imageUrl, outPath);
    const size = fs.statSync(outPath).size;
    console.log(`  ✅ Saved ${outPath} (${(size/1024).toFixed(0)}KB)`);
  } catch (err) {
    console.error(`  ❌ Error generating ${type.code}:`, err.message);
  }
}

async function main() {
  const forceRegen = process.argv.includes('--force');
  if (forceRegen) {
    console.log('⚠️  --force: will overwrite existing images\n');
  }
  console.log(`Generating images for ${NEW_TYPES.length} new SBTI types via qwen-image-2.0-pro...\n`);
  for (const type of NEW_TYPES) {
    await generateImage(type, forceRegen);
    await sleep(20000); // 20s between requests to stay under rate limit
  }
  console.log('\nDone!');
}

main();
