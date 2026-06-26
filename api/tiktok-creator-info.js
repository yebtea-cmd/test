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
        message: 'Connect TikTok before querying creator info.',
      },
    });
  }

  try {
    const response = await fetch('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({}) // Some endpoints require empty body
    });

    const payload = await response.json();

    if (!response.ok || (payload.error?.code && payload.error?.code !== 'ok')) {
      return res.status(400).json({
        error: {
          code: payload.error?.code || 'creator_info_failed',
          message: payload.error?.message || 'Failed to query creator info',
        }
      });
    }

    return res.status(200).json({
      data: payload.data,
      error: payload.error,
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message,
      },
    });
  }
}
