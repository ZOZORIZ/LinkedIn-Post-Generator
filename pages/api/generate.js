export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { input, goal, tone, audience, achievement, length } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Updated model name
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', response.status, response.statusText);
      console.error('Groq API error details:', JSON.stringify(errorData, null, 2));
      return res.status(500).json({ message: `Groq API error: ${errorData.error?.message || response.statusText}` });
    }

    const data = await response.json();
    console.log('Groq API response:', JSON.stringify(data, null, 2));
    
    const generatedText = data.choices?.[0]?.message?.content;
    
    if (!generatedText) {
      console.error('No content in response:', data);
      return res.status(500).json({ message: 'No content generated' });
    }

    res.status(200).json({ output: generatedText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error generating post' });
  }
}
  