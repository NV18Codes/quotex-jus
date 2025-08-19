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
  // Dubai Region verification fields
  dubaiVerification?: {
    isVerified: boolean;
    verificationDate?: Date;
    fullName?: string;
    country?: string;
    address?: string;
    whyQuotex?: string;
    governmentId?: string;
    documentsUploaded?: boolean;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    submittedAt?: Date;
  };
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
  // Dubai verification methods
  submitDubaiVerification: (verificationData: any) => void;
  checkDubaiVerificationRequired: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Two default users
// Remove Samuel user definition
// const samuelUser: User = {
//   id: '1',
//   name: 'Samuel Joseph',
//   email: 'samuelkjoseph2020@gmail.com',
//   demoBalance: 111111.45,
//   liveBalance: 145897,
//   totalTrades: 11893,
//   winRate: 95,
//   totalPnL: 349000,
//   tradeHistory: generateTradeHistory()
// };

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
  dubaiVerification: {
    isVerified: false,
    verificationStatus: 'pending',
    documentsUploaded: false
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('qxTrader_user');
    if (!savedUser) {
      // Initialize demo-ready user
      localStorage.setItem('qxTrader_user', JSON.stringify(justinUser));
      setUser(justinUser);
      setIsAuthenticated(false);
    } else {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
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
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('qxTrader_user');
    setUser(null);
    setIsAuthenticated(false);
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

  // Dubai verification methods
  const submitDubaiVerification = (verificationData: any) => {
    if (user) {
      const updatedUser = {
        ...user,
        dubaiVerification: {
          ...user.dubaiVerification,
          ...verificationData,
          submittedAt: new Date(),
          verificationStatus: 'pending' as const,
          documentsUploaded: true
        }
      };
      setUser(updatedUser);
      localStorage.setItem('qxTrader_user', JSON.stringify(updatedUser));
    }
  };

  const checkDubaiVerificationRequired = (): boolean => {
    if (!user) return false;
    
    // Check if user is in Dubai region (you can add more sophisticated logic here)
    const isDubaiRegion = true; // For now, assume all users are in Dubai region
    
    // Check if verification is already completed
    const isAlreadyVerified = user.dubaiVerification?.isVerified;
    
    // Manual verification - no automatic balance threshold
    // Users can manually trigger verification when needed
    return isDubaiRegion && !isAlreadyVerified;
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
    submitDubaiVerification,
    checkDubaiVerificationRequired,
    switchAccount,
    currentBalance,
    isLiveBalanceVisible
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
