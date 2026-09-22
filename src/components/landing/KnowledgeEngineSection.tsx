import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Database, Search, Sparkles, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export default function KnowledgeEngineSection() {
  const [showMethodology, setShowMethodology] = useState(false);

  const classicalTexts = [
    {
      title: 'Charaka Samhita',
      focus: 'Internal balance, constitutional principles (Tridosha), and systemic wellness routines.'
    },
    {
      title: 'Sushruta Samhita',
      focus: 'Physical observation, structural harmony, and botanical formulation treatises.'
    },
    {
      title: 'Ashtanga Hridaya',
      focus: 'Concise daily rituals (Dinacharya), seasonal adaptation (Ritucharya), and prevention.'
    },
    {
      title: 'Bhavaprakasha',
      focus: 'Dravyaguna (botanical science), herb qualities, and whole-plant synergy.'
    }
  ];

  return (
    <section className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-4">
            Classical Grounding
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Knowledge should <br/>
            <span className="italic text-[#6B8E7D] font-normal">have roots.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C6660] font-body leading-relaxed">
            Generic language models often invent recommendations when asked about traditional remedies. AayurFace grounds every wellness insight in authentic classical Ayurvedic literature, ensuring that modern guidance remains faithful to recognized source texts.
          </p>
        </motion.div>

        {/* The 4-Stage Knowledge Journey */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="p-6 bg-[#FAF8F5] border border-[#E6DFD5] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block mb-4">Stage 01</span>
              <div className="w-10 h-10 rounded-full bg-white border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F] mb-4">
                <BookOpen size={18} />
              </div>
              <h3 className="font-editorial text-xl text-[#1A1F1C] mb-2">Classical Compendiums</h3>
              <p className="text-xs text-[#5C6660] leading-relaxed">
                Authoritative treatises cataloging plant attributes, seasonal care, and doshic equilibrium.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#8A948E] mt-4 block">Charaka · Sushruta · Ashtanga</span>
          </div>

          <div className="p-6 bg-[#FAF8F5] border border-[#E6DFD5] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block mb-4">Stage 02</span>
              <div className="w-10 h-10 rounded-full bg-white border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F] mb-4">
                <Database size={18} />
              </div>
              <h3 className="font-editorial text-xl text-[#1A1F1C] mb-2">Structured Knowledge</h3>
              <p className="text-xs text-[#5C6660] leading-relaxed">
                Curated domain models mapping classical concepts, contraindications, and ritual timings.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#8A948E] mt-4 block">Domain Knowledge Base</span>
          </div>

          <div className="p-6 bg-[#FAF8F5] border border-[#E6DFD5] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block mb-4">Stage 03</span>
              <div className="w-10 h-10 rounded-full bg-white border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F] mb-4">
                <Search size={18} />
              </div>
              <h3 className="font-editorial text-xl text-[#1A1F1C] mb-2">Context-Aware Retrieval</h3>
              <p className="text-xs text-[#5C6660] leading-relaxed">
                Searches for verified passages matching your personal constitution, observations, and current season.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#8A948E] mt-4 block">Relevance-Gated</span>
          </div>

          <div className="p-6 bg-[#FAF8F5] border border-[#E6DFD5] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block mb-4">Stage 04</span>
              <div className="w-10 h-10 rounded-full bg-white border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F] mb-4">
                <Sparkles size={18} />
              </div>
              <h3 className="font-editorial text-xl text-[#1A1F1C] mb-2">Grounded Guidance</h3>
              <p className="text-xs text-[#5C6660] leading-relaxed">
                Provides actionable, calm recommendations with transparent citations and safety cautions.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#8A948E] mt-4 block">Zero Generative Hallucination</span>
          </div>
        </div>

        {/* Grounded Classical Texts Grid */}
        <div className="mb-12">
          <h4 className="font-editorial text-2xl text-[#1A1F1C] mb-6 text-center">
            Authoritative Classical Sources Referenced
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {classicalTexts.map(text => (
              <div key={text.title} className="p-4 bg-[#FAF8F5] border border-[#E6DFD5]">
                <h5 className="font-editorial text-lg text-[#1E3A2F] mb-1 font-semibold">{text.title}</h5>
                <p className="text-xs text-[#5C6660] leading-relaxed">{text.focus}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Level 3: Research & Architecture Drawer */}
        <div className="max-w-4xl mx-auto border border-[#E6DFD5] bg-[#FAF8F5] p-5">
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full flex items-center justify-between text-left text-xs font-mono text-[#1E3A2F] uppercase tracking-wider font-semibold cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#C5A059]" />
              <span>Level 3 Architecture: Grounded Retrieval Pipeline &amp; Hallucination Prevention</span>
            </div>
            {showMethodology ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {showMethodology && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-4 mt-4 border-t border-[#E6DFD5] text-xs text-[#5C6660] space-y-3 font-mono leading-relaxed"
              >
                <p>
                  <strong>Knowledge Vector Architecture:</strong> Authoritative translations of classical compendiums are segmented into semantically coherent passages with verse metadata and indexed using PostgreSQL <code>pgvector</code>.
                </p>
                <p>
                  <strong>Strict Fallback Gating:</strong> During runtime synthesis, the system enforces a strict similarity threshold. If fewer than 2 verified classical passages meet relevance requirements, the model is strictly prohibited from improvising remedies and triggers a deterministic fallback notice: <em>"Specific classical citations for this unique combination could not be verified in our knowledge base. General balancing wellness guidelines have been provided."</em>
                </p>
                <p className="text-[#8A948E]">
                  This architecture prevents hallucinated Sanskrit or non-classical remedies from entering the user experience.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
