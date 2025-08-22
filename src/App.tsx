import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Deposit from './pages/Deposit';
import Withdrawal from './pages/Withdrawal';
import Education from './pages/Education';
import BinaryOptions from './pages/BinaryOptions';
import UserSettings from './pages/UserSettings';
import Transactions from './pages/Transactions';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
          <Route path="/withdrawal" element={<ProtectedRoute><Withdrawal /></ProtectedRoute>} />
          <Route path="/education" element={<Education />} />
          <Route path="/binary-options" element={<BinaryOptions />} />
          <Route path="/settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
