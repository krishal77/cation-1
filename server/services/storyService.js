const axios = require('axios');
const HeritageSite = require('../models/HeritageSite');

/**
 * Generates an immersive cultural story for a recognized heritage site.
 * Uses curated local catalog as the authoritative source.
 */
const generateCulturalStory = async (siteName, customPrompt = '') => {
  // Fallback to Database / Catalog
  let siteDetails = null;
  try {
    siteDetails = await HeritageSite.findOne({ name: siteName });
  } catch (e) {
    // Fallback if DB unavailable
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
 * Interactive tour guide conversation with Ara using built-in knowledge base.
 * Responds intelligently using curated heritage knowledge without any external AI API.
 */
const chatWithGuide = async (siteName, userMessage, history = []) => {
  const lowerMsg = userMessage.toLowerCase();
  const site = siteName || 'this sacred monument';

  const knowledgeBase = {
    'Bindhyabasini Temple': {
      builder: 'King Siddhi Narayan Shah of Kaski Kingdom brought the sacred idol from Vindhyachal in India and established this temple in the 18th century. The Kaski royals built the main shrine structure over the hilltop.',
      legend: 'Local legends say that the Goddess herself chose this hilltop as her dwelling. During Dashain festivals, the temple fills with thousands of devotees and the air hums with devotional songs — it is truly magical to witness!',
      architecture: 'The temple blends Newari pagoda style with Pahari mountain temple design. Notice the tiered roofs, ornate brass bells, and the courtyard walls lined with smaller shrines to various Hindu deities.',
      history: 'The temple dates back to the 18th century during the Shah dynasty era. It survived the major 2015 Nepal earthquake and continues to be the spiritual heartbeat of Pokhara city.',
      photo: 'The best shots are at sunrise when the Annapurna range glows golden behind the temple. The courtyard archway makes a perfect natural frame!',
      location: 'This temple sits on a small hillock in Bagar, Pokhara. The climb up is only about 5 minutes — totally worth it for the panoramic views!'
    },
    'Lumbini': {
      builder: 'Lumbini was not "built" — it is a sacred natural grove where Queen Mayadevi gave birth to Prince Siddhartha Gautama in 623 BCE. Emperor Ashoka later erected a commemorative pillar here in 249 BCE.',
      legend: 'It is said that when the Buddha was born, lotus flowers bloomed spontaneously and the child took seven steps, each one producing a lotus blossom. The universe itself celebrated his arrival!',
      architecture: 'The sacred garden features the Mayadevi Temple over the exact nativity spot, the sandstone Ashoka Pillar (still standing after 2,300 years!), and the Puskarini sacred pond where the Queen bathed.',
      history: 'Lumbini was rediscovered in 1896 when the Ashoka Pillar inscription was found. It became a UNESCO World Heritage Site in 1997 and is one of the most sacred places in all of Buddhism.',
      photo: 'Photograph the reflection of the Mayadevi Temple in the sacred Puskarini pond at dawn for a breathtaking shot. The peaceful monastic zone is also stunning at golden hour.',
      location: 'Lumbini is in Rupandehi District, Lumbini Province, southwestern Nepal — close to the Indian border. A must-visit pilgrimage site!'
    },
    'Patan Durbar Square': {
      builder: 'The Malla Kings of Lalitpur built most of Patan Durbar Square between the 16th and 18th centuries. King Siddhi Narasimha Malla built the famous Krishna Mandir entirely of carved stone in 1637.',
      legend: 'Legend holds that Krishna and Radha themselves appeared to King Siddhi Narasimha Malla in a dream, inspiring him to build the Krishna Mandir. The 21 stone pinnacles represent the 21 achievements of the Malla dynasty!',
      architecture: 'Patan showcases three distinct styles: Newari pagoda temples, the unique stone-carved Krishna Mandir (Indian Shikhara style), and Mughal-influenced architecture. Every surface is carved with mythological scenes!',
      history: 'Patan, or Lalitpur meaning City of Fine Arts, is one of the oldest Buddhist cities in the world. Its artisans produced some of the finest bronze statues in all of Asia for over a thousand years.',
      photo: 'Stand at the center of the square at golden hour — the bronze statue of King Yoga Narendra Malla on his pillar creates a stunning silhouette against the temple skyline!',
      location: 'Patan Durbar Square is in Lalitpur, just south of Kathmandu, easily reachable by taxi or the Kathmandu-Lalitpur road.'
    }
  };

  const siteKnowledge = knowledgeBase[siteName];

  let reply = '';

  if (lowerMsg.includes('who built') || lowerMsg.includes('builder') || lowerMsg.includes('constructed') || lowerMsg.includes('origin') || lowerMsg.includes('found')) {
    reply = siteKnowledge?.builder || `${site} was established by ancient royal dynasties and master craftsmen who combined spiritual vision with extraordinary architectural skill.`;
  } else if (lowerMsg.includes('legend') || lowerMsg.includes('myth') || lowerMsg.includes('story') || lowerMsg.includes('secret') || lowerMsg.includes('magic')) {
    reply = siteKnowledge?.legend || `The legends of ${site} are extraordinary! Local oral traditions speak of divine interventions, miraculous events, and royal visions that guided the construction of this sacred place.`;
  } else if (lowerMsg.includes('architect') || lowerMsg.includes('style') || lowerMsg.includes('design') || lowerMsg.includes('structure') || lowerMsg.includes('built like')) {
    reply = siteKnowledge?.architecture || `The architecture of ${site} is a masterclass in traditional craftsmanship — intricate carvings, sacred geometry, and construction techniques passed down through generations of Newar artisans.`;
  } else if (lowerMsg.includes('when') || lowerMsg.includes('year') || lowerMsg.includes('how old') || lowerMsg.includes('age') || lowerMsg.includes('century') || lowerMsg.includes('history')) {
    reply = siteKnowledge?.history || `${site} has a rich history spanning several centuries. It has witnessed the rise and fall of kingdoms, survived natural disasters, and remains an active center of culture and devotion to this day.`;
  } else if (lowerMsg.includes('photo') || lowerMsg.includes('picture') || lowerMsg.includes('shot') || lowerMsg.includes('instag') || lowerMsg.includes('best spot')) {
    reply = siteKnowledge?.photo || `For the best photos at ${site}, visit at sunrise or golden hour — the light is magical! Look for interesting angles through doorways and archways to frame your shot perfectly.`;
  } else if (lowerMsg.includes('where') || lowerMsg.includes('location') || lowerMsg.includes('how to get') || lowerMsg.includes('reach') || lowerMsg.includes('address')) {
    reply = siteKnowledge?.location || `${site} is easily accessible and well-connected to major roads and transport hubs in Nepal. Ask any local — everyone knows the way to this beloved heritage landmark!`;
  } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg.includes('namaste') || lowerMsg.includes('hey')) {
    reply = `Namaste! Welcome to ${site}! I am Ara, your personal heritage guide. I know everything about this incredible place — its legends, history, architecture, and hidden stories. What would you like to discover today?`;
  } else if (lowerMsg.includes('thank') || lowerMsg.includes('bye') || lowerMsg.includes('goodbye') || lowerMsg.includes('great')) {
    reply = `It has been a pleasure guiding you through ${site}! This place holds so many more stories and secrets — I hope you carry its spirit with you. Come back anytime, and Namaste! 🙏`;
  } else if (lowerMsg.includes('fun') || lowerMsg.includes('interesting') || lowerMsg.includes('trivia') || lowerMsg.includes('fact') || lowerMsg.includes('cool')) {
    reply = siteKnowledge?.legend || `Here is a fascinating fact about ${site}: the craftsmen who built this did not use modern tools or machines — every detail was carved and assembled by hand, and yet it has stood for centuries! The precision and artistry is simply breathtaking.`;
  } else {
    reply = `Great question about ${site}! This heritage site is full of stories waiting to be discovered. You can ask me about its history, legends, architecture, best photo spots, or how to get here — I am your guide for all of it!`;
  }

  return {
    reply,
    source: 'Ara Heritage Guide',
  };
};

module.exports = {
  generateCulturalStory,
  chatWithGuide,
};
