import { ShieldCheck, EyeOff, FileText, Stethoscope } from 'lucide-react';

export default function ResponsibleAISafetySection() {
  const pillars = [
    {
      icon: Stethoscope,
      title: 'Non-Clinical Standard',
      desc: 'Designed exclusively for constitutional skin wellness guidance. Never replaces a certified medical dermatologist or clinical diagnostic consultation.'
    },
    {
      icon: EyeOff,
      title: 'Private & Client-Side',
      desc: 'Your camera stream and captured facial frames are processed directly within your browser. Raw images are never sold or used for public AI training.'
    },
    {
      icon: ShieldCheck,
      title: 'Uncertainty Preserved',
      desc: 'When daylight illumination or facial angles are ambiguous, our models report reduced confidence rather than generating speculative answers.'
    },
    {
      icon: FileText,
      title: 'Classical Lineage',
      desc: 'All herbological citations are mapped strictly to recognized classical compendiums (Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya).'
    }
  ];

  return (
    <section id="safety" className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-20 sm:py-28 lg:py-32 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E6DFD5]">
            <ShieldCheck size={14} className="text-[#6B8E7D]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1E3A2F] font-body">
              ETHICAL FOUNDATION
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C]">
            Wellness guidance, with clear boundaries.
          </h2>

          <p className="text-base text-[#5C6660] leading-relaxed">
            We believe technology should earn your trust through transparency, rigorous privacy boundaries, and deep respect for the limits of computer vision.
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6DFD5] space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#E6DFD5] flex items-center justify-center text-[#1E3A2F]">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#1A1F1C]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#5C6660] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
