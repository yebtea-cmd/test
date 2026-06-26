import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'method_not_allowed' } });
  }

  const cookies = parse(req.headers.cookie || '');
  const accessToken = cookies.tiktok_access_token;

  if (!accessToken) {
    return res.status(401).json({
      error: {
        code: 'access_token_missing',
        message: 'Connect TikTok before checking publish status.',
      },
    });
  }

  try {
    const { publish_id: publishId } = req.body;
    if (!publishId) {
      return res.status(400).json({
        error: {
          code: 'publish_id_missing',
          message: 'A TikTok publish ID is required.',
        },
      });
    }

    const response = await fetch('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ publish_id: publishId }),
    });
    
    const payload = await response.json();

    return res.status(response.ok ? 200 : response.status).json(payload);
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'publish_status_failed',
        message: error.message,
      },
    });
  }
}
