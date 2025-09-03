import { serialize } from 'cookie';

export default async function handler(req, res) {
  const code = req.query.code;
  const state = req.query.state;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    // 1️⃣ Get access token
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description || 'Token exchange failed' });
    }

    const accessToken = data.access_token;

    // 2️⃣ Now get user info
    const me = await fetch("https://api.linkedin.com/v2/userinfo", {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await me.json();
    console.log(userData);

    const urn = `urn:li:person:${userData.sub}`;
    console.log('userData.sub:', userData.sub);
    console.log('urn:', urn);

    // ✅ 3️⃣ Set cookie with access token
    res.setHeader('Set-Cookie', [ 
      serialize('linkedin_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
     }),
     serialize("linkedin_name", userData.name, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60*60*24,
     }),
     serialize("linkedin_urn",urn ,{
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60*60*24,
      sameSite: 'lax'
      }),
      serialize("linkedin_picture", userData.picture ,{
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60*60*24,
        sameSite: 'lax'
      })
    ]);

    // ✅ 4️⃣ Redirect to your hero section
    res.redirect('/#hero');

  } catch (err) {
    console.error('Token exchange error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
