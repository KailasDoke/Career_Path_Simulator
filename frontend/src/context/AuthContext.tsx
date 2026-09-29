import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface StudentProfile {
  id: number;
  firstName: string;
  lastName: string;
  academicRecord?: any;
  interestProfile?: any;
  financialProfile?: any;
  locationPreference?: any;
  aptitudeResult?: any;
}

interface AuthContextType {
  userId: number | null;
  profile: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<number | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (id: number) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/students/${id}/profile`);
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
      // Fallback to null if profile not found or backend not running yet
      setProfile(null);
    }
  };

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      const id = parseInt(storedId, 10);
      setUserId(id);
      fetchProfile(id).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string) => {
    // Mock login: For this project, any login assigns userId = 1 (the demo user)
    // In a real app, this would hit a /login endpoint to verify credentials.
    setIsLoading(true);
    const mockId = 1; 
    setUserId(mockId);
    localStorage.setItem('userId', mockId.toString());
    await fetchProfile(mockId);
    setIsLoading(false);
  };

  const logout = () => {
    setUserId(null);
    setProfile(null);
    localStorage.removeItem('userId');
  };

  const refreshProfile = async () => {
    if (userId) {
      await fetchProfile(userId);
    }
  };

  return (
    <AuthContext.Provider value={{ userId, profile, isAuthenticated: !!userId, isLoading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
