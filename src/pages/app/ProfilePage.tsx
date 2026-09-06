import { useNavigate } from 'react-router-dom';
import { ChevronRight, Settings, ShieldCheck, HelpCircle, FileText, LogOut, Camera, Calendar, Bookmark } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { useAuth } from '@/contexts/AuthContext';
import SkinBadge from '@/components/common/SkinBadge';
import { getUserAssessments } from '@/lib/assessmentStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const userAssessments = user?.id ? getUserAssessments(user.id) : [];
  
  const userName = user?.full_name || "Namrata Sen";
  const userEmail = user?.email || "namrata.sen@example.com";

  const handleLogout = async () => {
    if (window.confirm('Are you sure you wish to sign out of your AayurFace account?')) {
      await signOut();
      window.location.replace('/');
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-3xl mx-auto w-full pb-16 font-body">
        
        {/* Profile Header Block */}
        <div className="flex flex-col items-center text-center pt-2 pb-6 border-b border-border-default space-y-3">
          <div className="w-20 h-20 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center font-display text-3xl font-semibold shadow-md ring-4 ring-background-subtle">
            {userName.charAt(0).toUpperCase()}
          </div>
          
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary">
              {userName}
            </h1>
            <p className="text-body-md text-text-secondary font-normal">{userEmail}</p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <SkinBadge label="Vata-Pitta Constitution" variant="vata" size="md" />
            <span className="text-caption text-text-tertiary bg-background-surface px-3 py-1 rounded-full border border-border-default">
              Member since Jan 2026
            </span>
          </div>

          <button 
            onClick={() => navigate('/profile/edit')}
            className="mt-2 text-caption font-body font-semibold text-brand-primary border border-brand-primary/30 hover:bg-brand-primary hover:text-text-inverse px-5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
          >
            Edit Profile & Constitution
          </button>
        </div>

        {/* 3 Overview Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background-surface rounded-lg p-4 border border-border-default shadow-sm text-center space-y-1">
            <div className="flex justify-center text-brand-primary mb-1">
              <Camera size={18} />
            </div>
            <p className="font-display text-2xl font-semibold text-text-primary">4</p>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-semibold">Facial Scans</p>
          </div>

          <div className="bg-background-surface rounded-lg p-4 border border-border-default shadow-sm text-center space-y-1">
            <div className="flex justify-center text-amber-700 mb-1">
              <Calendar size={18} />
            </div>
            <p className="font-display text-2xl font-semibold text-text-primary">18</p>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-semibold">Ritual Days</p>
          </div>

          <div className="bg-background-surface rounded-lg p-4 border border-border-default shadow-sm text-center space-y-1">
            <div className="flex justify-center text-emerald-800 mb-1">
              <Bookmark size={18} />
            </div>
            <p className="font-display text-2xl font-semibold text-text-primary">5</p>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-semibold">Saved Lepas</p>
          </div>
        </div>

        {/* Skin Journey Check-in Feed */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Recent Assessment Check-ins
            </h2>
            <span className="text-caption text-text-tertiary">Longitudinal Tracking</span>
          </div>

          <div className="space-y-2.5">
            {userAssessments.length > 0 ? (
              userAssessments.slice(0, 2).map((item) => (
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
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <p className="text-body-md text-text-primary group-hover:text-brand-primary transition-colors font-normal">
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
                className="p-4 rounded-lg bg-background-surface border border-dashed border-border-default hover:border-brand-primary/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <span className="text-caption font-semibold text-text-tertiary">No check-ins yet</span>
                  <p className="text-body-md text-text-secondary group-hover:text-brand-primary transition-colors">
                    Capture your first observation to begin tracking skin changes.
                  </p>
                </div>
                <ChevronRight size={16} className="text-text-tertiary group-hover:text-brand-primary group-hover:translate-x-1 transition-all shrink-0 ml-4" />
              </div>
            )}
          </div>
        </div>

        {/* Settings and Governance Links */}
        <div className="bg-background-surface rounded-lg border border-border-default shadow-sm overflow-hidden divide-y divide-border-default">
          <button 
            onClick={() => navigate('/profile/edit')} 
            className="w-full flex items-center justify-between p-4 hover:bg-background-subtle transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-text-primary">
              <Settings className="w-5 h-5 text-text-secondary" />
              <div>
                <p className="text-body-md font-medium">Account Settings & Constitution</p>
                <p className="text-caption text-text-tertiary">Update name and Prakriti intake profile</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>

          <button 
            onClick={() => navigate('/safety')} 
            className="w-full flex items-center justify-between p-4 hover:bg-background-subtle transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-text-primary">
              <ShieldCheck className="w-5 h-5 text-text-secondary" />
              <div>
                <p className="text-body-md font-medium">Trust, Safety & Non-Diagnostic FAQ</p>
                <p className="text-caption text-text-tertiary">Review clinical boundaries and patch test guidelines</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>

          <button 
            onClick={() => navigate('/privacy')} 
            className="w-full flex items-center justify-between p-4 hover:bg-background-subtle transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-text-primary">
              <FileText className="w-5 h-5 text-text-secondary" />
              <div>
                <p className="text-body-md font-medium">Privacy Policy & Biometric Consent Ledger</p>
                <p className="text-caption text-text-tertiary">Manage biometric consent and data rights</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>

          <button 
            onClick={() => navigate('/how-it-works')} 
            className="w-full flex items-center justify-between p-4 hover:bg-background-subtle transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-text-primary">
              <HelpCircle className="w-5 h-5 text-text-secondary" />
              <div>
                <p className="text-body-md font-medium">Ayurvedic Methodology & References</p>
                <p className="text-caption text-text-tertiary">Classical Sanskrit texts and botanical guidelines</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>
        </div>

        {/* Sign Out Action */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 border border-red-200 text-red-800 bg-red-50/50 hover:bg-red-100/70 rounded-md font-body font-medium text-body-md transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Account
        </button>

      </div>
    </PageWrapper>
  );
}
