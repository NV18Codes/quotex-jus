import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity,
  Clock,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TradingPanel from '@/components/TradingPanel';
import TradingChart from '@/components/TradingChart';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';

const TradingDashboard = () => {
  const { user } = useAuth();

  const quickStats = [
    {
      title: 'Demo Balance',
      value: `$${user?.demoBalance.toLocaleString()}`,
      change: 'Demo account',
      isPositive: true,
      icon: Activity
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      {/* Welcome Section */}
      <section className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>
              <p className="text-gray-400 mt-2">
                Ready to make your next trade? Current balances:
                <span className="font-semibold text-blue-400 ml-1">
                  ${user?.demoBalance.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 ml-2">(Demo)</span>
                <span className="font-semibold text-green-400 ml-3">
                  ${user?.liveBalance.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 ml-2">(Live)</span>
              </p>
              <div className="flex items-center gap-4 mt-2">
                <Badge className="bg-blue-600 text-white">
                  <Activity className="h-3 w-3 mr-1" />
                  Demo: ${user?.demoBalance.toLocaleString()}
                </Badge>
                <Badge className="bg-green-600 text-white">
                  <Activity className="h-3 w-3 mr-1" />
                  Live: ${user?.liveBalance.toLocaleString()}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">
                {new Date().toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </div>
              <Badge className="bg-blue-600 text-white mt-1">
                <Activity className="h-3 w-3 mr-1" />
                DEMO
              </Badge>
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Trading Layout: Chart (full width) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TradingChart />
        </div>
        
        {/* Demo Account Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Demo Account Status */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Demo Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-600 rounded-lg bg-gray-700">
                    <div>
                      <div className="text-sm text-gray-400">{stat.title}</div>
                      <div className="text-lg font-bold text-white">{stat.value}</div>
                      <div className={`text-xs mt-1 ${stat.isPositive ? 'text-blue-400' : 'text-gray-400'}`}>{stat.change}</div>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.isPositive ? 'bg-blue-900/20' : 'bg-gray-600'}`}>
                      <stat.icon className={`h-4 w-4 ${stat.isPositive ? 'text-blue-400' : 'text-gray-400'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-600 rounded-lg bg-gray-700">
                  <div>
                    <div className="text-sm text-gray-400">Account Type</div>
                    <div className="text-lg font-bold text-blue-400">Demo Account</div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-900/20">
                    <Activity className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-600 rounded-lg bg-gray-700">
                  <div>
                    <div className="text-sm text-gray-400">Demo Balance</div>
                    <div className="text-lg font-bold text-blue-400">${user?.demoBalance.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-900/20">
                    <Activity className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-600 rounded-lg bg-gray-700">
                  <div>
                    <div className="text-sm text-gray-400">Live Balance</div>
                    <div className="text-lg font-bold text-green-400">${user?.liveBalance.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-green-900/20">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-600 rounded-lg bg-gray-700">
                  <div>
                    <div className="text-sm text-gray-400">Status</div>
                    <div className="text-lg font-bold text-green-400">Active</div>
                  </div>
                  <div className="p-2 rounded-lg bg-green-900/20">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trading Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TradingPanel />
      </div>

      {/* Market Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 border border-gray-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-white">EUR/USD</div>
                <div className="text-sm text-green-400">+0.15%</div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">1.0875</div>
              <div className="text-sm text-gray-400">Vol: 125.4K</div>
            </div>
            <div className="p-4 border border-gray-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-white">GBP/USD</div>
                <div className="text-sm text-red-400">-0.08%</div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">1.2650</div>
              <div className="text-sm text-gray-400">Vol: 89.2K</div>
            </div>
            <div className="p-4 border border-gray-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-white">USD/JPY</div>
                <div className="text-sm text-green-400">+0.22%</div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">149.85</div>
              <div className="text-sm text-gray-400">Vol: 156.7K</div>
            </div>
            <div className="p-4 border border-gray-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-white">USD/CHF</div>
                <div className="text-sm text-red-400">-0.12%</div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">0.8925</div>
              <div className="text-sm text-gray-400">Vol: 67.3K</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
};

const MarketingLanding = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

const IndexContent = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <TradingDashboard /> : <MarketingLanding />;
};

const Index = () => {
  return <IndexContent />;
};

export default Index;
