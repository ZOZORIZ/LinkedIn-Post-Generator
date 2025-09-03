import { parse, serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
      }

    res.setHeader('Set-Cookie', [ 
        serialize('linkedin_token', '', {
            path: '/',
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production'
       }),
       serialize("linkedin_name", '', {
          path: '/',
          maxAge: 0,
          secure: process.env.NODE_ENV === 'production'
       }),
      ]);
    return res.status(200).json({ success: true});
} 