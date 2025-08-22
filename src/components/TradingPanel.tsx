import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  duration: number;
  result?: 'win' | 'loss';
  profit?: number;
  timestamp: Date;
  status: 'pending' | 'completed';
  timeLeft?: number;
}

const TradingPanel = () => {
  const { user, updateBalance } = useAuth();
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD');
  const [tradeAmount, setTradeAmount] = useState(100);
  const [tradeDuration, setTradeDuration] = useState(60);
  const [isTrading, setIsTrading] = useState(false);

  const symbols = [
    { value: 'EUR/USD', label: 'EUR/USD' },
    { value: 'GBP/USD', label: 'GBP/USD' },
    { value: 'USD/JPY', label: 'USD/JPY' },
    { value: 'USD/CHF', label: 'USD/CHF' },
    { value: 'AUD/USD', label: 'AUD/USD' },
    { value: 'CAD/USD', label: 'CAD/USD' }
  ];

  const durations = [
    { value: 60, label: '1 Minute' },
    { value: 300, label: '5 Minutes' },
    { value: 900, label: '15 Minutes' },
    { value: 1800, label: '30 Minutes' },
    { value: 3600, label: '1 Hour' }
  ];

  useEffect(() => {
    // Check if manual verification should be shown
    // This logic is removed as per the edit hint
  }, []);

  const getSelectedSymbolName = () => {
    const symbol = symbols.find(s => s.value === selectedSymbol);
    return symbol ? symbol.label : selectedSymbol;
  };

  const handleTrade = (type: 'buy' | 'sell') => {
    if (!user) return;

    setIsTrading(true);

    // Simulate trade processing
    setTimeout(() => {
      // Simulate trade result (random win/loss for demo purposes)
      const isWin = Math.random() > 0.5;
      const profit = isWin ? tradeAmount * 0.8 : -tradeAmount;
      
      // Update balance
      updateBalance(profit);
      
      setIsTrading(false);
      
      // Show result
      if (isWin) {
        alert(`Trade completed! You won $${profit.toFixed(2)}`);
      } else {
        alert(`Trade completed! You lost $${Math.abs(profit).toFixed(2)}`);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Account Balance Display */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Account Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Demo Account</div>
              <div className="text-lg font-semibold text-blue-400">
                ${user?.demoBalance.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Live Account</div>
              <div className="text-lg font-semibold text-gray-400">
                $0.00
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Place Trade */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Place Trade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Symbol Selection */}
          <div>
            <Label htmlFor="symbol" className="text-gray-300">Trading Symbol</Label>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {symbols.map((symbol) => (
                  <SelectItem key={symbol.value} value={symbol.value} className="text-white hover:bg-gray-600">
                    {symbol.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-400 mt-1">{getSelectedSymbolName()}</div>
          </div>

          {/* Investment Amount */}
          <div>
            <Label htmlFor="amount" className="text-gray-300">Investment Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(Number(e.target.value))}
              min="10"
              max="10000"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {/* Duration Selection */}
          <div>
            <Label htmlFor="duration" className="text-gray-300">Trade Duration</Label>
            <Select value={tradeDuration.toString()} onValueChange={(value) => setTradeDuration(Number(value))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {durations.map((duration) => (
                  <SelectItem key={duration.value} value={duration.value.toString()} className="text-white hover:bg-gray-600">
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dubai Verification Warning */}
          {/* This section is removed as per the edit hint */}

          {/* Trade Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleTrade('buy')}
              disabled={isTrading}
              className="bg-green-600 text-white hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed"
            >
              {isTrading ? 'Processing...' : 'BUY'}
            </Button>
            <Button
              onClick={() => handleTrade('sell')}
              disabled={isTrading}
              className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed"
            >
              {isTrading ? 'Processing...' : 'SELL'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dubai Verification Modal */}
      {/* This component is removed as per the edit hint */}
    </div>
  );
};

export default TradingPanel;