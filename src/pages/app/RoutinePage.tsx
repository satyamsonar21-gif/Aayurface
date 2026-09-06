import { useState } from 'react';
import { Sun, Moon, Sparkles, CheckCircle2, Circle, Clock, Flame } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';

interface RoutineItem {
  id: string;
  time: string;
  title: string;
  sanskritName: string;
  purpose: string;
  doshaBenefit: string;
  completed: boolean;
}

const initialRoutines: Record<'morning' | 'midday' | 'evening' | 'bedtime', RoutineItem[]> = {
  morning: [
    {
      id: 'm1',
      time: '6:30 AM',
      title: 'Ushapan & Gentle Water Rinse',
      sanskritName: 'Ushapan',
      purpose: 'Warm water sip to stimulate natural peristalsis and gentle lukewarm facial splash.',
      doshaBenefit: 'Pacifies Vata dry qualities upon waking',
      completed: true,
    },
    {
      id: 'm2',
      time: '7:00 AM',
      title: 'Botanical Cleansing & Herbal Splash',
      sanskritName: 'Mukha Prakshalana',
      purpose: 'Neem-infused water or pure rose mist to refresh skin surface.',
      doshaBenefit: 'Clears overnight Kapha stagnation and calms Pitta warmth',
      completed: true,
    },
    {
      id: 'm3',
      time: '7:30 AM',
      title: 'Light Herbal Hydration & Moisture Shield',
      sanskritName: 'Twak Lepana',
      purpose: 'Light aloe vera gel with 2 drops of almond oil for day protection.',
      doshaBenefit: 'Locks moisture without clogging pores',
      completed: false,
    },
  ],
  midday: [
    {
      id: 'd1',
      time: '12:30 PM',
      title: 'Hydrating CCF Digestive Infusion',
      sanskritName: 'Deepana Tea',
      purpose: 'Sip warm cumin, coriander, and fennel tea alongside the primary meal.',
      doshaBenefit: 'Kindles digestive Agni to prevent Ama toxin formation',
      completed: false,
    },
    {
      id: 'd2',
      time: '1:30 PM',
      title: 'Gentle Midday Thermal Balance',
      sanskritName: 'Shita Upachara',
      purpose: 'Light spritz of rose or vetiver (khus) mist if feeling midday flush.',
      doshaBenefit: 'Soothes peak solar Pitta heat',
      completed: false,
    },
  ],
  evening: [
    {
      id: 'e1',
      time: '6:30 PM',
      title: 'Evening Calm & Mindful Unwinding',
      sanskritName: 'Sandhyavandana',
      purpose: '5 minutes of slow Nadi Shodhana pranayama to balance nervous system.',
      doshaBenefit: 'Grounds restless Vata energy after daily exertion',
      completed: false,
    },
  ],
  bedtime: [
    {
      id: 'b1',
      time: '9:30 PM',
      title: 'Kumkumadi Facial Abhyanga',
      sanskritName: 'Mukha Abhyanga',
      purpose: '3 to 4 drops of warm Kumkumadi taila gently pressed into temples and cheeks.',
      doshaBenefit: 'Nourishes dry tissues and promotes restorative overnight cellular renewal',
      completed: false,
    },
    {
      id: 'b2',
      time: '10:00 PM',
      title: 'Pada Abhyanga (Sole Massage)',
      sanskritName: 'Pada Abhyanga',
      purpose: 'Warm sesame or ghee rubbed into the soles of the feet before rest.',
      doshaBenefit: 'Draws excess heat downward, fostering deep, restorative sleep',
      completed: false,
    },
  ],
};

export default function RoutinePage() {
  const [routines, setRoutines] = useState(initialRoutines);

  const toggleItem = (section: keyof typeof routines, id: string) => {
    setRoutines((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const allItems = Object.values(routines).flat();
  const completedCount = allItems.filter((i) => i.completed).length;

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-4xl mx-auto w-full pb-16 font-body">
        
        {/* Header */}
        <div className="space-y-2 pb-5 border-b border-border-default">
          <div className="flex items-center gap-2">
            <span className="text-caption font-body font-semibold uppercase tracking-wider text-brand-accent">
              Dinacharya Care
            </span>
            <span className="text-border-default">•</span>
            <span className="text-caption text-text-tertiary">Daily Ayurvedic Rhythms</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary">
                Daily Routine
              </h1>
              <p className="text-body-md text-text-secondary max-w-2xl mt-1">
                Synchronize your skincare and wellness rituals with the natural cycles of day and night.
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-background-surface px-4 py-2 rounded-lg border border-border-default shrink-0 shadow-sm">
              <Flame className="w-4 h-4 text-brand-accent" />
              <span className="text-caption text-text-secondary font-medium">
                <strong className="text-text-primary font-semibold">{completedCount}</strong> of {allItems.length} completed
              </span>
            </div>
          </div>
        </div>

        {/* Presentation Disclaimer */}
        <div className="p-4 rounded-md bg-background-subtle border border-border-default flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
          <div className="text-caption text-text-secondary space-y-0.5">
            <p className="font-semibold text-text-primary">Presentation Mode — Seasonal Dinacharya Framework</p>
            <p>
              These time-honored practices align with classical Ayurvedic daily regimens. Practice gently according to your personal comfort and constitutional tendencies.
            </p>
          </div>
        </div>

        {/* Routine Sections */}
        <div className="space-y-8">
          
          {/* Morning */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-text-primary pb-1">
              <Sun className="w-5 h-5 text-amber-600" />
              <h2 className="font-display text-2xl font-semibold">
                Morning • Pratah Kal (6:00 AM – 9:00 AM)
              </h2>
            </div>
            <div className="space-y-2.5">
              {routines.morning.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem('morning', item.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer flex items-start gap-3.5 ${
                    item.completed
                      ? 'bg-background-surface/60 border-border-default/60 opacity-85'
                      : 'bg-background-surface border-border-default hover:border-brand-secondary/40 shadow-sm'
                  }`}
                >
                  <button
                    aria-label={item.completed ? 'Mark ritual incomplete' : 'Mark ritual complete'}
                    className="mt-0.5 text-brand-primary shrink-0 transition-transform active:scale-90"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <Circle className="w-5 h-5 text-text-tertiary hover:text-brand-primary" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`font-body text-body-md font-medium ${item.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                        {item.title} <span className="text-caption text-text-tertiary font-normal italic">({item.sanskritName})</span>
                      </h3>
                      <span className="text-caption text-text-tertiary flex items-center gap-1 shrink-0 font-body">
                        <Clock size={12} />
                        {item.time}
                      </span>
                    </div>
                    <p className="text-caption text-text-secondary leading-relaxed">{item.purpose}</p>
                    <p className="text-[11px] text-brand-primary/80 font-medium">🌿 {item.doshaBenefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Midday */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-text-primary pb-1">
              <Sun className="w-5 h-5 text-amber-700" />
              <h2 className="font-display text-2xl font-semibold">
                Midday • Madhyanha (12:00 PM – 2:00 PM)
              </h2>
            </div>
            <div className="space-y-2.5">
              {routines.midday.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem('midday', item.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer flex items-start gap-3.5 ${
                    item.completed
                      ? 'bg-background-surface/60 border-border-default/60 opacity-85'
                      : 'bg-background-surface border-border-default hover:border-brand-secondary/40 shadow-sm'
                  }`}
                >
                  <button
                    aria-label={item.completed ? 'Mark ritual incomplete' : 'Mark ritual complete'}
                    className="mt-0.5 text-brand-primary shrink-0 transition-transform active:scale-90"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <Circle className="w-5 h-5 text-text-tertiary hover:text-brand-primary" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`font-body text-body-md font-medium ${item.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                        {item.title} <span className="text-caption text-text-tertiary font-normal italic">({item.sanskritName})</span>
                      </h3>
                      <span className="text-caption text-text-tertiary flex items-center gap-1 shrink-0 font-body">
                        <Clock size={12} />
                        {item.time}
                      </span>
                    </div>
                    <p className="text-caption text-text-secondary leading-relaxed">{item.purpose}</p>
                    <p className="text-[11px] text-brand-primary/80 font-medium">🌿 {item.doshaBenefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Evening & Bedtime */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-text-primary pb-1">
              <Moon className="w-5 h-5 text-slate-700" />
              <h2 className="font-display text-2xl font-semibold">
                Evening & Rest • Sandhya & Ratri (6:00 PM – 10:00 PM)
              </h2>
            </div>
            <div className="space-y-2.5">
              {[...routines.evening, ...routines.bedtime].map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (routines.evening.some((e) => e.id === item.id)) {
                      toggleItem('evening', item.id);
                    } else {
                      toggleItem('bedtime', item.id);
                    }
                  }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer flex items-start gap-3.5 ${
                    item.completed
                      ? 'bg-background-surface/60 border-border-default/60 opacity-85'
                      : 'bg-background-surface border-border-default hover:border-brand-secondary/40 shadow-sm'
                  }`}
                >
                  <button
                    aria-label={item.completed ? 'Mark ritual incomplete' : 'Mark ritual complete'}
                    className="mt-0.5 text-brand-primary shrink-0 transition-transform active:scale-90"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <Circle className="w-5 h-5 text-text-tertiary hover:text-brand-primary" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`font-body text-body-md font-medium ${item.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                        {item.title} <span className="text-caption text-text-tertiary font-normal italic">({item.sanskritName})</span>
                      </h3>
                      <span className="text-caption text-text-tertiary flex items-center gap-1 shrink-0 font-body">
                        <Clock size={12} />
                        {item.time}
                      </span>
                    </div>
                    <p className="text-caption text-text-secondary leading-relaxed">{item.purpose}</p>
                    <p className="text-[11px] text-brand-primary/80 font-medium">🌿 {item.doshaBenefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>
    </PageWrapper>
  );
}
