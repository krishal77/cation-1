import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Play, Pause, Loader2, Mic, MicOff, Send } from "lucide-react";
import { generateStory, chatWithGuide, type StoryData, type ChatGuideMessage } from "../../services/api";
import { MascotSVG } from "../../components/common/MascotSVG";
import { Badge } from "../../components/common/Badge";
import { ProgressBar } from "../../components/common/ProgressBar";

export function AudioGuideScreen({ onBack, selectedSite }: { onBack: () => void; selectedSite: string }) {
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [, setLoading] = useState(true);

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatGuideMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const siteTitle = storyData?.title || selectedSite || "Heritage Site";

  useEffect(() => {
    if (!selectedSite) {
      setLoading(false);
      return;
    }
    setLoading(true);
    generateStory(selectedSite)
      .then(data => {
        setStoryData(data);
        const welcomeText = `Namaste! I am Ara, your human guide for ${selectedSite}. ${data.narrative}`;
        setChatHistory([{ sender: 'ara', text: welcomeText }]);
      })
      .catch(() => {
        const welcomeText = `Namaste! I am Ara, your personal heritage guide for ${selectedSite || 'this site'}. Ask me anything about its legends, history, or secrets!`;
        setChatHistory([{ sender: 'ara', text: welcomeText }]);
      })
      .finally(() => setLoading(false));
  }, [selectedSite]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isThinking]);

  const speakText = useCallback((text: string, playbackRate: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.rate = playbackRate * 0.88;
      utterance.pitch = 1.35;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();

      const cutePriority = [
        'Samantha', 'Zira', 'Aria', 'Ava', 'Nicky', 'Kate',
        'Fiona', 'Karen', 'Moira', 'Google UK English Female', 'Google US English',
      ];

      let chosenVoice: SpeechSynthesisVoice | undefined;

      for (const name of cutePriority) {
        chosenVoice = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
        if (chosenVoice) break;
      }

      if (!chosenVoice) {
        chosenVoice = voices.find(v => v.lang.startsWith('en') && (
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('girl') ||
          v.name.toLowerCase().includes('woman')
        ));
      }

      if (!chosenVoice) {
        chosenVoice = voices.find(v => v.lang.startsWith('en'));
      }

      if (chosenVoice) utterance.voice = chosenVoice;

      utterance.onend = () => {
        setPlaying(false);
        setProgress(100);
      };

      utterance.onboundary = (e) => {
        if (text.length > 0) {
          const pct = Math.min(100, Math.round((e.charIndex / text.length) * 100));
          setProgress(pct);
        }
      };

      window.speechSynthesis.speak(utterance);
      setPlaying(true);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
    }
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isThinking) return;

    setInputQuery('');
    const newHistory: ChatGuideMessage[] = [...chatHistory, { sender: 'user', text: query }];
    setChatHistory(newHistory);
    setIsThinking(true);

    try {
      const res = await chatWithGuide(selectedSite || 'Heritage Site', query, newHistory);
      const araReply = res.reply;
      setChatHistory([...newHistory, { sender: 'ara', text: araReply }]);
      speakText(araReply, rate);
    } catch {
      const fallbackReply = `I'm right here with you at ${selectedSite || 'this site'}! Ask me about its ancient history, builders, or hidden legends.`;
      setChatHistory([...newHistory, { sender: 'ara', text: fallbackReply }]);
      speakText(fallbackReply, rate);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleListening = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Voice speech recognition is not supported in this browser. Please type your question.');
        return;
      }

      if (isListening) {
        setIsListening(false);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          if (transcript) {
            handleSendMessage(transcript);
          }
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  const togglePlay = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (playing) {
        window.speechSynthesis.pause();
        setPlaying(false);
      } else {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setPlaying(true);
        } else {
          const lastAraMessage = [...chatHistory].reverse().find(m => m.sender === 'ara');
          speakText(lastAraMessage?.text || (storyData?.narrative || 'Welcome to the audio guide.'), rate);
        }
      }
    }
  };

  const handleRateChange = () => {
    const nextRate = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : 1;
    setRate(nextRate);
    if (playing) {
      const lastAraMessage = [...chatHistory].reverse().find(m => m.sender === 'ara');
      speakText(lastAraMessage?.text || (storyData?.narrative || 'Welcome to the audio guide.'), nextRate);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const suggestions = [
    "Tell me a secret legend",
    "Who built this monument?",
    "What is the architectural style?",
    "Best spots for photos?",
  ];

  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1 relative">
      <div className="px-5 pt-12 sm:pt-14 pb-3 flex items-center justify-between bg-white border-b border-[#E4E7EB] z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center text-[#222E1C]">
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[#222E1C] text-base font-black font-display block leading-tight">Ara Human Guide</span>
            <span className="text-[#5F6B5E] text-[10px] font-semibold">Interactive Voice & AI Companion</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRateChange}
            className="bg-[#EEF1F3] text-[#222E1C] border border-[#E4E7EB] text-xs font-bold px-2.5 py-1.5 rounded-full"
          >
            {rate}x
          </button>
        </div>
      </div>

      <div className="px-5 pt-4 pb-2 bg-gradient-to-b from-[#EAF6DD]/70 via-[#F7F9F6] to-[#F7F9F6] border-b border-[#E4E7EB]/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MascotSVG size={44} animate={playing || isThinking} />
            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${playing ? "bg-[#69A20D]" : "bg-emerald-400"}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h2 className="text-[#222E1C] font-black text-sm font-display">{selectedSite || "Heritage Site"}</h2>
              <Badge label="Ara Guide" color="sand" />
            </div>
            <p className="text-[#5F6B5E] text-xs font-medium leading-tight">
              {isListening ? "🎙️ Ara is listening..." : playing ? "🗣️ Ara is speaking..." : isThinking ? "🧠 Ara is thinking..." : "Ask Ara anything aloud or type below!"}
            </p>
          </div>
        </div>

        <div className="mt-3 bg-white rounded-2xl p-3 border border-[#E4E7EB] shadow-xs flex items-center gap-3">
          <button onClick={togglePlay} className="w-10 h-10 rounded-xl bg-[#23351F] text-white flex items-center justify-center shadow-sm">
            {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[#222E1C] text-xs font-bold truncate">{siteTitle}</p>
            <div className="mt-1">
              <ProgressBar value={progress} color="#69A20D" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {chatHistory.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ara' && (
              <div className="w-8 h-8 rounded-full bg-[#EAF6DD] border border-[#CAE5B1] flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                <MascotSVG size={22} />
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#23351F] text-white rounded-tr-xs shadow-xs'
                  : 'bg-white text-[#222E1C] border border-[#E4E7EB] shadow-xs rounded-tl-xs'
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-[#5F6B5E] text-xs font-medium italic py-2 px-3 bg-white/70 rounded-2xl border border-[#E4E7EB] w-max">
            <Loader2 size={14} className="animate-spin text-[#69A20D]" />
            Ara is gathering knowledge...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="px-5 py-2 overflow-x-auto scrollbar-hide flex gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(s)}
            className="flex-shrink-0 bg-white border border-[#E4E7EB] hover:border-[#69A20D] text-[#5F6B5E] text-xs font-bold px-3 py-1.5 rounded-full shadow-xs transition-all"
          >
            💬 {s}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-[#E4E7EB] shadow-md z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md'
                : 'bg-[#EAF6DD] text-[#23351F] border border-[#CAE5B1]'
            }`}
            title="Voice input"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} className="text-[#69A20D]" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? "Listening now..." : "Ask Ara about this site..."}
            className="flex-1 bg-[#EEF1F3] border border-[#E4E7EB] focus:border-[#69A20D] rounded-2xl px-4 py-3 text-sm text-[#222E1C] placeholder-[#94A3B8] outline-none transition-all font-medium"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isThinking}
            className="w-11 h-11 rounded-2xl bg-[#23351F] text-white flex items-center justify-center disabled:opacity-40 transition-all shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

