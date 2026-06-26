export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    // Read credentials from Vercel Environment Variables
    const clientKey = process.env.VITE_TIKTOK_CLIENT_KEY || 'awkisbm5h330o786';
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET || 'N3VXNsuwZLMa01SPLUgnjOgB2g3wl0Rq';
    const redirectUri = 'https://crmkg.vercel.app/callback';

    // Call TikTok's v2/oauth/token endpoint securely from the backend
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('TikTok OAuth Error:', data);
      return res.status(400).json({ error: data.error, error_description: data.error_description });
    }

    const accessToken = data.access_token;
    
    // Fetch user profile from TikTok API
    const userResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const userData = await userResponse.json();

    // Return success and user data to the frontend
    return res.status(200).json({ 
      success: true, 
      open_id: data.open_id,
      user: userData?.data?.user || null
    });
    
  } catch (err) {
    console.error('Server error during token exchange:', err);
    return res.status(500).json({ error: 'server_error', error_description: err.message });
  }
}
