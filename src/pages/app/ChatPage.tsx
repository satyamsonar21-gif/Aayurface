import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, RefreshCw, Sparkles, User, Bot } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import type { ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';

const SUGGESTIONS = [
  "How to balance excess Pitta heat in skin?",
  "Herbal remedies for dry Vata patches",
  "Morning Dinacharya ritual for natural glow",
  "Benefits of Kumkumadi Tailam & Neem"
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      session_id: 'default',
      user_id: 'current',
      role: 'assistant',
      content: "Namaste. I am your Ayurvedic wellness intelligence guide. You may ask about your skin constitution, classical herbs, Dinacharya rituals, or dietary principles for balanced skin harmony.",
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
      let aiResponseText = "In Ayurvedic philosophy, skin equilibrium is directly connected to internal doshic balance and Agni (digestive fire). Cooling botanicals like Chandana (Sandalwood) and Manjistha help purify and soothe, while adequate hydration supports natural lustre.";
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('pitta') || lowerText.includes('heat') || lowerText.includes('red') || lowerText.includes('acne')) {
        aiResponseText = "Excess Pitta often manifests as heat, redness, or localized inflammation. Classical recommendations include cooling Lepas with Neem, Rosewater, and pure Sandalwood. Internally, favor sweet, bitter, and astringent tastes while avoiding pungent, overly spicy foods.";
      } else if (lowerText.includes('vata') || lowerText.includes('dry') || lowerText.includes('flak')) {
        aiResponseText = "Vata imbalance causes dryness, moisture depletion, and fine roughness. Nourish the skin with gentle warm oil Abhyanga using Sesame or Kumkumadi Tailam. Drink warm CCF tea (Cumin, Coriander, Fennel) to support deep tissue hydration.";
      } else if (lowerText.includes('kapha') || lowerText.includes('oil') || lowerText.includes('pore')) {
        aiResponseText = "Kapha skin tendencies involve excess sebum, congestion, and sluggishness. Use gentle exfoliating pastes of Triphala or Multani Mitti with rose water. Avoid heavy oil cleansers and favor stimulating, warm herbal teas.";
      } else if (lowerText.includes('routine') || lowerText.includes('dinacharya')) {
        aiResponseText = "A classical morning Dinacharya begins with splashing cool water on the face, followed by gentle herbal cleansing, applying a few drops of constitution-appropriate oil (Tailam), and practicing 5 minutes of calming Pranayama to balance Prana Vayu.";
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
    }, 1200);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: generateId(),
        session_id: 'default',
        user_id: 'current',
        role: 'assistant',
        content: "Namaste. Conversation refreshed. What Ayurvedic skin query would you like to explore?",
        created_at: new Date().toISOString()
      }
    ]);
  };

  return (
    <PageWrapper contentClassName="p-0 sm:p-0 lg:p-0 max-w-4xl h-[calc(100vh-4rem)] lg:h-[100vh] flex flex-col">
      <div className="flex-1 flex flex-col h-full bg-background-primary overflow-hidden font-body">
        
        {/* Chat Header */}
        <div className="px-6 py-4 bg-background-surface border-b border-border-default flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center shadow-sm">
              <Bot size={18} className="text-brand-accent" />
            </div>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-semibold text-text-primary">
                Ayurvedic Intelligence Guide
              </h1>
              <p className="text-[11px] text-text-secondary font-body">
                Conversational Botanical & Constitutional Knowledge
              </p>
            </div>
          </div>

          <button 
            onClick={handleNewChat}
            title="Start new conversation"
            aria-label="Start new conversation"
            className="p-2 text-text-secondary hover:text-brand-primary hover:bg-background-subtle rounded-md transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-hide">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Sparkles size={14} className="text-brand-accent" />
                </div>
              )}

              <div 
                className={`max-w-[82%] sm:max-w-[75%] p-4 text-body-md leading-relaxed rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-brand-primary text-text-inverse shadow-sm' 
                    : 'bg-background-surface border border-border-default text-text-primary shadow-sm'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-background-surface border border-border-default text-text-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <User size={14} />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={14} className="text-brand-accent" />
              </div>
              <div className="bg-background-surface border border-border-default px-4 py-3 rounded-lg flex gap-1.5 items-center shadow-sm">
                <span className="w-2 h-2 bg-brand-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-brand-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="px-4 sm:px-6 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide border-t border-border-default/40 bg-background-primary/50 shrink-0">
            <div className="flex gap-2">
              {SUGGESTIONS.map((sug, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="bg-background-surface border border-border-default text-text-secondary hover:text-brand-primary hover:border-brand-primary/40 text-caption font-body font-medium px-3.5 py-1.5 rounded-full transition-colors shrink-0 shadow-sm cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Input Form */}
        <div className="p-4 sm:px-6 bg-background-surface border-t border-border-default shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
            className="flex items-center gap-2 max-w-4xl mx-auto"
          >
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about skin doshas, herbs, or recipes..."
              className="flex-1 bg-background-primary border border-border-default rounded-md px-4 py-3 font-body text-body-md text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              aria-label="Send query"
              className="w-12 h-12 bg-brand-primary text-text-inverse rounded-md flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary-hover transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[11px] text-text-tertiary text-center mt-2 font-body">
            Wellness guidance rooted in classical texts. Not a substitute for medical diagnosis.
          </p>
        </div>

      </div>
    </PageWrapper>
  );
}
