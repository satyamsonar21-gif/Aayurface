import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Settings, ShieldCheck, HelpCircle, LogOut, Camera, Calendar, Bookmark } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { useAuth } from '@/contexts/AuthContext';
import SkinBadge from '@/components/common/SkinBadge';
import { getUserAssessments } from '@/lib/assessmentStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userAssessments = user?.id ? getUserAssessments(user.id) : [];
  
  const userName = user?.full_name?.trim() || (user?.email ? user.email.split('@')[0] : 'AayurFace Member');
  const userEmail = user?.email || 'member@aayurface.local';
  const initial = userName.charAt(0).toUpperCase() || 'A';

  const memberYear = user?.created_at 
    ? new Date(user.created_at).getFullYear() 
    : 2026;

  // Real saved remedies count from localStorage
  const savedLepasCount = (() => {
    try {
      const saved = localStorage.getItem('aayurface_saved_remedies');
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  })();

  const doshaLabel = user?.dosha 
    ? `${user.dosha.charAt(0).toUpperCase() + user.dosha.slice(1)} Constitution` 
    : (user?.skin_type ? `${user.skin_type.charAt(0).toUpperCase() + user.skin_type.slice(1)} Skin Type` : 'Constitutional Balance');

  const doshaVariant = (user?.dosha as any) || (user?.skin_type as any) || 'default';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      window.location.replace('/');
    } catch (e) {
      console.error('Logout error:', e);
      window.location.replace('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-3xl mx-auto w-full pb-16 font-body">
        
        {/* Profile Header Block */}
        <div className="flex flex-col items-center text-center pt-2 pb-6 border-b border-border-default space-y-3">
          <div className="w-20 h-20 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center font-display text-3xl font-semibold shadow-md ring-4 ring-background-subtle">
            {initial}
          </div>
          
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
              {userName}
            </h1>
            <p className="text-body-md text-text-secondary font-normal">{userEmail}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <SkinBadge label={doshaLabel} variant={doshaVariant} size="md" />
            <span className="text-caption text-text-tertiary bg-background-surface px-3 py-1 rounded-full border border-border-default">
              Member since {memberYear}
            </span>
          </div>

          <button 
            onClick={() => navigate('/profile/edit')}
            className="mt-2 text-caption font-body font-semibold text-brand-primary border border-brand-primary/30 hover:bg-brand-primary hover:text-text-inverse px-5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
          >
            Edit Profile & Constitution
          </button>
        </div>

        {/* 3 Real Overview Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div 
            onClick={() => navigate('/history')}
            className="bg-background-surface rounded-lg p-4 border border-border-default shadow-sm text-center space-y-1 hover:border-brand-primary/40 transition-colors cursor-pointer"
          >
            <div className="flex justify-center text-brand-primary mb-1">
              <Camera size={18} />
            </div>
            <p className="font-display text-2xl font-semibold text-text-primary">{userAssessments.length}</p>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-semibold">Facial Scans</p>
          </div>

          <div 
            onClick={() => navigate('/routine')}
            className="bg-background-surface rounded-lg p-4 border border-border-default shadow-sm text-center space-y-1 hover:border-brand-primary/40 transition-colors cursor-pointer"
          >
            <div className="flex justify-center text-amber-700 mb-1">
              <Calendar size={18} />
            </div>
            <p className="font-display text-2xl font-semibold text-text-primary">Daily</p>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-semibold">Dinacharya</p>
          </div>

          <div 
            onClick={() => navigate('/library')}
            className="bg-background-surface rounded-lg p-4 border border-border-default shadow-sm text-center space-y-1 hover:border-brand-primary/40 transition-colors cursor-pointer"
          >
            <div className="flex justify-center text-emerald-800 mb-1">
              <Bookmark size={18} />
            </div>
            <p className="font-display text-2xl font-semibold text-text-primary">{savedLepasCount}</p>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-semibold">Saved Lepas</p>
          </div>
        </div>

        {/* Skin Journey Check-in Feed */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Recent Assessment Check-ins
            </h2>
            <button 
              onClick={() => navigate('/history')}
              className="text-caption font-semibold text-brand-primary hover:underline cursor-pointer"
            >
              View Full History
            </button>
          </div>

          <div className="space-y-2.5">
            {userAssessments.length > 0 ? (
              userAssessments.slice(0, 3).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/results/${item.id}`)}
                  className="p-4 rounded-lg bg-background-surface border border-border-default hover:border-brand-secondary/40 transition-all cursor-pointer flex items-center justify-between shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md overflow-hidden border border-border-default bg-background-subtle shrink-0">
                      <img src={item.capturedImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-caption font-semibold text-brand-primary">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <p className="text-body-md text-text-primary group-hover:text-brand-primary transition-colors font-normal line-clamp-1">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-text-tertiary group-hover:text-brand-primary group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                </div>
              ))
            ) : (
              <div 
                onClick={() => navigate('/scan')}
                className="p-6 rounded-lg bg-background-surface border border-dashed border-border-default hover:border-brand-primary/40 transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 group text-center sm:text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                    <Camera size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-caption font-semibold text-text-primary">No Observations Recorded Yet</span>
                    <p className="text-body-md text-text-secondary">
                      Capture your first facial wellness observation to begin your personal journey.
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/scan'); }}
                  className="px-4 py-2 bg-brand-primary text-text-inverse rounded-md text-caption font-medium shrink-0 group-hover:bg-brand-primary-hover transition-colors"
                >
                  Start Scan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Settings and Account Navigation (All Working Routes) */}
        <div className="bg-background-surface rounded-lg border border-border-default shadow-sm overflow-hidden divide-y divide-border-default">
          <button 
            onClick={() => navigate('/profile/edit')} 
            className="w-full flex items-center justify-between p-4 hover:bg-background-subtle transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-text-primary">
              <Settings className="w-5 h-5 text-text-secondary" />
              <div>
                <p className="text-body-md font-medium">Edit Profile & Constitution</p>
                <p className="text-caption text-text-tertiary">Update full name and Ayurvedic Prakriti tendencies</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>

          <button 
            onClick={() => navigate('/settings')} 
            className="w-full flex items-center justify-between p-4 hover:bg-background-subtle transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-text-primary">
              <ShieldCheck className="w-5 h-5 text-text-secondary" />
              <div>
                <p className="text-body-md font-medium">Preferences & Privacy Controls</p>
                <p className="text-caption text-text-tertiary">Ritual reminders, client-side session storage, and data controls</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>

          <button 
            onClick={() => navigate('/')} 
            className="w-full flex items-center justify-between p-4 hover:bg-background-subtle transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-text-primary">
              <HelpCircle className="w-5 h-5 text-text-secondary" />
              <div>
                <p className="text-body-md font-medium">Ayurvedic Methodology & Foundations</p>
                <p className="text-caption text-text-tertiary">Review classical Dravyaguna principles on public portal</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>
        </div>

        {/* Sign Out Action */}
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 py-3.5 border border-red-200 text-red-800 bg-red-50/50 hover:bg-red-100/70 rounded-md font-body font-medium text-body-md transition-colors cursor-pointer disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          {isLoggingOut ? 'Signing out...' : 'Sign Out of Account'}
        </button>

      </div>
    </PageWrapper>
  );
}
