import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Lock } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import PageWrapper from '@/components/layout/PageWrapper';
import { getInitials } from '@/lib/utils';
import type { SkinType } from '@/types';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('Namrata Sen');
  const [skinType, setSkinType] = useState<SkinType>('dry');

  const skinTypes = [
    { id: 'dry', label: 'Dry (Vata)', desc: 'Often feels tight, flaky, or rough.' },
    { id: 'oily', label: 'Oily (Kapha)', desc: 'Prone to shine, enlarged pores, or acne.' },
    { id: 'combination', label: 'Combination', desc: 'Oily T-zone, dry or normal cheeks.' },
    { id: 'normal', label: 'Normal (Pitta)', desc: 'Balanced, rarely breaks out.' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <TopBar title="Edit Profile" onBack={() => navigate('/profile')} />
      
      <PageWrapper className="pt-20 pb-24">
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 bg-herbal rounded-full flex items-center justify-center text-white text-2xl font-playfair shadow-md border-2 border-white">
                {getInitials(name)}
              </div>
              <button type="button" className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-sm border border-warmgray text-herbal">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <button type="button" className="mt-3 text-sm text-herbal font-medium">Change Photo</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-warmgray rounded-lg px-4 py-3 text-charcoal focus:outline-none focus:border-herbal focus:ring-1 focus:ring-herbal transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-charcoal-light/50" />
                </div>
                <input 
                  type="email" 
                  value="namrata.sen@example.com"
                  disabled
                  className="w-full bg-warmgray/20 border border-warmgray/50 rounded-lg pl-10 pr-4 py-3 text-charcoal-light cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-charcoal-light mt-1">Email cannot be changed.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-3">Primary Skin Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skinTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSkinType(type.id as SkinType)}
                  className={`p-4 rounded-card text-left transition-all border ${
                    skinType === type.id 
                      ? 'bg-leaf-soft border-herbal shadow-sm' 
                      : 'bg-white border-warmgray/40 hover:border-herbal/50'
                  }`}
                >
                  <p className="font-playfair font-semibold text-charcoal mb-1">{type.label}</p>
                  <p className="text-xs text-charcoal-light leading-relaxed">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button 
              type="submit"
              className="w-full bg-herbal text-white py-4 rounded-button font-medium shadow-md hover:bg-herbal-dark transition-colors"
            >
              Save Changes
            </button>
            <button 
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full py-4 text-charcoal-light font-medium hover:text-charcoal transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>
      </PageWrapper>
    </div>
  );
}
