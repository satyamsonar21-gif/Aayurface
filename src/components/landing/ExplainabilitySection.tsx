import { Eye, Layers, Gauge, BookOpen, ShieldAlert } from 'lucide-react';

export default function ExplainabilitySection() {
  const chain = [
    {
      stage: '01',
      label: 'OBSERVED',
      icon: Eye,
      color: 'text-[#6B8E7D]',
      borderColor: 'border-[#6B8E7D]',
      title: 'Visual Surface Signal',
      details: 'Detected surface dryness lines across cheeks with localized specular sheen in T-zone.',
      tag: 'Client-Side Computer Vision'
    },
    {
      stage: '02',
      label: 'INFLUENCE',
      icon: Layers,
      color: 'text-[#C5A059]',
      borderColor: 'border-[#C5A059]',
      title: 'Contextual Covariates',
      details: 'Self-reported late sleep schedules (6.5 hrs) combined with seasonal dry autumn weather (Sharad Ritu).',
      tag: 'Lifestyle & Environment'
    },
    {
      stage: '03',
      label: 'CONFIDENCE',
      icon: Gauge,
      color: 'text-[#1E3A2F]',
      borderColor: 'border-[#1E3A2F]',
      title: 'Signal Reliability',
      details: 'High capture quality (Laplacian variance > 60, diffuse daylight 5200K, zero motion blur).',
      tag: 'Preserved Uncertainty'
    },
    {
      stage: '04',
      label: 'MEANING',
      icon: BookOpen,
      color: 'text-[#12392F]',
      borderColor: 'border-[#12392F]',
      title: 'Constitutional Interpretation',
      details: 'Suggests a temporary Pitta-Vata elevation (Vikriti): aggravated Pitta in sebaceous glands coupled with Vata dehydration.',
      tag: 'Ayurvedic Dravyaguna Logic'
    },
    {
      stage: '05',
      label: 'LIMITS',
      icon: ShieldAlert,
      color: 'text-[#7A6F61]',
      borderColor: 'border-[#7A6F61]',
      title: 'Safety Boundary',
      details: 'Constitutional skincare wellness observation only. Not a medical evaluation for dermatological disease.',
      tag: 'Non-Clinical Standard'
    }
  ];

  return (
    <section className="w-full bg-[#FFFFFF] border-y border-[#E6DFD5] py-20 sm:py-28 lg:py-32 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold font-body uppercase tracking-[0.2em] text-[#6B8E7D]">
            TRANSPARENT REASONING
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1A1F1C]">
            Not just an answer.<br />
            <span className="italic font-normal text-[#1E3A2F]">An explanation.</span>
          </h2>
          <p className="text-base text-[#5C6660] leading-relaxed">
            We reject black-box scores. Every recommendation unfolds in a clear, five-stage evidentiary hierarchy so you always understand why a botanical or ritual is suggested.
          </p>
        </div>

        {/* Explainability Stepper / Hierarchy Display */}
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-[#E6DFD5] shadow-xs space-y-8">
          <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#1E3A2F] font-semibold">
              Live Observation Explanation Schema
            </span>
            <span className="text-[11px] font-mono text-[#8A948E]">
              Schema: v1-explainable-ayur
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {chain.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.stage} className="flex flex-col space-y-3 relative group">
                  {/* Top Bar Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#8A948E]">
                      {item.stage} / {item.label}
                    </span>
                    <Icon size={16} className={item.color} />
                  </div>

                  <div className={`w-full h-1 rounded-full bg-[#E6DFD5] overflow-hidden`}>
                    <div className={`h-full w-full ${item.borderColor.replace('border-', 'bg-')}`} />
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className="font-display text-lg font-semibold text-[#1A1F1C] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5C6660] leading-relaxed">
                      {item.details}
                    </p>
                  </div>

                  {/* Tag */}
                  <div className="pt-2 mt-auto">
                    <span className="inline-block text-[10px] font-mono text-[#1E3A2F] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E6DFD5]">
                      {item.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
