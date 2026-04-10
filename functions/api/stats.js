const ALL_TYPES = [
  'CTRL','ATM-er','Dior-s','BOSS','THAN-K','OH-NO','GOGO','SEXY','LOVE-R','MUM',
  'FAKE','OJBK','MALO','JOKE-R','WOC!','THIN-K','SHIT','ZZZZ','POOR','MONK',
  'IMSB','SOLO','FUCK','DEAD','IMFW',
  'PULL','NOPE','LOOP','RUST','CLOS','CLIN','MASK','WIRE','FAWN','ECHO','DRIFT','KEEN','MIST',
  'DRUNK','HHHH',
];

export async function onRequestGet(context) {
  const { env } = context;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const [totalStr, ...rest] = await Promise.all([
    env.SBTI_STATS.get('total'),
    ...ALL_TYPES.map(t => env.SBTI_STATS.get(`type:${t}`)),
    ...days.map(d => env.SBTI_STATS.get(`date:${d}`)),
  ]);

  const total = parseInt(totalStr || '0');

  const distribution = {};
  ALL_TYPES.forEach((type, i) => {
    const n = parseInt(rest[i] || '0');
    if (n > 0) distribution[type] = n;
  });

  const trend = days.map((date, i) => ({
    date,
    count: parseInt(rest[ALL_TYPES.length + i] || '0'),
  }));

  const todayCount = trend[trend.length - 1].count;

  return new Response(
    JSON.stringify({ total, todayCount, distribution, trend }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    }
  );
}
