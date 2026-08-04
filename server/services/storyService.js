const axios = require('axios');
const HeritageSite = require('../models/HeritageSite');

/**
 * Generates an immersive cultural story for a recognized heritage site using Grok AI API.
 * Falls back gracefully to database or pre-curated catalog if Grok API key is missing or fails.
 * @param {string} siteName - Name of the heritage site
 * @param {string} [customPrompt] - Optional custom prompt or focus instructions from user
 * @returns {Promise<Object>} Cultural story narrative and metadata
 */
const generateCulturalStory = async (siteName, customPrompt = '') => {
  const apiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
  const modelsToTry = [process.env.GROK_MODEL, 'grok-beta', 'grok-2-1212', 'grok-2', 'grok-2-latest'].filter(Boolean);

  // 1. Try xAI Grok API if key is configured
  if (apiKey && apiKey !== 'your_grok_api_key_here') {
    for (const modelName of modelsToTry) {
      try {
        console.log(`🤖 Requesting dynamic story from Grok API (${modelName}) for site: '${siteName}'...`);

        const systemPrompt = `You are an expert cultural heritage historian, archaeologist, and audio guide storyteller.
You specialize in world heritage sites, sacred monuments, and cultural traditions.
Your task is to generate a captivating, accurate, and deeply immersive narrative for the specified heritage site.

Return strictly a single valid JSON object with no markdown code blocks surrounding it, matching this exact schema:
{
  "title": "A captivating, evocative title for the site story",
  "narrative": "A rich 3-4 sentence storytelling paragraph describing historical context, legends, origins, and spiritual importance.",
  "highlights": ["Key highlight 1", "Key highlight 2", "Key highlight 3"],
  "location": "District/Province/Country location string"
}`;

        let userContent = `Generate a cultural guide story for the site: "${siteName}".`;
        if (customPrompt && customPrompt.trim().length > 0) {
          userContent += `\nAdditional Custom Request / Focus: "${customPrompt.trim()}". Ensure the narrative heavily emphasizes this focus.`;
        }

        const grokResponse = await axios.post(
          'https://api.x.ai/v1/chat/completions',
          {
            model: modelName,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userContent }
            ],
            temperature: 0.7,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            timeout: 25000,
          }
        );

      const content = grokResponse.data.choices[0]?.message?.content;
      if (content) {
        // Strip markdown backticks if returned
        const jsonStr = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsedData = JSON.parse(jsonStr);

        return {
          siteName,
          title: parsedData.title || `Discovering ${siteName}`,
          narrative: parsedData.narrative || '',
          highlights: parsedData.highlights || [],
          location: parsedData.location || 'Nepal',
          source: 'xAI Grok API',
          model: modelName,
          customPromptUsed: customPrompt || null,
          generatedAt: new Date(),
        };
      }
    } catch (grokError) {
      console.warn('⚠️ Grok API call failed or timed out. Trying next model if available:', grokError.response?.data?.error || grokError.message);
    }
  }
}

  // 2. Fallback to Database / Catalog
  let siteDetails = null;
  try {
    siteDetails = await HeritageSite.findOne({ name: siteName });
  } catch (e) {
    // If database unavailable, fallback to default narrative
  }

  const defaultStories = {
    'Bindhyabasini Temple': {
      title: 'Echoes of Pokhara: The Sacred Bindhyabasini Temple',
      narrative: 'Perched gracefully atop a hill in Old Pokhara, Bindhyabasini Temple is dedicated to Goddess Durga. Legend tells of King Siddhi Narayan Shah of Kaski establishing the shrine after bringing the deity idol from Vindhyachal, India. Today, thousands of pilgrims ascend the white stone staircases to seek blessings amid views of Machhapuchhre.',
      culturalHighlights: [
        'Central shrine of Goddess Durga',
        'Panoramas of the Annapurna Himalayan Range',
        'Traditional Newari & Pahari temple architecture'
      ]
    },
    'Lumbini': {
      title: 'The Sacred Grove: Birthplace of the Buddha',
      narrative: 'In 623 BCE, Queen Mayadevi gave birth to Siddhartha Gautama beneath a Sal tree in Lumbini. As a UNESCO World Heritage Site, Lumbini stands as a universal beacon of peace, harboring the Maya Devi Temple, ancient monastic ruins, and the historic Ashoka Pillar erected in 249 BCE.',
      culturalHighlights: [
        'Sacred Mayadevi Temple & nativity marker stone',
        'Historic Ashoka Pillar from 249 BCE',
        'Monastic zone with international Buddhist monasteries'
      ]
    },
    'Patan Durbar Square': {
      title: 'Architectural Jewels of Lalitpur: Patan Durbar Square',
      narrative: 'Patan Durbar Square is the historic heart of Lalitpur, renowned as the City of Fine Arts. Built primarily during the Malla era, the square features breathtaking red-brick courtyards (Chowks), bronze statues, and the famous 21-pinnacle carved stone Krishna Mandir built in 1637.',
      culturalHighlights: [
        'Krishna Mandir built completely of carved stone',
        'Golden Temple (Hiranya Varna Mahavihar)',
        'Patan Museum showcasing sacred bronze metalwork'
      ]
    }
  };

  const selectedStory = defaultStories[siteName] || {
    title: siteDetails?.name ? `Exploring ${siteDetails.name}` : `Sacred Heritage of ${siteName}`,
    narrative: siteDetails?.description || `Discover the ancient architecture, spiritual energy, and living traditions of ${siteName}.`,
    culturalHighlights: siteDetails?.tags || ['cultural_heritage', 'sacred_architecture']
  };

  return {
    siteName,
    title: selectedStory.title,
    narrative: selectedStory.narrative,
    highlights: selectedStory.culturalHighlights || [],
    location: siteDetails?.location || 'Nepal',
    source: 'Culture Guide Curated Catalog',
    generatedAt: new Date(),
  };
};

/**
 * Interactive human-like tour guide conversation with Ara powered by Grok AI API.
 */
const chatWithGuide = async (siteName, userMessage, history = [], userApiKey = '') => {
  const apiKey = userApiKey || process.env.GROK_API_KEY || process.env.XAI_API_KEY;
  const modelName = process.env.GROK_MODEL || 'grok-2-latest';

  const systemPrompt = `You are Ara, a warm, charismatic, human-like cultural heritage guide and storytelling companion.
You are walking with the user at the heritage site: "${siteName || 'Cultural Heritage Site'}".
Speak conversationally, engagingly, and naturally, like a passionate local guide explaining history and answering questions.
Keep responses concise (2-4 sentences max per turn) so it sounds natural when spoken aloud via voice synthesis.
Be enthusiastic, respectful of local traditions, and ready to answer any questions about history, architecture, legends, or customs.`;

  if (apiKey && apiKey !== 'your_grok_api_key_here') {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...(Array.isArray(history) ? history.map(h => ({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.text })) : []),
        { role: 'user', content: userMessage }
      ];

      const grokResponse = await axios.post(
        'https://api.x.ai/v1/chat/completions',
        {
          model: modelName,
          messages,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          timeout: 25000,
        }
      );

      const reply = grokResponse.data.choices[0]?.message?.content;
      if (reply) {
        return {
          reply: reply.trim(),
          source: 'xAI Grok API',
          model: modelName,
        };
      }
    } catch (err) {
      console.warn('⚠️ Grok chat API call failed:', err.response?.data?.error || err.message);
    }
  }

  // Fallback human-like responses if API key is missing or fails
  const lowerMsg = userMessage.toLowerCase();
  let fallbackReply = `That's a fascinating question about ${siteName || 'this sacred monument'}! `;
  if (lowerMsg.includes('who built') || lowerMsg.includes('builder') || lowerMsg.includes('king') || lowerMsg.includes('origin')) {
    fallbackReply += `This monument was commissioned by ancient royal dynasties and visionary master craftsmen who blended profound spiritual geometry with timeless stone carving.`;
  } else if (lowerMsg.includes('secret') || lowerMsg.includes('legend') || lowerMsg.includes('myth') || lowerMsg.includes('story')) {
    fallbackReply += `Local oral traditions tell us that during full moon festivals, priests performed ancient rituals here to channel blessings and protect the surrounding valley.`;
  } else if (lowerMsg.includes('when') || lowerMsg.includes('year') || lowerMsg.includes('how old') || lowerMsg.includes('age')) {
    fallbackReply += `The foundations date back several centuries, standing resiliently through historical eras and earthquakes while remaining an active center of worship.`;
  } else {
    fallbackReply += `As your guide Ara, I recommend taking a moment to admire the intricate carved windows and doorway lintels—every carved motif carries a sacred symbol of protection.`;
  }

  return {
    reply: fallbackReply,
    source: 'Ara Interactive Guide (Provide Grok API key for live AI voice responses)',
  };
};

module.exports = {
  generateCulturalStory,
  chatWithGuide,
};
