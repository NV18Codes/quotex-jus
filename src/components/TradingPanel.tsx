import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, TrendingDown, Filter } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  duration: number;
  timeRemaining: number;
  status: 'processing' | 'completed';
  timestamp: Date;
}

const TradingPanel = () => {
  const { user, updateBalance } = useAuth();
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD');
  const [tradeAmount, setTradeAmount] = useState(100);
  const [tradeDuration, setTradeDuration] = useState(30);
  const [isTrading, setIsTrading] = useState(false);
  const [activeTrade, setActiveTrade] = useState<Trade | null>(null);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [tradeFilter, setTradeFilter] = useState('all');

  const symbols = [
    { value: 'EUR/USD', label: 'EUR/USD' },
    { value: 'GBP/USD', label: 'GBP/USD' },
    { value: 'USD/JPY', label: 'USD/JPY' },
    { value: 'USD/CHF', label: 'USD/CHF' },
    { value: 'AUD/USD', label: 'AUD/USD' },
    { value: 'CAD/USD', label: 'CAD/USD' }
  ];

  const durations = [
    { value: 30, label: '30 Seconds' },
    { value: 60, label: '1 Minute' },
    { value: 300, label: '5 Minutes' },
    { value: 900, label: '15 Minutes' },
    { value: 1800, label: '30 Minutes' }
  ];

  // Countdown effect for active trades
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTrade && activeTrade.timeRemaining > 0) {
      interval = setInterval(() => {
        setActiveTrade(prev => {
          if (!prev) return null;
          
          if (prev.timeRemaining <= 1) {
            // Trade completed
            const completedTrade = { ...prev, status: 'completed' as const, timeRemaining: 0 };
            setTradeHistory(prevHistory => [completedTrade, ...prevHistory]);
            setIsTrading(false);
            
            // Calculate profit and update balance
            const profit = prev.amount * 0.8;
            updateBalance(profit);
            
            // Show result
            alert(`Trade completed! You won $${profit.toFixed(2)}`);
            
            return null;
          }
          
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTrade, updateBalance]);

  const getSelectedSymbolName = () => {
    const symbol = symbols.find(s => s.value === selectedSymbol);
    return symbol ? symbol.label : selectedSymbol;
  };

  const handleTrade = (type: 'buy' | 'sell') => {
    if (!user) return;

    const newTrade: Trade = {
      id: `trade_${Date.now()}`,
      symbol: selectedSymbol,
      type,
      amount: tradeAmount,
      duration: tradeDuration,
      timeRemaining: tradeDuration,
      status: 'processing',
      timestamp: new Date()
    };

    setActiveTrade(newTrade);
    setIsTrading(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (trade: Trade) => {
    return ((trade.duration - trade.timeRemaining) / trade.duration) * 100;
  };

  const filteredTrades = tradeHistory.filter(trade => {
    if (tradeFilter === 'all') return true;
    if (tradeFilter === 'buy') return trade.type === 'buy';
    if (tradeFilter === 'sell') return trade.type === 'sell';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Account Balance Display */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Account Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div className="text-sm text-gray-400">Live Account</div>
            <div className="text-lg font-semibold text-green-400">
              ${user?.liveBalance.toLocaleString()}
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
              <TrendingUp className="h-4 w-4 mr-2" />
              {isTrading ? 'Processing...' : 'BUY'}
            </Button>
            <Button
              onClick={() => handleTrade('sell')}
              disabled={isTrading}
              className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed"
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              {isTrading ? 'Processing...' : 'SELL'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trade History */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Trade History
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={tradeFilter} onValueChange={setTradeFilter}>
                <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-600">All Trades</SelectItem>
                  <SelectItem value="buy" className="text-white hover:bg-gray-600">Buy</SelectItem>
                  <SelectItem value="sell" className="text-white hover:bg-gray-600">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Active Trade */}
          {activeTrade && (
            <div className="mb-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{activeTrade.symbol}</span>
                  <Badge className={activeTrade.type === 'buy' ? 'bg-green-600' : 'bg-red-600'}>
                    {activeTrade.type.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-white font-medium">${activeTrade.amount}</span>
              </div>
              
              <div className="mb-2">
                <span className="text-gray-300 text-sm">Time Remaining: </span>
                <span className="text-white font-medium">{formatTime(activeTrade.timeRemaining)}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${getProgressPercentage(activeTrade)}%` }}
                ></div>
              </div>
              
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          )}

          {/* Trade History List */}
          <div className="space-y-2">
            {filteredTrades.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No trades yet. Place your first trade above!
              </div>
            ) : (
              filteredTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-white">{trade.symbol}</span>
                    <Badge className={trade.type === 'buy' ? 'bg-green-600' : 'bg-red-600'}>
                      {trade.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">${trade.amount}</div>
                    <div className="text-xs text-gray-400">
                      {trade.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dubai Verification Modal */}
      {/* This component is removed as per the edit hint */}
    </div>
  );
};

export default TradingPanel;