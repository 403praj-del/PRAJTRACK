import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { getAllStats } from '../services/storage';

export default function Dashboard({ onCapture }) {
  const [stats, setStats] = useState({ count: 0, recent: [] });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getAllStats();
    setStats(data);
  };

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-center pt-4">
        <div onClick={loadStats}> {/* Tap header to refresh helper */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tracker
          </h1>
          <p className="text-sm text-text-muted">Track your expenses</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center">
          <span className="font-bold text-primary">P</span>
        </div>
      </header>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-surface to-background border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors"></div>
        <div className="relative z-10">
          <p className="text-sm text-text-muted mb-1">Total Uploads</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">{stats.count}</h2>
          <div className="flex items-center gap-2 mt-4 text-xs font-medium text-secondary bg-secondary/10 w-fit px-2 py-1 rounded-md">
            <TrendingUp size={14} />
            <span>Ready to track</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-semibold text-lg">Recent Activity</h3>
        </div>

        {stats.recent.length === 0 ? (
          /* Empty State */
          <div className="border border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-text-muted">
              <Clock size={24} />
            </div>
            <div>
              <p className="font-medium">No recent uploads</p>
              <p className="text-xs text-text-muted mt-1 max-w-[200px]">
                Tap the camera button to scan your first receipt.
              </p>
            </div>
            <button
              onClick={onCapture}
              className="mt-2 text-sm text-primary font-medium hover:underline"
            >
              Scan Receipt
            </button>
          </div>
        ) : (
          /* List State */
          <div className="space-y-3">
            {stats.recent.map((tx) => (
              <div key={tx.id} className="bg-surface border border-border rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">{tx.category || 'Expense'}</p>
                  <p className="text-xs text-text-muted">{new Date(tx.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{tx.amount}</p>
                  <p className="text-[10px] text-text-muted">{tx.method}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
