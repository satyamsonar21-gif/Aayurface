import { motion } from 'framer-motion';
import { Globe, Sun, ShieldCheck } from 'lucide-react';

export default function ResponsibleDevelopmentSection() {
  const principles = [
    {
      title: 'Diverse Skin Phenotypes',
      icon: Globe,
      desc: 'Indian skin spans a rich spectrum of Fitzpatrick and Individual Typology Angle (ITA) tones. Standardized observation prevents skewed colorimetry.',
    },
    {
      title: 'Varied Lighting & Climates',
      icon: Sun,
      desc: 'From arid desert dry zones to coastal tropical humidity, ambient conditions alter skin hydration and surface warmth throughout the year.',
    },
    {
      title: 'Responsible Evaluation',
      icon: ShieldCheck,
      desc: 'We do not claim universal perfection. We actively investigate biases and continuously evaluate our algorithms against diverse, representative data.',
    },
  ];

  return (
    <section className="w-full bg-[#FFFFFF] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] block mb-3 font-semibold">
            Representation &amp; Ethics
          </span>
          <h2 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1F1C] leading-[1.12] mb-6">
            Why Indian-skin <br/>
            <span className="italic text-[#1E3A2F] font-normal">representation matters.</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#1E3A2F] font-display font-serif italic mb-4 max-w-2xl mx-auto">
            "Skin appearance can vary across skin tones, lighting conditions and environments. AayurFace treats representation and standardized capture as important parts of responsible development."
          </p>
          <p className="text-base text-[#5C6660] font-body leading-relaxed max-w-2xl mx-auto">
            Most computer vision skin models were trained on narrow datasets under clinical studio lighting. AayurFace prioritizes diverse real-world Indian environmental conditions, understanding that healthy skin expresses itself uniquely across every tone.
          </p>
        </motion.div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 bg-[#FAF8F5] border border-[#E6DFD5] rounded-sm hover:border-[#C5A059] transition-all shadow-xs"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F] mb-5">
                  <Icon size={18} className="text-[#C5A059]" />
                </div>
                <h3 className="font-display font-serif text-2xl text-[#1A1F1C] mb-3 font-medium">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C6660] font-body leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
