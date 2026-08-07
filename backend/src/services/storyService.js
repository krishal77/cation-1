const HeritageSite = require('../models/HeritageSite');

const generateCulturalStory = async (siteName, customPrompt = '') => {
  let siteDetails = null;
  try {
    siteDetails = await HeritageSite.findOne({ name: siteName });
  } catch (e) {}

  const defaultStories = {

    'Bindhyabasini Temple': {
      title: 'Echoes of Pokhara: The Sacred Bindhyabasini Temple',
      subtitle: 'Where the Divine Goddess Watches Over the Himalayas',
      narrative: 'Perched gracefully atop a pine-forested hill in the heart of Old Pokhara, the Bindhyabasini Temple has been the spiritual soul of this mountain city for over two centuries. Dedicated to Goddess Bhagwati — a fierce manifestation of Durga — the temple was established by King Siddhi Narayan Shah of the Kaski Kingdom, who is said to have brought the sacred deity idol all the way from Vindhyachal in northern India.\n\nThe ascent up the whitewashed stone staircases is itself a meditative journey. Bells ring in rhythmic waves. The smell of incense weaves through the cool Himalayan air. At the summit, pilgrims from across Nepal gather with offerings of red hibiscus and coconuts, their prayers carried skyward toward the snow-capped Annapurna range that frames the horizon in breathtaking grandeur.\n\nDuring the festival of Dashain, the temple becomes a sea of crimson and gold. Devotees queue for hours, the air electric with devotion. Locals say the Goddess herself descended upon this hilltop and chose it as her eternal dwelling — and standing here at sunrise, watching the mountains glow pink and gold, it is impossible not to believe them.',
      highlights: [
        'Sacred to Goddess Bhagwati (Durga) — protector deity of Pokhara',
        'Established by King Siddhi Narayan Shah of Kaski in the 18th century',
        'Panoramic views of Machhapuchhre (Fishtail Mountain) and the Annapurna Massif',
        'Spectacular Dashain festival celebrations with thousands of pilgrims',
        'Blend of Newari pagoda and traditional Pahari mountain temple architecture',
      ],
      facts: [
        { label: 'Founded', value: '18th Century' },
        { label: 'Deity', value: 'Goddess Bhagwati (Durga)' },
        { label: 'Location', value: 'Bagar Hill, Pokhara' },
        { label: 'Entry Fee', value: 'Free' },
        { label: 'Best Time', value: 'Sunrise · Dashain Festival' },
        { label: 'Style', value: 'Newari–Pahari Fusion' },
      ],
      chapters: [
        { title: 'The Royal Legend', body: 'King Siddhi Narayan Shah journeyed to India and returned with the sacred idol, establishing Nepal\'s first royal mountain shrine.' },
        { title: 'The Divine Presence', body: 'According to local belief, the Goddess herself chose this hilltop during a divine vision, blessing the surrounding valley with her protection for eternity.' },
        { title: 'Dashain at Dawn', body: 'Every October, the temple transforms into Nepal\'s most electric celebration — a chorus of thousands, crimson marigold garlands, and the beating of dhime drums echoing across Phewa Lake.' },
      ],
      quote: '"She watches over us from the hilltop. We climb to her in the morning, and she sends us back filled with light." — Local Devotee',
      tags: ['Temple', 'Goddess Durga', 'Pokhara', 'Himalayan Views', 'Royal History'],
    },
    'Lumbini': {
      title: 'The Sacred Grove: Birthplace of the Awakened One',
      subtitle: 'Where the Universe Paused and a New Path Began — 623 BCE',
      narrative: 'In the warm southern plains of Nepal, where sal trees sway in the breeze and sacred lotus ponds shimmer silver at dawn, an event occurred that would forever alter the course of human history. In 623 BCE, Queen Mayadevi of the Shakya Kingdom paused beneath a flowering Sal tree during her journey and gave birth to Prince Siddhartha Gautama — the man who would become the Buddha.\n\nLumbini today is a UNESCO World Heritage Site, a place of profound silence and universal peace. The Maya Devi Temple, built directly over the nativity stone, marks the exact spot of his birth. A sandstone panel inside depicts the moment — the Queen reaching up to grasp a branch, the newborn emerging from her side, lotus flowers blooming at his feet.\n\nBeyond the temple, the sacred Puskarini pond still holds water, its surface reflecting centuries of prayer. Pilgrims from Japan, Sri Lanka, Thailand, Korea, and a hundred other nations have each built magnificent monasteries along the monastic zones — a living testament to how one birth in a forest grove changed billions of lives across millennia.',
      highlights: [
        'Birthplace of Siddhartha Gautama (Lord Buddha) — 623 BCE',
        'UNESCO World Heritage Site since 1997',
        'Maya Devi Temple built over the sacred nativity stone',
        'The historic Ashoka Pillar (249 BCE) — oldest monument in Nepal',
        'Sacred Puskarini Pond where Queen Mayadevi bathed before the birth',
        'International Monastic Zone with temples from 40+ countries',
      ],
      facts: [
        { label: 'Event Date', value: '623 BCE' },
        { label: 'UNESCO Status', value: 'World Heritage Since 1997' },
        { label: 'Location', value: 'Rupandehi District, Nepal' },
        { label: 'Entry Fee', value: 'NPR 300' },
        { label: 'Best Time', value: 'Buddha Jayanti (May Full Moon)' },
        { label: 'Significance', value: 'Birthplace of Buddhism' },
      ],
      chapters: [
        { title: 'The Birth of the Buddha', body: 'When Siddhartha was born, it is said that lotus flowers bloomed with each of his seven steps, and the universe itself celebrated with fragrant rains and celestial music.' },
        { title: 'Emperor Ashoka\'s Pilgrimage', body: 'In 249 BCE, the great Emperor Ashoka traveled here from India, erected a stone pillar, reduced the local tax, and declared Lumbini\'s eternal sacred status.' },
        { title: 'The International Peace Garden', body: 'Today, monasteries from Japan, Korea, Myanmar, China and 40+ nations surround the sacred garden — a living monument to global unity through spiritual heritage.' },
      ],
      quote: '"Happiness will never come to those who fail to appreciate what they already have." — The Buddha',
      tags: ['Buddhism', 'UNESCO', 'Peace', 'Pilgrimage', 'Ancient History'],
    },
    'Patan Durbar Square': {
      title: 'City of Fine Arts: The Jewel of the Malla Empire',
      subtitle: 'Where Bronze, Stone, and Wood Tell Ten Centuries of Stories',
      narrative: 'Walk into Patan Durbar Square and you walk into a living museum — one that has never closed, never stopped breathing, never forgotten its ancient soul. Lalitpur, the City of Fine Arts, is one of the oldest Buddhist cities in the world, and its durbar square is its crowning glory.\n\nThe Malla kings who ruled here from the 12th to 18th centuries were obsessed with beauty. They commissioned master Newar craftsmen to build temples of ever-increasing ambition — each king trying to outshine his predecessor in devotion and artistry. The result is a square packed with architectural masterpieces: the stone-carved Krishna Mandir (1637), the golden Taleju Bhawani temple, the octagonal Char Narayan temple, and the brass statue of King Yoga Narendra Malla perched on a pillar, still gazing over his realm.\n\nThe craftsmen of Patan were so revered that they were invited to build temples across Tibet and China. Their metalwork — bronze statues of exquisite delicacy — is considered among the finest ever produced by human hands. In the Patan Museum, you can trace this golden lineage through centuries of sacred art that shaped Buddhism and Hinduism across all of Asia.',
      highlights: [
        'Krishna Mandir (1637) — entirely built of carved stone, no bricks used',
        'Three historic chowks (courtyards): Mul, Sundari, and Keshav Narayan',
        'Golden Temple (Hiranya Varna Mahavihar) — Buddhist temple with golden facade',
        'Patan Museum — finest collection of sacred Himalayan metalwork in the world',
        'UNESCO World Heritage Site and active cultural center since the 12th century',
        'Bronze casting tradition continues today in surrounding workshops',
      ],
      facts: [
        { label: 'Peak Era', value: '12th–18th Century Malla Rule' },
        { label: 'UNESCO Status', value: 'World Heritage Site' },
        { label: 'Location', value: 'Lalitpur, Nepal' },
        { label: 'Entry Fee', value: 'NPR 1,000' },
        { label: 'Best Time', value: 'Morning · Rato Machhindranath Festival' },
        { label: 'Architecture', value: 'Newari · Shikhara Fusion' },
      ],
      chapters: [
        { title: 'The Dream of King Siddhi Narasimha', body: 'In 1637, the king dreamed of Lord Krishna and Radha standing in his courtyard. He built the stone Krishna Mandir — entirely without bricks — as an act of pure devotion to that vision.' },
        { title: 'Masters of Bronze', body: 'Patan\'s Newar artisans perfected the lost-wax casting method over 1,000 years. Their bronze statues of deities were so revered they were exported to palaces across Asia.' },
        { title: 'The 21 Pinnacles', body: 'The Krishna Mandir\'s 21 stone pinnacles represent the 21 military victories of the Malla dynasty — each carved with scenes from the Mahabharata and Ramayana.' },
      ],
      quote: '"Art is not what you see, but what you make others see." — The craftsmen of Patan lived this truth for a thousand years.',
      tags: ['UNESCO', 'Architecture', 'Malla Dynasty', 'Metalwork', 'Buddhist Art'],
    },
  };

  const selectedStory = defaultStories[siteName] || {
    title: siteDetails?.name ? `The Sacred Heritage of ${siteDetails.name}` : `Sacred Heritage: ${siteName}`,
    subtitle: 'A Journey Through Time and Devotion',
    narrative: siteDetails?.description || `${siteName} stands as a timeless monument to Nepal's extraordinary cultural and spiritual heritage. Its ancient stones hold centuries of devotion, artistic mastery, and living tradition that continue to inspire pilgrims and travelers from around the world.`,
    highlights: siteDetails?.tags?.map(t => t.replace(/_/g, ' ')) || ['Ancient cultural heritage', 'Sacred architectural traditions', 'Living spiritual culture'],
    facts: [
      { label: 'Location', value: siteDetails?.location || 'Nepal' },
      { label: 'Type', value: 'Heritage Site' },
    ],
    chapters: [],
    quote: '"Nepal is not just a destination — it is a feeling that stays with you forever."',
    tags: ['Nepal', 'Heritage', 'Culture'],
  };

  return {
    siteName,
    title: selectedStory.title,
    subtitle: selectedStory.subtitle,
    narrative: selectedStory.narrative,
    highlights: selectedStory.highlights || [],
    facts: selectedStory.facts || [],
    chapters: selectedStory.chapters || [],
    quote: selectedStory.quote || '',
    tags: selectedStory.tags || [],
    location: siteDetails?.location || 'Nepal',
    source: 'Culture Guide Curated Catalog',
    generatedAt: new Date(),
  };
};

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
    reply = siteKnowledge?.legend || `The legends of ${site} are extraordinary! Local oral traditions speak of divine interventions, miraculous events, and royal visions that guided its creation.`;
  } else if (lowerMsg.includes('architect') || lowerMsg.includes('style') || lowerMsg.includes('design') || lowerMsg.includes('structure') || lowerMsg.includes('built like')) {
    reply = siteKnowledge?.architecture || `The architecture of ${site} is a masterclass in traditional craftsmanship — intricate carvings, sacred geometry, and construction techniques passed down through generations.`;
  } else if (lowerMsg.includes('when') || lowerMsg.includes('year') || lowerMsg.includes('how old') || lowerMsg.includes('age') || lowerMsg.includes('century') || lowerMsg.includes('history')) {
    reply = siteKnowledge?.history || `${site} has a rich history spanning several centuries, witnessing the rise and fall of kingdoms, surviving natural disasters, and remaining an active center of culture and devotion.`;
  } else if (lowerMsg.includes('photo') || lowerMsg.includes('picture') || lowerMsg.includes('shot') || lowerMsg.includes('instag') || lowerMsg.includes('best spot')) {
    reply = siteKnowledge?.photo || `For the best photos at ${site}, visit at sunrise or golden hour — the light is magical! Look for interesting angles through doorways and archways to frame your shot.`;
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

  return { reply, source: 'Ara Heritage Guide' };
};

module.exports = { generateCulturalStory, chatWithGuide };
