import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, RefreshCw } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import type { ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';

const SUGGESTIONS = [
  "Tips for oily skin",
  "How to clear acne naturally?",
  "Morning Ayurvedic routine",
  "Best herbs for glowing skin"
];

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      session_id: 'default',
      user_id: 'current',
      role: 'assistant',
      content: "Namaste 🌿 I'm your Ayurvedic skin guide. How can I help you today?",
      created_at: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      session_id: 'default',
      user_id: 'current',
      role: 'user',
      content: text.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = "🌿 Maintaining balance is key in Ayurveda. Eating cooling foods, staying hydrated, and using gentle herbs like Neem or Sandalwood can promote overall skin health. Would you like more specific advice?";
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('oily')) {
        aiResponseText = "🌿 For oily skin (Kapha imbalance), try mixing fuller's earth (Multani Mitti) with rose water. Avoid heavy creams and wash your face with a gentle herbal cleanser twice a day.";
      } else if (lowerText.includes('acne')) {
        aiResponseText = "🌿 Acne often indicates excess Pitta (heat). Try applying a paste of Neem and Turmeric to the affected areas. Drink aloe vera juice in the morning to cool your system from within.";
      } else if (lowerText.includes('routine')) {
        aiResponseText = "🌿 A morning Ayurvedic routine: Splash your face with cool water 7 times, gently massage a few drops of kumkumadi tailam (if dry) or aloe gel, and drink warm water with lemon to flush toxins.";
      }

      const aiMsg: ChatMessage = {
        id: generateId(),
        session_id: 'default',
        user_id: 'current',
        role: 'assistant',
        content: aiResponseText,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: generateId(),
        session_id: 'default',
        user_id: 'current',
        role: 'assistant',
        content: "Namaste 🌿 I'm your Ayurvedic skin guide. How can I help you today?",
        created_at: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="h-[100dvh] bg-cream flex flex-col relative">
      <TopBar 
        title="Ayurvedic Guide 🌿" 
        onBack={() => navigate('/home')}
        rightAction={
          <button onClick={handleNewChat} className="p-2 text-herbal hover:bg-leaf-soft rounded-full transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        }
      />
      
      <div className="flex-1 overflow-y-auto pt-20 pb-28 px-4 flex flex-col gap-4 scrollbar-hide">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-leaf-soft text-charcoal rounded-[16px_16px_0_16px]' 
                  : 'bg-sandalwood text-charcoal rounded-[0_16px_16px_16px]'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-sandalwood px-4 py-3 rounded-[0_16px_16px_16px] flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-charcoal/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-charcoal/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-charcoal/40 rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="absolute bottom-24 left-0 right-0 px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex gap-2">
            {SUGGESTIONS.map((sug, i) => (
              <button 
                key={i}
                onClick={() => handleSend(sug)}
                className="bg-white border border-warmgray text-charcoal-light text-xs px-4 py-2 rounded-pill hover:bg-leaf-soft transition-colors flex-shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-cream/90 backdrop-blur-md border-t border-warmgray">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
          className="flex items-center gap-2"
        >
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white border border-warmgray rounded-pill px-4 py-3 text-sm focus:outline-none focus:border-herbal transition-colors text-charcoal"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="w-12 h-12 bg-herbal rounded-full flex items-center justify-center text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-herbal-dark transition-colors flex-shrink-0"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
