export default function handler(req, res) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI);
  const scope = encodeURIComponent('w_member_social openid profile email');
  const state = Math.random().toString(36).substring(2, 15); // In production, use a secure random string and store it in session

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  res.redirect(authUrl);
  console.log("Redirecting to:", authUrl);
}
