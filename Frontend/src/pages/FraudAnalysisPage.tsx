import React, { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export function FraudAnalysisPage() {
  const { transactions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  const flaggedTransactions = transactions.filter(t => t.prediction === 'Fraud' || t.class === 'Fraud');
  const highRisk = flaggedTransactions.slice(0, 6);
  
  const filteredTransactions = transactions.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.amount.toString().includes(searchTerm)
  ).slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Fraud Analysis</h2>
        <p className="text-gray-400">{transactions.length} transactions • {flaggedTransactions.length} high-risk flagged</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Flagged Transactions ({flaggedTransactions.length})
            </h3>
            <div className="space-y-2">
              {highRisk.map((tx, idx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm">{tx.id}</span>
                    <span className="text-red-400 font-bold">${tx.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">Risk: {(tx.riskScore || 0.95).toFixed(3)}</span>
                    <span className="text-xs text-red-400">High Risk</span>
                  </div>
                </motion.div>
              ))}
              {flaggedTransactions.length > 6 && (
                <p className="text-center text-gray-500 text-sm">+{flaggedTransactions.length - 6} more</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by ID or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button className="btn-secondary text-sm">Filter</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-400 border-b border-gray-700">
                  <tr>
                    <th className="text-left py-3">Transaction ID</th>
                    <th className="text-left py-3">Amount</th>
                    <th className="text-left py-3">Time</th>
                    <th className="text-left py-3">Prediction</th>
                    <th className="text-left py-3">Risk Score ↓</th>
                    <th className="text-left py-3">Explain</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3 font-mono text-xs">{tx.id}</td>
                      <td className="py-3">${tx.amount.toFixed(2)}</td>
                      <td className="py-3 text-gray-400">{tx.time || '-'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          (tx.prediction === 'Fraud' || tx.class === 'Fraud') 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {tx.prediction === 'Fraud' || tx.class === 'Fraud' ? 'Fraud' : 'Legit'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full"
                              style={{ width: `${((tx.riskScore || 0.5) * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs">{(tx.riskScore || 0.5).toFixed(3)}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <button className="text-indigo-400 hover:text-indigo-300 text-xs">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
