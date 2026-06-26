export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'method_not_allowed' } });
  }

  res.setHeader('Set-Cookie', [
    'tiktok_access_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    'tiktok_refresh_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
  ]);

  return res.status(200).json({
    ok: true,
    message: 'TikTok account disconnected.',
  });
}
