import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Deposit from './pages/Deposit';
import Withdrawal from './pages/Withdrawal';
import Education from './pages/Education';
import BinaryOptions from './pages/BinaryOptions';
import UserSettings from './pages/UserSettings';
import VerificationAdmin from './components/VerificationAdmin';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdrawal" element={<Withdrawal />} />
          <Route path="/education" element={<Education />} />
          <Route path="/binary-options" element={<BinaryOptions />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/verification-admin" element={<VerificationAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
