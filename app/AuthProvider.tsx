// app/AuthProvider.tsx (FINAL CORRECTED VERSION)
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

type AuthContextType = {
  user: any | null;
  session: any | null;
  isLoading: boolean; // 👈🏻 FIX 1: isLoading added to type
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true, // Default value set to true
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 👈🏻 local state for loading

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setIsLoading(false); // Finished initial load check
    });

    // 2. Listen for changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    // 👈🏻 FIX 2: isLoading ko context value mein shamil kiya
    <AuthContext.Provider value={{ user, session, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 👈🏻 FIX 3: useAuth hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};