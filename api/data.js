module.exports = async (req, res) => {
  const { THINGSPEAK_CHANNEL_ID, THINGSPEAK_READ_KEY } = process.env;
  const results = Math.min(parseInt(req.query.results) || 60, 500);
  const url =
    `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json` +
    `?api_key=${THINGSPEAK_READ_KEY}&results=${results}&status=true`;

  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error("ThingSpeak returned " + r.status);
    const data = await r.json();
    if (!data || !data.feeds) throw new Error("No data (check channel ID and read key)");
    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=20");
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
};
