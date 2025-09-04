export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { input, goal, tone, audience, achievement, length } = req.body;

  try {
    const response = await fetch("http://localhost:5678/webhook/47275b9d-2402-4e55-b967-d40dee794c34", {
      method: "POST",
      headers: {
        "password": `password`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a professional LinkedIn content strategist. Write clear, audience-appropriate posts based on user input"
          },
          {
            role: "user",
            content: `**Instructions:**

Write a LinkedIn post based on the following:
- Topic: ${input}
- Goal: ${goal}
- Audience: ${audience}
- Achievement: ${achievement}
- Tone: ${tone}
- Length: Around ${length} words

**Formatting Rules:**
- Add a short, catchy **title** with 1–2 emojis and use emojis for every sub title 
- Add Proper Line Breaks and Ensure Readability
- Use **bold** formatting to highlight achievements or key points
- If institution names are mentioned, add their location (e.g., Saintgits College → Kottayam, Kerala)
- Add 5–10 relevant **hashtags** at the end based on topic — avoid using country names
- Limit emoji use to 6 or fewer (include at least one in the title)
- Avoid Placeholders in [] for the user to fill
- Always start with content 
- Never Output or Start with "here is your output...,here is your post.." 

**Tone Style Guide:**
- casual → conversational, friendly
- goofy → playful, light humor
- professional → formal, polished, no slang

Avoid placeholders, incomplete sentences, or unnatural AI-sounding text.if the user has not provided any information, return "blud try real inputs!" or if the user has provided invalid or random information, return "Invalid information provided" and dont use hashtages in such cases `
          }
        ]
      })
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (response.ok && contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log("n8n response data:",data);
    } else {
      // Not JSON, probably an error
      const errorText = await response.text();
      console.error('Error from upstream API:', errorText);
      return res.status(response.status).json({ error: errorText });
    }
     const generatedText = data?.[0]?.text || "Failed to generate"; 

    res.status(200).json({ output: generatedText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error generating post' });
  }
}
  