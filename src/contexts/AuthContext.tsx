import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  liveBalance: number;
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  tradeHistory: Trade[];
  accountType: 'live';
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
  switchAccount: (accountType: 'live') => void;
  currentBalance: number;
  isLiveBalanceVisible: boolean;
  clearAndReinitializeUser: () => void;
  cleanupInvalidUserData: () => boolean;
  getLiveBalance: () => number;
  resetLiveBalance: () => void;
  refreshUserData: () => void;
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
  name: 'Justin Raju Arokiaswamy',
  email: 'justin@thealphaandomega.org',
  liveBalance: 1000, // Live balance set to 1000 as requested
  totalTrades: 0,
  winRate: 0,
  totalPnL: 0,
  tradeHistory: [],
  accountType: 'live' // Changed from 'demo' to 'live'
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
        // Ensure live balance is always $1,000
        if (userData.liveBalance !== 1000) {
          userData.liveBalance = 1000;
          localStorage.setItem('qxTrader_user', JSON.stringify(userData));
          console.log('Corrected live balance to $1,000');
        }
        
        console.log('User data loaded - Live Balance:', userData.liveBalance);
        
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
      console.log('New user live balance:', justinUser.liveBalance);
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
        // Ensure live balance is always $1,000
        if (authenticatedUser.liveBalance !== 1000) {
          authenticatedUser.liveBalance = 1000;
          localStorage.setItem('qxTrader_user', JSON.stringify(authenticatedUser));
          console.log('Corrected live balance to $1,000 during login');
        }
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
      const newLiveBalance = Math.max(1000, user.liveBalance + amount);
      const updatedUser = {
        ...user,
        liveBalance: newLiveBalance
      };
      setUser(updatedUser);
      localStorage.setItem('qxTrader_user', JSON.stringify(updatedUser));
      console.log(`Live balance updated: $${user.liveBalance} + $${amount} = $${newLiveBalance}`);
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

  // Account switching functionality (only live now)
  const switchAccount = (accountType: 'live') => {
    if (user) {
      const updatedUser = {
        ...user,
        accountType
      };
      setUser(updatedUser);
      localStorage.setItem('qxTrader_user', JSON.stringify(updatedUser));
    }
  };

  // Get current balance based on account type (always live now)
  const currentBalance = user?.liveBalance || 0;

  // Check if live balance should be visible (for demo purposes, always false)
  const isLiveBalanceVisible = false;

  // Ensure live balance is always accessible
  const getLiveBalance = () => user?.liveBalance || 0;

  // Function to reset live balance to $1,000
  const resetLiveBalance = () => {
    if (user) {
      const updatedUser = {
        ...user,
        liveBalance: 1000
      };
      setUser(updatedUser);
      localStorage.setItem('qxTrader_user', JSON.stringify(updatedUser));
      console.log('Live balance reset to $1,000');
    }
  };

  // Function to force refresh user data and ensure correct balances
  const refreshUserData = () => {
    const savedUser = localStorage.getItem('qxTrader_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.email === 'justin@thealphaandomega.org') {
        // Ensure live balance is always $1,000
        if (userData.liveBalance !== 1000) {
          userData.liveBalance = 1000;
          localStorage.setItem('qxTrader_user', JSON.stringify(userData));
          console.log('Corrected live balance to $1,000 during refresh');
        }
        setUser(userData);
      }
    }
  };

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
    cleanupInvalidUserData,
    getLiveBalance,
    resetLiveBalance,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
