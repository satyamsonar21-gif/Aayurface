// ============================================================
// Aayurface — Auth Context (Mock Provider with LocalStorage)
// In production, connect to Supabase Auth
// ============================================================

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'aayurface_users';
const SESSION_KEY = 'aayurface_session';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // initially true while we check local storage

  useEffect(() => {
    // Check for existing session on mount
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const parsedUser = JSON.parse(savedSession);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse session", e);
      }
    }
    setIsLoading(false);
  }, []);

  const getStoredUsers = (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveStoredUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const saveSession = (userObj: User | null) => {
    if (userObj) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userObj));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    setUser(userObj);
  };

  const signUp = useCallback(async (email: string, _password: string, fullName: string) => {
    setIsLoading(true);
    await delay(300);
    
    const users = getStoredUsers();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      throw new Error("User with this email already exists.");
    }

    const newUser: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
      email,
      full_name: fullName,
      avatar_url: null,
      skin_type: null,
      dosha: null,
      onboarding_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.push(newUser);
    saveStoredUsers(users);
    saveSession(newUser);
    
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    await delay(300);
    
    const users = getStoredUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (!existingUser) {
      setIsLoading(false);
      throw new Error("Invalid email or password.");
    }

    saveSession(existingUser);
    setIsLoading(false);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    await delay(300);
    
    const email = 'google.user@gmail.com';
    const users = getStoredUsers();
    let existingUser = users.find(u => u.email === email);
    
    if (!existingUser) {
      existingUser = {
        id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
        email,
        full_name: 'Google User',
        avatar_url: null,
        skin_type: null,
        dosha: null,
        onboarding_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      users.push(existingUser);
      saveStoredUsers(users);
    }

    saveSession(existingUser);
    setIsLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    await delay(300);
    saveSession(null);
    setIsLoading(false);
  }, []);

  const resetPassword = useCallback(async (_email: string) => {
    await delay(300);
    // Simulated — no actual reset in localStorage
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...data, updated_at: new Date().toISOString() };
      
      // Update session
      saveSession(updatedUser);
      
      // Update user in users list
      const users = getStoredUsers();
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        saveStoredUsers(users);
      }
      
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
