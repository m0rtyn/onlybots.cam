import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const apiKey = process.env.PLAUSIBLE_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  try {
    const year = new Date().getFullYear();
    const plausibleRes = await fetch(
      `https://plausible.io/api/v1/stats/aggregate?site_id=onlybots.cam&period=custom&date=${year}-01-01,${year}-12-31&metrics=visitors`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );

    if (!plausibleRes.ok) {
      res.status(502).json({ error: 'Plausible API error' });
      return;
    }

    const data = await plausibleRes.json();

    // Cache for 1 hour — no need to hit Plausible on every request
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    res.status(200).json(data);
  } catch {
    res.status(502).json({ error: 'Failed to fetch stats' });
  }
}
