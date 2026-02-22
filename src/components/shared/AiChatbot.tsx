import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Loader2, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import './AiChatBot.css';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_AI_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/** Language-specific greeting and system prompts */
const LANG_CONFIG: Record<string, { greeting: string; placeholder: string; thinking: string; locale: string }> = {
  vi: {
    greeting: 'Xin chào! Tôi là Impact AI. Tôi có thể giúp gì cho bạn về dữ liệu nông nghiệp?',
    placeholder: 'Hỏi Impact AI về dự án...',
    thinking: 'Đang phân tích dữ liệu...',
    locale: 'Tiếng Việt',
  },
  en: {
    greeting: 'Hello! I am Impact AI. How can I help you with agricultural data?',
    placeholder: 'Ask Impact AI about the project...',
    thinking: 'Analyzing data...',
    locale: 'English',
  },
  lo: {
    greeting: 'ສະບາຍດີ! ຂ້ອຍແມ່ນ Impact AI. ຂ້ອຍສາມາດຊ່ວຍຫຍັງໄດ້?',
    placeholder: 'ຖາມ Impact AI ກ່ຽວກັບໂຄງການ...',
    thinking: 'ກຳລັງວິເຄາະຂໍ້ມູນ...',
    locale: 'ພາສາລາວ',
  },
  id: {
    greeting: 'Halo! Saya Impact AI. Apa yang bisa saya bantu tentang data pertanian?',
    placeholder: 'Tanyakan Impact AI tentang proyek...',
    thinking: 'Menganalisis data...',
    locale: 'Bahasa Indonesia',
  },
};

function getSystemPrompt(lang: string, userContext: string, dataContext: string): string {
  const locale = LANG_CONFIG[lang]?.locale || 'English';
  return `You are Impact AI, a data analysis assistant for the Impact Slow Forest agricultural project.
You help staff analyze farm data across Vietnam, Laos, and Indonesia.

CURRENT USER CONTEXT:
${userContext}

LIVE DATA SUMMARY:
${dataContext}

INSTRUCTIONS:
- Respond in ${locale}
- Be concise, professional, and data-driven
- When asked about data, reference the live data summary above
- You can analyze trends, compare metrics, and provide agricultural insights
- If you don't have enough data, say so clearly
- For questions outside your scope, politely redirect to the relevant team`;
}

const AiChatBot: React.FC = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const lang = i18n.language?.split('-')[0] || 'en';
  const config = LANG_CONFIG[lang] || LANG_CONFIG.en;

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: config.greeting },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update greeting when language changes
  useEffect(() => {
    const newConfig = LANG_CONFIG[lang] || LANG_CONFIG.en;
    setMessages([{ role: 'bot', text: newConfig.greeting }]);
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const buildUserContext = (): string => {
    if (!user) return 'Not authenticated';
    const role = (user.expand as any)?.role;
    return [
      `Name: ${user.name}`,
      `Country: ${user.country}`,
      `Role: ${role?.name || 'unknown'}`,
      `Department: ${user.department || 'N/A'}`,
    ].join('\n');
  };

  const buildDataContext = async (): Promise<string> => {
    try {
      const countryFilter = user?.country && user.country !== 'global'
        ? `country = "${user.country}"`
        : '';

      const [farmers, coops, farms, annualData] = await Promise.all([
        pb.collection('farmers').getList(1, 1, { filter: countryFilter }),
        pb.collection('cooperatives').getList(1, 1, { filter: countryFilter }),
        pb.collection('farms').getFullList({ filter: countryFilter, fields: 'area_ha,commodity' }),
        pb.collection('farmer_annual_data').getList(1, 5, {
          filter: countryFilter,
          sort: '-year',
        }),
      ]);

      const totalArea = farms.reduce((sum, f) => sum + ((f.area_ha as number) || 0), 0);
      const coffeeCount = farms.filter((f) => f.commodity === 'coffee').length;
      const cacaoCount = farms.filter((f) => f.commodity === 'cacao').length;

      const lines = [
        `Total farmers: ${farmers.totalItems}`,
        `Total cooperatives: ${coops.totalItems}`,
        `Total farms: ${farms.length} (Coffee: ${coffeeCount}, Cacao: ${cacaoCount})`,
        `Total farm area: ${totalArea.toFixed(2)} ha`,
      ];

      if (annualData.items.length > 0) {
        lines.push(
          `Recent production: ${annualData.items
            .map((i) => `${i.year}: ${i.annual_cherry_kg || 0} kg cherry`)
            .join(', ')}`
        );
      }

      return lines.join('\n');
    } catch (err) {
      console.error('Error building data context:', err);
      return 'Data unavailable at this time.';
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const [userContext, dataContext] = await Promise.all([
        Promise.resolve(buildUserContext()),
        buildDataContext(),
      ]);

      const systemPrompt = getSystemPrompt(lang, userContext, dataContext);

      // Build conversation history for context
      const contents = [
        { role: 'user' as const, parts: [{ text: systemPrompt }] },
        { role: 'model' as const, parts: [{ text: 'Understood. I will help with agricultural data analysis.' }] },
        ...messages
          .filter((m) => m.role === 'user' || m.role === 'bot')
          .slice(-10)
          .map((m) => ({
            role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
            parts: [{ text: m.text }],
          })),
        { role: 'user' as const, parts: [{ text: userMessage }] },
      ];

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error?.message || `API error ${response.status}`);
      }

      const data = await response.json();
      const botResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        (lang === 'vi'
          ? 'Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi của bạn.'
          : 'Sorry, I encountered an issue processing your question.');

      setMessages((prev) => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text:
            lang === 'vi'
              ? 'Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.'
              : lang === 'lo'
                ? 'ເກີດຂໍ້ຜິດພາດ. ກະລຸນາລອງໃໝ່.'
                : lang === 'id'
                  ? 'Terjadi kesalahan. Silakan coba lagi nanti.'
                  : 'An error occurred connecting to AI. Please try again later.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-widget">
      <button
        className="ai-chat-fab"
        onClick={() => setIsOpen(!isOpen)}
        title="Impact AI"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <img src="/logo.png" alt="Slow Forest" className="ai-chat-logo" />
        )}
      </button>

      {isOpen && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <span>Impact AI</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] opacity-70 flex items-center gap-1">
                <Globe size={10} />
                {lang.toUpperCase()}
              </span>
              <X size={20} className="cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`ai-chat-message ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="ai-chat-typing">
                <Loader2 size={16} className="animate-spin inline mr-2" />
                {config.thinking}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-chat-input-container">
            <input
              type="text"
              className="ai-chat-input"
              placeholder={config.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              className="ai-chat-send-btn"
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatBot;
