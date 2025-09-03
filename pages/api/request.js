import { IncomingForm } from 'formidable';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Disable default body parser
  const form = new IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(400).json({ error: "Failed to parse form data" });
    }

    const generatedContent = Array.isArray(fields.generatedContent) ? fields.generatedContent[0] : fields.generatedContent;
    const visib = fields.visibility;
    let imageFile = files.image;
    if (Array.isArray(imageFile)) imageFile = imageFile[0];
    console.log("imageFile:", imageFile);
    let imageId = "NONE";
    let asset = null;

    if (!generatedContent) {
      return res.status(400).json({ error: 'Generated content is required' });
    }

    const accessToken = req.cookies.linkedin_token;
    const userId = req.cookies.linkedin_urn;

    if (!accessToken || !userId) {
      return res.status(401).json({ error: 'LinkedIn authentication missing' });
    }

    let networkVisibility = visib === "Connections only" ? "CONNECTIONS" : "PUBLIC";

    // --- IMAGE UPLOAD ---
    if (imageFile) {
      imageId = "IMAGE";

      const imageupload = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0"
        },
        body: JSON.stringify({
          "registerUploadRequest": {
            "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
            "owner": userId,
            "serviceRelationships": [
              {
                "relationshipType": "OWNER",
                "identifier": "urn:li:userGeneratedContent"
              }
            ]
          }
        })
      });

      const imageuploadResponse = await imageupload.json();
      asset = imageuploadResponse.value.asset;
      const uploadUrl = imageuploadResponse.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;

      const filePath = imageFile?.filepath || imageFile?.path;
      if (!filePath) {
        return res.status(400).json({ error: "Image file path not found" });
      }
      const imageBuffer = fs.readFileSync(filePath);

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: imageBuffer,
        headers: {
          "Content-Type": imageFile.mimetype
        }
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Upload failed:", errorText);
        return res.status(500).json({ error: "Image upload failed", details: errorText });
      }

      console.log("✅ Image uploaded successfully");
    }

    // --- FINAL POST TO LINKEDIN ---
    const bodyPayload = {
      author: userId,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: generatedContent
          },
          shareMediaCategory: imageId
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": networkVisibility
      }
    };

    if (imageId === "IMAGE" && asset) {
      bodyPayload.specificContent["com.linkedin.ugc.ShareContent"].media = [
        {
          status: "READY",
          media: asset,
          title: { text: "Uploaded Image" },
          description: { text: "Image" }
        }
      ];
    }

    const linkedinResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!linkedinResponse.ok) {
      const errorData = await linkedinResponse.text();
      console.error('LinkedIn API Error:', errorData);
      return res.status(500).json({ error: "LinkedIn post failed", details: errorData });
    }

    const linkedinData = await linkedinResponse.json();
    let postUrl = linkedinData?.id ? `https://www.linkedin.com/feed/update/${linkedinData.id}` : null;

    return res.status(200).json({
      success: true,
      message: 'Post shared to LinkedIn successfully',
      linkedinData,
      sharedContent: generatedContent,
      postUrl
    });
  });
}


export const config = {
  api: {
    bodyParser: false,
  },
};
