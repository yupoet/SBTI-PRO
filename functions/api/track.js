const VALID_TYPES = new Set([
  'CTRL','ATM-er','Dior-s','BOSS','THAN-K','OH-NO','GOGO','SEXY','LOVE-R','MUM',
  'FAKE','OJBK','MALO','JOKE-R','WOC!','THIN-K','SHIT','ZZZZ','POOR','MONK',
  'IMSB','SOLO','FUCK','DEAD','IMFW',
  'PULL','NOPE','LOOP','RUST','CLOS','CLIN','MASK','WIRE','FAWN','ECHO','DRIFT','KEEN','MIST',
  'DRUNK','HHHH',
]);

export async function onRequestPost(context) {
  const { env, request } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  const type = body?.type;
  if (!type || !VALID_TYPES.has(type)) {
    return json({ error: 'invalid type' }, 400);
  }

  const today = new Date().toISOString().slice(0, 10);
  const [totalStr, typeStr, dailyStr] = await Promise.all([
    env.SBTI_STATS.get('total'),
    env.SBTI_STATS.get(`type:${type}`),
    env.SBTI_STATS.get(`date:${today}`),
  ]);

  const total     = parseInt(totalStr  || '0') + 1;
  const typeCount = parseInt(typeStr   || '0') + 1;
  const daily     = parseInt(dailyStr  || '0') + 1;

  await Promise.all([
    env.SBTI_STATS.put('total',         String(total)),
    env.SBTI_STATS.put(`type:${type}`,  String(typeCount)),
    env.SBTI_STATS.put(`date:${today}`, String(daily)),
  ]);

  return json({ ok: true, total, typeCount });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
