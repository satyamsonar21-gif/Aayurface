import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, RefreshCw, Sparkles, User, Bot, BookOpen, ShieldCheck, AlertCircle } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import type { ChatMessage } from '@/types';
import type { Citation } from '@/types/rag';
import { generateId } from '@/lib/utils';
import { getConsultationResponse } from '@/lib/rag/consultationService';

interface ConsultationDisplayMessage extends ChatMessage {
  citations?: Citation[];
  isGrounded?: boolean;
  fallbackTriggered?: boolean;
}

const SUGGESTIONS = [
  "Why was this recommendation made?",
  "What should I do tonight?",
  "What does my observation mean?",
  "How to balance excess Pitta heat in skin?"
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ConsultationDisplayMessage[]>([
    {
      id: '1',
      session_id: 'default',
      user_id: 'current',
      role: 'assistant',
      content: "Namaste. I am Ayu, your personal Ayurvedic wellness guide. You may ask about your skin constitution, classical herbs, Dinacharya rituals, or how your facial observations align with classical principles.",
      created_at: new Date().toISOString(),
      isGrounded: true
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

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ConsultationDisplayMessage = {
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

    try {
      // Execute genuine grounded RAG consultation pipeline
      const response = await getConsultationResponse({
        query: text.trim(),
        history: messages.map(m => ({ role: m.role, content: m.content })),
        userId: 'current'
      });

      const aiMsg: ConsultationDisplayMessage = {
        id: generateId(),
        session_id: 'default',
        user_id: 'current',
        role: 'assistant',
        content: response.reply,
        citations: response.citations,
        isGrounded: response.isGrounded,
        fallbackTriggered: response.fallbackTriggered,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: ConsultationDisplayMessage = {
        id: generateId(),
        session_id: 'default',
        user_id: 'current',
        role: 'assistant',
        content: "A temporary processing error occurred while retrieving classical Ayurvedic texts. Please try your question again.",
        isGrounded: false,
        fallbackTriggered: true,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: generateId(),
        session_id: 'default',
        user_id: 'current',
        role: 'assistant',
        content: "Namaste. Conversation refreshed. What Ayurvedic skin or ritual query would you like to explore with Ayu?",
        created_at: new Date().toISOString(),
        isGrounded: true
      }
    ]);
  };

  return (
    <PageWrapper contentClassName="p-0 sm:p-0 lg:p-0 max-w-4xl h-[calc(100vh-4rem)] lg:h-[100vh] flex flex-col">
      <div className="flex-1 flex flex-col h-full bg-background-primary overflow-hidden font-body">
        
        {/* Chat Header */}
        <div className="px-6 py-4 bg-background-surface border-b border-border-default flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center shadow-sm">
              <Bot size={20} className="text-brand-accent" />
            </div>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-semibold text-text-primary">
                Ayu — Ayurvedic Wellness Guide
              </h1>
              <p className="text-[11px] text-text-secondary font-body">
                Evidence-Grounded Classical Shastra & Botanical Knowledge
              </p>
            </div>
          </div>

          <button 
            onClick={handleNewChat}
            title="Start new conversation"
            aria-label="Start new conversation"
            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-brand-primary hover:bg-background-subtle rounded-md transition-colors cursor-pointer"
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
                className={`max-w-[85%] sm:max-w-[78%] p-4 text-body-md leading-relaxed rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-brand-primary text-text-inverse shadow-sm' 
                    : 'bg-background-surface border border-border-default text-text-primary shadow-sm'
                }`}
              >
                {/* Assistant Grounding Badge */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-border-default/60">
                    {msg.isGrounded ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={12} className="text-emerald-600" />
                        Grounded in Classical Corpus
                      </span>
                    ) : msg.fallbackTriggered ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        <AlertCircle size={12} className="text-amber-600" />
                        Educational Safety Boundary
                      </span>
                    ) : null}
                  </div>
                )}

                {/* Message Body with Markdown-like Paragraphs */}
                <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
                  {msg.content}
                </div>

                {/* Classical Citations Tray */}
                {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border-default/80">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary mb-2">
                      <BookOpen size={13} className="text-brand-primary" />
                      Classical Citations & Provenance:
                    </div>
                    <div className="space-y-1.5">
                      {msg.citations.map((cit, idx) => (
                        <div
                          key={idx}
                          className="text-[11px] p-2 bg-background-subtle rounded border border-border-default/50 text-text-secondary"
                        >
                          <span className="font-semibold text-text-primary">{cit.sourceTitle}</span>
                          <span className="mx-1">•</span>
                          <span>{cit.location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
          <div className="px-4 sm:px-6 py-2.5 overflow-x-auto whitespace-nowrap scrollbar-hide border-t border-border-default/40 bg-background-primary/50 shrink-0">
            <div className="flex gap-2 items-center">
              {SUGGESTIONS.map((sug, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="bg-background-surface border border-border-default text-text-secondary hover:text-brand-primary hover:border-brand-primary/40 text-caption font-body font-medium px-4 py-2 min-h-[44px] flex items-center justify-center rounded-full transition-colors shrink-0 shadow-sm cursor-pointer"
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
              disabled={!inputValue.trim() || isTyping}
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
