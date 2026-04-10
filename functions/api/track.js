import { VALID_TYPES } from './_types.js';

export async function onRequestPost(context) {
  const { env, request } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  const type = body?.type;
  if (typeof type !== 'string' || !VALID_TYPES.has(type)) {
    return json({ error: 'invalid type' }, 400);
  }

  const today = new Date().toISOString().slice(0, 10);
  const [totalStr, typeStr, dailyStr] = await Promise.all([
    env.SBTI_STATS.get('total'),
    env.SBTI_STATS.get(`type:${type}`),
    env.SBTI_STATS.get(`date:${today}`),
  ]);

  const total     = (parseInt(totalStr  || '0') || 0) + 1;
  const typeCount = (parseInt(typeStr   || '0') || 0) + 1;
  const daily     = (parseInt(dailyStr  || '0') || 0) + 1;

  await Promise.all([
    env.SBTI_STATS.put('total',         String(total)),
    env.SBTI_STATS.put(`type:${type}`,  String(typeCount)),
    env.SBTI_STATS.put(`date:${today}`, String(daily)),
  ]);

  return json({ ok: true });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
