import { useNavigate } from 'react-router-dom';
import { ChevronRight, Settings, ShieldAlert, HelpCircle, Info, LogOut } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { getInitials } from '@/lib/utils';
import AyurCard from '@/components/common/AyurCard';

export default function ProfilePage() {
  const navigate = useNavigate();
  const userName = "Namrata Sen";
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      navigate('/');
    }
  };

  return (
    <PageWrapper className="pb-24">
      <div className="space-y-8">
        
        <div className="flex flex-col items-center pt-4">
          <div className="w-20 h-20 bg-herbal rounded-full flex items-center justify-center text-white text-2xl font-playfair shadow-md mb-3 border-2 border-white">
            {getInitials(userName)}
          </div>
          <h1 className="font-playfair text-xl font-bold text-charcoal mb-1">{userName}</h1>
          <span className="bg-leaf-soft text-herbal-dark text-xs px-3 py-1 rounded-full mb-4">Vata-Pitta Skin</span>
          <button 
            onClick={() => navigate('/profile/edit')}
            className="text-sm text-herbal border border-herbal px-6 py-1.5 rounded-pill hover:bg-leaf-soft transition-colors font-medium"
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-card p-3 shadow-card text-center border border-warmgray/30">
            <p className="text-2xl font-semibold text-herbal mb-1">3</p>
            <p className="text-[10px] text-charcoal-light uppercase tracking-wider font-medium">Scans</p>
          </div>
          <div className="bg-white rounded-card p-3 shadow-card text-center border border-warmgray/30">
            <p className="text-2xl font-semibold text-turmeric mb-1">14</p>
            <p className="text-[10px] text-charcoal-light uppercase tracking-wider font-medium">Days</p>
          </div>
          <div className="bg-white rounded-card p-3 shadow-card text-center border border-warmgray/30">
            <p className="text-2xl font-semibold text-charcoal mb-1">5</p>
            <p className="text-[10px] text-charcoal-light uppercase tracking-wider font-medium">Saved</p>
          </div>
        </div>

        <div>
          <h2 className="font-playfair text-lg font-semibold text-charcoal mb-4">Your Skin Journey 🌿</h2>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <AyurCard key={i} className="p-3" onClick={() => navigate('/results/demo-scan')}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-leaf-soft rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-charcoal-light mb-0.5">Aug {15 - i}, 2024</p>
                    <p className="text-sm font-medium text-charcoal truncate">Routine checkup - mild improvement</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-charcoal-light flex-shrink-0" />
                </div>
              </AyurCard>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-card shadow-card border border-warmgray/30 overflow-hidden">
          <button onClick={() => navigate('/profile/edit')} className="w-full flex items-center justify-between p-4 border-b border-warmgray/30 hover:bg-cream-card transition-colors text-left">
            <div className="flex items-center gap-3 text-charcoal">
              <Settings className="w-5 h-5 text-charcoal-light" />
              <span className="text-sm font-medium">Account Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-charcoal-light" />
          </button>
          <button className="w-full flex items-center justify-between p-4 border-b border-warmgray/30 hover:bg-cream-card transition-colors text-left">
            <div className="flex items-center gap-3 text-charcoal">
              <ShieldAlert className="w-5 h-5 text-charcoal-light" />
              <span className="text-sm font-medium">Privacy & Data</span>
            </div>
            <ChevronRight className="w-4 h-4 text-charcoal-light" />
          </button>
          <button className="w-full flex items-center justify-between p-4 border-b border-warmgray/30 hover:bg-cream-card transition-colors text-left">
            <div className="flex items-center gap-3 text-charcoal">
              <HelpCircle className="w-5 h-5 text-charcoal-light" />
              <span className="text-sm font-medium">Help & FAQ</span>
            </div>
            <ChevronRight className="w-4 h-4 text-charcoal-light" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-cream-card transition-colors text-left">
            <div className="flex items-center gap-3 text-charcoal">
              <Info className="w-5 h-5 text-charcoal-light" />
              <span className="text-sm font-medium">About Aayurface</span>
            </div>
            <ChevronRight className="w-4 h-4 text-charcoal-light" />
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 border border-herbal text-herbal rounded-button font-medium hover:bg-leaf-soft transition-colors mt-8"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>

      </div>
    </PageWrapper>
  );
}
