import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  demoBalance: number;
  liveBalance: number;
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  tradeHistory: Trade[];
  accountType?: 'demo' | 'live';
}

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  result: 'win' | 'loss';
  profit: number;
  timestamp: Date;
  duration: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateBalance: (amount: number) => void;
  setUserFromLocalStorage: () => void;
  // Account switching functionality
  switchAccount: (accountType: 'demo' | 'live') => void;
  currentBalance: number;
  isLiveBalanceVisible: boolean;
  clearAndReinitializeUser: () => void;
  cleanupInvalidUserData: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// User definition

const justinUser: User = {
  id: '2',
  name: 'Justin Arokiaswamy',
  email: 'justin@thealphaandomega.org',
  demoBalance: 10000,
  liveBalance: 0,
  totalTrades: 0,
  winRate: 0,
  totalPnL: 0,
  tradeHistory: [],
  accountType: 'demo',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if there's a saved user and authentication state
    const savedUser = localStorage.getItem('qxTrader_user');
    const savedAuthState = localStorage.getItem('qxTrader_auth');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // Check if the saved user is valid (should be Justin)
      if (userData.email === 'justin@thealphaandomega.org') {
        if (savedAuthState === 'true') {
          // User was previously authenticated, restore their session
          setUser(userData);
          setIsAuthenticated(true);
          console.log('Restored authenticated user session:', userData.name);
        } else {
          // User exists but not authenticated
          setUser(userData);
          setIsAuthenticated(false);
          console.log('Found saved user but not authenticated:', userData.name);
        }
      } else {
        // Invalid user data (e.g., Jonathan), replace with Justin's data
        console.log('Invalid user data found, replacing with Justin:', userData.name);
        localStorage.setItem('qxTrader_user', JSON.stringify(justinUser));
        setUser(justinUser);
        setIsAuthenticated(false);
        localStorage.removeItem('qxTrader_auth');
      }
    } else {
      // No saved user, initialize with Justin's data
      localStorage.setItem('qxTrader_user', JSON.stringify(justinUser));
      setUser(justinUser);
      setIsAuthenticated(false);
      console.log('Initialized new user:', justinUser.name);
    }
  }, []);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('qxTrader_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    let authenticatedUser: User | null = null;

    if (email === 'justin@thealphaandomega.org' && password === 'Galvin66') {
      // Check if user already exists in localStorage
      const savedUser = localStorage.getItem('qxTrader_user');
      if (savedUser) {
        authenticatedUser = JSON.parse(savedUser);
      } else {
        authenticatedUser = justinUser;
        // Only set localStorage if new user
        localStorage.setItem('qxTrader_user', JSON.stringify(authenticatedUser));
      }
    }

    if (authenticatedUser) {
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      // Save authentication state to localStorage
      localStorage.setItem('qxTrader_auth', 'true');
      return true;
    }

    return false;
  };

  const logout = () => {
    // Keep user data but remove authentication
    setIsAuthenticated(false);
    // Remove authentication state from localStorage
    localStorage.removeItem('qxTrader_auth');
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        liveBalance: user.liveBalance + amount
      };
      setUser(updatedUser);
      localStorage.setItem('qxTrader_user', JSON.stringify(updatedUser));
    }
  };

  // Add setUserFromLocalStorage
  const setUserFromLocalStorage = () => {
    const savedUser = localStorage.getItem('qxTrader_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  // Function to force clear all user data and reinitialize
  const clearAndReinitializeUser = () => {
    const wasAuthenticated = isAuthenticated;
    localStorage.removeItem('qxTrader_user');
    localStorage.removeItem('userDeposits');
    localStorage.removeItem('userWithdrawals');
    localStorage.removeItem('userTrades');
    
    // Reinitialize with Justin's data
    localStorage.setItem('qxTrader_user', JSON.stringify(justinUser));
    setUser(justinUser);
    
    // Preserve authentication state if user was logged in
    if (wasAuthenticated) {
      setIsAuthenticated(true);
      localStorage.setItem('qxTrader_auth', 'true');
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem('qxTrader_auth');
    }
    
    console.log('User data cleared and reinitialized with:', justinUser.name);
  };

  // Function to clean up invalid user data
  const cleanupInvalidUserData = () => {
    const savedUser = localStorage.getItem('qxTrader_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.email !== 'justin@thealphaandomega.org') {
        console.log('Cleaning up invalid user data:', userData.name);
        localStorage.setItem('qxTrader_user', JSON.stringify(justinUser));
        setUser(justinUser);
        localStorage.removeItem('qxTrader_auth');
        setIsAuthenticated(false);
        return true;
      }
    }
    return false;
  };

  // Account switching functionality
  const switchAccount = (accountType: 'demo' | 'live') => {
    if (user) {
      const updatedUser = {
        ...user,
        accountType
      };
      setUser(updatedUser);
      localStorage.setItem('qxTrader_user', JSON.stringify(updatedUser));
    }
  };

  // Get current balance based on account type
  const currentBalance = user?.accountType === 'demo' ? user.demoBalance : user?.liveBalance || 0;

  // Check if live balance should be visible (for demo purposes, always false)
  const isLiveBalanceVisible = false;

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    updateBalance,
    setUserFromLocalStorage,
    switchAccount,
    currentBalance,
    isLiveBalanceVisible,
    clearAndReinitializeUser,
    cleanupInvalidUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
