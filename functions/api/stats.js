import { ALL_TYPES } from './_types.js';

export async function onRequestGet(context) {
  const { env } = context;

  // Last 7 days, oldest first, today last
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  let totalStr, typeValues, dayValues;
  try {
    const results = await Promise.all([
      env.SBTI_STATS.get('total'),
      ...ALL_TYPES.map(t => env.SBTI_STATS.get(`type:${t}`)),
      ...days.map(d => env.SBTI_STATS.get(`date:${d}`)),
    ]);
    totalStr   = results[0];
    typeValues = results.slice(1, 1 + ALL_TYPES.length);
    dayValues  = results.slice(1 + ALL_TYPES.length);
  } catch (err) {
    return new Response(JSON.stringify({ error: 'stats unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const total = (parseInt(totalStr || '0') || 0);

  const distribution = {};
  ALL_TYPES.forEach((type, i) => {
    const n = parseInt(typeValues[i] || '0') || 0;
    if (n > 0) distribution[type] = n;
  });

  const trend = days.map((date, i) => ({
    date,
    // dayValues[i] corresponds to days[i] (oldest first, today = index 6)
    count: parseInt(dayValues[i] || '0') || 0,
  }));

  const todayCount = trend[trend.length - 1].count;

  return new Response(
    JSON.stringify({ total, todayCount, distribution, trend }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
      },
    }
  );
}
