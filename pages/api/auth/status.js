export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.cookies.linkedin_token;
  const name = req.cookies.linkedin_name;
  const urn = req.cookies.linkedin_urn;
  const picture = req.cookies.linkedin_picture;

  if (token) {
    return res.status(200).json({ 
      isLoggedIn: true, 
      userName: name || 'User',
      author: urn || 'Null' ,
      picture: picture || 'Null'
    });
  } else {
    return res.status(200).json({ 
      isLoggedIn: false, 
      userName: null 
    });
  }
} 