import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import { mockUser } from '@/data/mockUser';
import { simulateApiDelay } from '@/services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with real auth when backend is ready
      await simulateApiDelay(null, 1000);
      
      // Mock validation
      if (email && password.length >= 6) {
        setUser({ ...mockUser, email });
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      await simulateApiDelay(null, 1000);
      
      if (email && password.length >= 6 && firstName && lastName) {
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          firstName,
          lastName,
          phone: '',
          createdAt: new Date(),
        };
        setUser(newUser);
        return { success: true };
      }
      return { success: false, error: 'Please fill all fields correctly' };
    } catch {
      return { success: false, error: 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await simulateApiDelay(null, 500);
    setUser(null);
    setIsLoading(false);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (user) {
      await simulateApiDelay(null, 500);
      setUser({ ...user, ...data });
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
