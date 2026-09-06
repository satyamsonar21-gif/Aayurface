import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, Check } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { useAuth } from '@/contexts/AuthContext';
import type { SkinType } from '@/types';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.full_name || 'Namrata Sen');
  const [skinType, setSkinType] = useState<SkinType>(user?.skin_type || 'dry');
  const [isSaving, setIsSaving] = useState(false);

  const skinTypes = [
    { id: 'dry', label: 'Vata Predominant (Dry/Delicate)', desc: 'Feels dry, thin, matte, or tight. Requires grounding and warm moisture.' },
    { id: 'normal', label: 'Pitta Predominant (Sensitive/Warm)', desc: 'Warm, radiant, prone to redness or reactivity. Requires soothing botanical balance.' },
    { id: 'oily', label: 'Kapha Predominant (Oily/Dense)', desc: 'Supple, thick, prone to sebum shine or congestion. Requires clarifying herbs.' },
    { id: 'combination', label: 'Doshic Harmonic (Combination)', desc: 'Vata or Pitta cheeks with Kapha T-zone. Requires adaptive dual care.' },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: name,
        skin_type: skinType,
      });
      navigate('/profile');
    } catch {
      navigate('/profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-2xl mx-auto w-full pb-16 font-body">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-border-default">
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center gap-1.5 text-caption font-semibold text-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            Back to Profile
          </button>
          
          <span className="text-caption text-text-tertiary">
            Account Preferences
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Header */}
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
              Edit Account & Constitution
            </h1>
            <p className="text-body-md text-text-secondary">
              Keep your profile details and primary Prakriti constitutional tendency up to date.
            </p>
          </div>

          {/* User Avatar Initial Banner */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-background-surface border border-border-default">
            <div className="w-14 h-14 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center font-display text-2xl font-semibold shadow-sm">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-text-primary">{name}</p>
              <p className="text-caption text-text-tertiary">{user?.email || 'namrata.sen@example.com'}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-caption font-body font-medium text-text-secondary uppercase tracking-wider">
                Full Name
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-border-default bg-background-surface px-4 py-3 font-body text-body-md text-text-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all shadow-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-caption font-body font-medium text-text-secondary uppercase tracking-wider">
                Email Address (Permanent Identifier)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                  <Lock className="h-4 w-4" />
                </div>
                <input 
                  type="email" 
                  value={user?.email || "namrata.sen@example.com"}
                  disabled
                  className="w-full rounded-md border border-border-default/60 bg-background-subtle/70 pl-10 pr-4 py-3 font-body text-body-md text-text-tertiary cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Primary Skin Type / Prakriti Selector */}
          <div className="space-y-3">
            <label className="block text-caption font-body font-medium text-text-secondary uppercase tracking-wider">
              Primary Skin Constitution (Prakriti)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skinTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSkinType(type.id as SkinType)}
                  className={`p-4 rounded-lg text-left transition-all border cursor-pointer ${
                    skinType === type.id 
                      ? 'bg-emerald-50/70 border-brand-primary text-text-primary shadow-sm ring-1 ring-brand-primary' 
                      : 'bg-background-surface border-border-default hover:border-brand-secondary/40 text-text-primary'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-display font-semibold text-base">{type.label}</p>
                    {skinType === type.id && <Check className="w-4 h-4 text-brand-primary" />}
                  </div>
                  <p className="text-caption text-text-secondary leading-relaxed font-normal">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button 
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-brand-primary text-text-inverse py-3.5 px-6 rounded-md font-body font-medium text-body-md shadow-sm hover:bg-brand-primary-hover transition-colors cursor-pointer disabled:opacity-60 text-center"
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/profile')}
              className="py-3.5 px-6 border border-border-default bg-background-surface hover:bg-background-subtle text-text-secondary rounded-md font-body font-medium text-body-md transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </PageWrapper>
  );
}
