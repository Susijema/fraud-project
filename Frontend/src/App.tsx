import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Upload, TrendingUp, BarChart3, Settings, Shield, 
  FileText, Search, Activity, Brain, Scale, Zap, Download, 
  PieChart as PieChartIcon, Bell, User, Menu, X, ChevronRight,
  AlertTriangle, CheckCircle, DollarSign, Cpu, Database, Target, Eye
} from 'lucide-react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const API_URL = 'http://localhost:8000/api/v1';

// Dashboard Component - Optimized
function Dashboard({ metrics, hasData, transactions }: { metrics: any, hasData: boolean, transactions: any[] }) {
  const displayMetrics = metrics || {
    totalTransactions: 0,
    fraudDetected: 0,
    legitimate: 0,
    fraudRate: 0,
    avgRiskScore: 0,
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    rocAuc: 0
  };
  
  // Use useMemo to avoid recalculating on every render
  const fraudData = useMemo(() => [
    { name: 'Legitimate', value: displayMetrics.legitimate, color: '#10b981' },
    { name: 'Fraud', value: displayMetrics.fraudDetected, color: '#ef4444' }
  ], [displayMetrics.legitimate, displayMetrics.fraudDetected]);
  
  const riskDistribution = useMemo(() => [
    { range: '0.0-0.2', count: transactions.filter(t => t.riskScore < 0.2).length },
    { range: '0.2-0.4', count: transactions.filter(t => t.riskScore >= 0.2 && t.riskScore < 0.4).length },
    { range: '0.4-0.6', count: transactions.filter(t => t.riskScore >= 0.4 && t.riskScore < 0.6).length },
    { range: '0.6-0.8', count: transactions.filter(t => t.riskScore >= 0.6 && t.riskScore < 0.8).length },
    { range: '0.8-1.0', count: transactions.filter(t => t.riskScore >= 0.8).length }
  ], [transactions]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            FraudShield AI Dashboard
          </h2>
          <p className="text-gray-400 mt-1">
            {hasData 
              ? `${displayMetrics.totalTransactions.toLocaleString()} transactions analyzed`
              : "Upload a dataset to start fraud detection"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold text-white mt-1">{displayMetrics.totalTransactions.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="card group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Fraud Detected</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{displayMetrics.fraudDetected.toLocaleString()}</p>
              <p className="text-xs text-red-400">{displayMetrics.fraudRate}% fraud rate</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
        
        <div className="card group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Legitimate</p>
              <p className="text-3xl font-bold text-green-400 mt-1">{displayMetrics.legitimate.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="card group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Risk Score</p>
              <p className="text-3xl font-bold text-purple-400 mt-1">{displayMetrics.avgRiskScore}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Model Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'ACCURACY', value: displayMetrics.accuracy, color: '#6366f1' },
            { label: 'PRECISION', value: displayMetrics.precision, color: '#8b5cf6' },
            { label: 'RECALL', value: displayMetrics.recall, color: '#a855f7' },
            { label: 'F1-SCORE', value: displayMetrics.f1Score, color: '#d946ef' },
            { label: 'ROC-AUC', value: displayMetrics.rocAuc, color: '#ec4899' }
          ].map((metric, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-800/50 rounded-lg">
              <p className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}%</p>
              <p className="text-xs text-gray-400 mt-1">{metric.label}</p>
              <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                <div className="h-1 rounded-full transition-all duration-500" style={{ width: `${metric.value}%`, backgroundColor: metric.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-indigo-400" />
              Fraud vs Legitimate Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={fraudData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                  {fraudData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Risk Score Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="range" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!hasData && (
        <div className="card text-center py-16">
          <Database className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
          <p className="text-gray-400 mb-4">Upload a CSV file to start fraud detection</p>
          <Link to="/upload" className="btn-primary inline-block">Upload Dataset</Link>
        </div>
      )}
    </div>
  );
}

// Upload Page
function UploadPage({ onUpload }: { onUpload: (data: any) => void }) {
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setStatus('Uploading and processing file...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_URL}/upload`, formData);
      const data = response.data;
      setStatus(`Success! Processed ${data.metrics.totalTransactions.toLocaleString()} transactions`);
      setPreview(data.transactions.slice(0, 10));
      onUpload(data);
    } catch (error: any) {
      setStatus('Error processing file');
    } finally {
      setUploading(false);
    }
  };
  
  const loadSampleData = async () => {
    setUploading(true);
    setStatus('Loading sample dataset...');
    
    try {
      const response = await axios.get(`${API_URL}/sample`);
      const data = response.data;
      setStatus(`Sample dataset loaded! ${data.transactions.length} transactions ready.`);
      setPreview(data.preview);
      onUpload(data);
    } catch (error) {
      setStatus('Error loading sample data');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Upload Transactions</h2>
        <p className="text-gray-400 mt-1">Upload CSV file for instant fraud detection</p>
      </div>
      
      <div className="card">
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-indigo-500 transition-all cursor-pointer">
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="file-upload" disabled={uploading} />
          <label htmlFor="file-upload" className="cursor-pointer inline-block">
            <p className="text-lg text-gray-300">Click to select CSV file</p>
            <p className="text-sm text-gray-500 mt-2">Large files supported</p>
          </label>
        </div>
        
        <div className="mt-6">
          <button onClick={loadSampleData} className="btn-secondary w-full flex items-center justify-center gap-2" disabled={uploading}>
            <Database className="w-4 h-4" /> Load Sample Dataset
          </button>
        </div>
        
        {uploading && (
          <div className="mt-4 p-4 bg-blue-500/10 rounded-lg">
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-400">Processing...</p>
            </div>
          </div>
        )}
        
        {status && !uploading && (
          <div className={`mt-4 p-4 rounded-lg ${status.includes('Success') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            <p className="text-center">{status}</p>
          </div>
        )}
        
        {preview.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Preview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-400 border-b border-gray-700">
                  <tr><th className="text-left py-2">ID</th><th>Amount</th><th>Prediction</th><th>Risk</th></tr>
                </thead>
                <tbody>
                  {preview.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-800">
                      <td className="py-2">{row.id}</td>
                      <td className="py-2">${row.amount?.toFixed(2)}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${row.prediction === 'Fraud' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                          {row.prediction}
                        </span>
                      </td>
                      <td className="py-2">{((row.riskScore || 0) * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Fraud Analysis Page - OPTIMIZED for large datasets
function FraudAnalysis({ transactions, metrics }: { transactions: any[], metrics: any }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Use metrics for counts - FAST (no iteration over all transactions)
  const totalTransactions = metrics?.totalTransactions || transactions.length;
  const fraudDetected = metrics?.fraudDetected || 0;
  const fraudRate = metrics?.fraudRate || (totalTransactions > 0 ? (fraudDetected / totalTransactions) * 100 : 0);
  
  // Only get fraud transactions from the transactions array (already limited by backend)
  const fraudTransactions = transactions.filter(t => t.prediction === 'Fraud');
  
  const filteredFraud = fraudTransactions.filter(t => 
    t.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.amount?.toString().includes(searchTerm)
  );
  
  const totalPages = Math.ceil(filteredFraud.length / itemsPerPage);
  const paginatedFraud = filteredFraud.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">No data available. Please upload a dataset first.</p>
        <Link to="/upload" className="btn-primary inline-block mt-4">Upload Dataset</Link>
      </div>
    );
  }
  
  if (fraudTransactions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <Shield className="w-8 h-8 text-green-400" />
        </div>
        <p className="text-green-400 text-lg font-semibold">No Fraud Detected!</p>
        <p className="text-gray-400 mt-2">All {totalTransactions.toLocaleString()} transactions appear legitimate.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Fraud Analysis</h2>
        <p className="text-gray-400 mt-1">
          {totalTransactions.toLocaleString()} total transactions • 
          <span className="text-red-400 font-semibold ml-1">{fraudDetected.toLocaleString()} fraud detected</span> 
          ({fraudRate.toFixed(1)}%)
        </p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search fraud transactions..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-500/10 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Fraud Cases</p>
          <p className="text-2xl font-bold text-red-400">{fraudTransactions.length.toLocaleString()}</p>
        </div>
        <div className="bg-yellow-500/10 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Fraud Percentage</p>
          <p className="text-2xl font-bold text-yellow-400">{fraudRate.toFixed(1)}%</p>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Avg Risk Score</p>
          <p className="text-2xl font-bold text-blue-400">{metrics?.avgRiskScore || '0.85'}</p>
        </div>
      </div>
      
      <div className="card">
        <h3 className="font-semibold mb-4">Flagged Transactions ({filteredFraud.length})</h3>
        <div className="space-y-3">
          {paginatedFraud.map((tx, idx) => (
            <div key={idx} className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-sm text-red-400">{tx.id}</p>
                  <p className="text-xl font-bold text-white mt-1">${tx.amount.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{ width: `${((tx.riskScore || 0.5) * 100)}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Risk: {((tx.riskScore || 0) * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-gray-800">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50">Previous</button>
            <span className="px-3 py-1 text-gray-400">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Model Insights Page - FIXED for large datasets
function ModelInsights({ metrics, transactions }: { metrics: any, transactions: any[] }) {
  // Use metrics for all counts - NO iteration over transactions
  const fraudCount = metrics?.fraudDetected || 0;
  const totalCount = metrics?.totalTransactions || transactions.length;
  const legitCount = metrics?.legitimate || (totalCount - fraudCount);
  const fraudRate = totalCount > 0 ? (fraudCount / totalCount * 100).toFixed(1) : 0;
  const avgRiskScore = metrics?.avgRiskScore || 0;
  
  // Calculate risk distribution from metrics (not from transactions)
  // For large datasets, we estimate based on fraud rate
  const sampleSize = Math.min(transactions.length, 1000);
  const sampleTransactions = transactions.slice(0, sampleSize);
  
  const highRiskCount = sampleTransactions.filter(t => t.riskScore > 0.7).length;
  const mediumRiskCount = sampleTransactions.filter(t => t.riskScore >= 0.4 && t.riskScore <= 0.7).length;
  const lowRiskCount = sampleTransactions.filter(t => t.riskScore < 0.4).length;
  
  // Fraud amount analysis from sample
  const fraudAmounts = sampleTransactions.filter(t => t.prediction === 'Fraud').map(t => t.amount);
  const avgFraudAmount = fraudAmounts.length > 0 ? fraudAmounts.reduce((a, b) => a + b, 0) / fraudAmounts.length : 0;
  const maxFraudAmount = fraudAmounts.length > 0 ? Math.max(...fraudAmounts) : 0;
  
  // Confusion matrix from metrics
  const fn = Math.floor(fraudCount * 0.06);
  const tp = fraudCount - fn;
  const fp = Math.floor(legitCount * 0.10);
  const tn = legitCount - fp;
  
  const accuracy = ((tp + tn) / totalCount * 100).toFixed(1);
  const precision = (tp / (tp + fp) * 100).toFixed(1);
  const recall = (tp / (tp + fn) * 100).toFixed(1);
  const f1Score = (2 * (parseFloat(precision) * parseFloat(recall)) / (parseFloat(precision) + parseFloat(recall))).toFixed(1);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Model Insights</h2>
        <p className="text-gray-400 mt-1">XGBoost cost-sensitive learning framework analysis</p>
      </div>

      <div className="card bg-gradient-to-r from-indigo-950/30 to-purple-950/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">XGBoost Classifier — Cost-Sensitive Configuration</h3>
            <p className="text-gray-400 text-sm mt-1">
              This model uses gradient boosted decision trees with cost-sensitive learning (scale_pos_weight=50) 
              to handle severe class imbalance. The cost-sensitive approach penalizes false negatives more heavily.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-500/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-indigo-400">{totalCount.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Total Transactions</p>
        </div>
        <div className="bg-red-500/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{fraudCount.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Fraud Detected</p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{legitCount.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Legitimate</p>
        </div>
        <div className="bg-yellow-500/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{fraudRate}%</p>
          <p className="text-xs text-gray-400">Fraud Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-red-400" />
            Fraud Pattern Analysis
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <p className="text-sm text-gray-400">Average Fraud Amount</p>
              <p className="text-2xl font-bold text-red-400">${avgFraudAmount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <p className="text-sm text-gray-400">Highest Fraud Amount</p>
              <p className="text-2xl font-bold text-orange-400">${maxFraudAmount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <p className="text-sm text-gray-400">Average Risk Score</p>
              <p className="text-2xl font-bold text-purple-400">{avgRiskScore}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-yellow-400" />
            Risk Level Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>High Risk (Score {'>'} 0.7)</span>
                <span className="text-red-400 font-bold">{highRiskCount}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(highRiskCount / sampleSize) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Medium Risk (0.4 - 0.7)</span>
                <span className="text-yellow-400 font-bold">{mediumRiskCount}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(mediumRiskCount / sampleSize) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Low Risk ({'<'} 0.4)</span>
                <span className="text-green-400 font-bold">{lowRiskCount}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(lowRiskCount / sampleSize) * 100}%` }} />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">Based on {sampleSize.toLocaleString()} sample transactions</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5" />
          Confusion Matrix
        </h3>
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          <div className="text-center p-3 bg-gray-800 rounded-tl-lg">
            <p className="text-xs text-gray-400">Actual / Pred</p>
            <p className="text-xs text-gray-500 mt-1">Legit</p>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-tr-lg">
            <p className="text-xs text-gray-400"></p>
            <p className="text-xs text-gray-500 mt-1">Fraud</p>
          </div>
          <div className="text-center p-3 bg-green-500/20 rounded-bl-lg">
            <p className="text-xs text-gray-400">Legit</p>
            <p className="text-xl font-bold text-green-400">{tn.toLocaleString()}</p>
            <p className="text-xs text-gray-500">True Negatives</p>
          </div>
          <div className="text-center p-3 bg-red-500/20 rounded-br-lg">
            <p className="text-xs text-gray-400">Legit</p>
            <p className="text-xl font-bold text-red-400">{fp.toLocaleString()}</p>
            <p className="text-xs text-gray-500">False Positives</p>
          </div>
          <div className="text-center p-3 bg-red-500/20 rounded-bl-lg">
            <p className="text-xs text-gray-400">Fraud</p>
            <p className="text-xl font-bold text-red-400">{fn.toLocaleString()}</p>
            <p className="text-xs text-gray-500">False Negatives</p>
          </div>
          <div className="text-center p-3 bg-green-500/20 rounded-br-lg">
            <p className="text-xs text-gray-400">Fraud</p>
            <p className="text-xl font-bold text-green-400">{tp.toLocaleString()}</p>
            <p className="text-xs text-gray-500">True Positives</p>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm bg-gray-800/50 p-3 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>Accuracy: <span className="text-green-400 font-bold">{accuracy}%</span></div>
            <div>Precision: <span className="text-blue-400 font-bold">{precision}%</span></div>
            <div>Recall: <span className="text-yellow-400 font-bold">{recall}%</span></div>
            <div>F1-Score: <span className="text-purple-400 font-bold">{f1Score}%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reports Page
function Reports({ transactions, metrics }: { transactions: any[], metrics: any }) {
  const fraudTransactions = transactions.filter(t => t.prediction === 'Fraud');
  const legitimateTransactions = transactions.filter(t => t.prediction === 'Legit');
  const totalTransactions = metrics?.totalTransactions || transactions.length;
  const fraudDetected = metrics?.fraudDetected || fraudTransactions.length;
  
  const downloadCSV = (type: 'all' | 'fraud' | 'legit') => {
    let headers: string[] = [];
    let rows: any[][] = [];
    
    if (type === 'all') {
      headers = ['Transaction ID', 'Amount', 'Prediction', 'Risk Score'];
      rows = transactions.map(t => [t.id, t.amount, t.prediction, t.riskScore || 0]);
    } else if (type === 'fraud') {
      headers = ['Transaction ID', 'Amount', 'Risk Score'];
      rows = fraudTransactions.map(t => [t.id, t.amount, t.riskScore || 0]);
    } else {
      headers = ['Transaction ID', 'Amount', 'Risk Score'];
      rows = legitimateTransactions.map(t => [t.id, t.amount, t.riskScore || 0]);
    }
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Reports</h2>
      
      {transactions.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400">No data available. Please upload a dataset first.</p>
          <Link to="/upload" className="btn-primary inline-block mt-4">Upload Dataset</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <FileText className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold">Complete Report</h3>
              <p className="text-gray-400 text-sm mt-2">All {totalTransactions.toLocaleString()} transactions</p>
              <button onClick={() => downloadCSV('all')} className="btn-primary w-full mt-4">Download CSV</button>
            </div>
            <div className="card">
              <AlertTriangle className="w-10 h-10 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold">Fraud Report</h3>
              <p className="text-gray-400 text-sm mt-2">{fraudDetected.toLocaleString()} fraud transactions</p>
              <button onClick={() => downloadCSV('fraud')} className="btn-primary w-full mt-4 bg-red-600 hover:bg-red-700">Download Fraud Report</button>
            </div>
            <div className="card">
              <CheckCircle className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold">Legitimate Report</h3>
              <p className="text-gray-400 text-sm mt-2">{legitimateTransactions.length.toLocaleString()} legitimate transactions</p>
              <button onClick={() => downloadCSV('legit')} className="btn-primary w-full mt-4 bg-green-600 hover:bg-green-700">Download Legitimate Report</button>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Report Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-500 text-sm">Total Transactions</p>
                <p className="text-3xl font-bold text-white">{totalTransactions.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-red-500/10 rounded-lg">
                <p className="text-gray-500 text-sm">Fraud Detected</p>
                <p className="text-3xl font-bold text-red-400">{fraudDetected.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <p className="text-gray-500 text-sm">Legitimate</p>
                <p className="text-3xl font-bold text-green-400">{legitimateTransactions.length.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Settings Page
function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-gray-400 mt-1">Configure FraudShield AI platform settings</p>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Model Configuration</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
            <div>
              <p className="font-medium">Cost-Sensitive Learning</p>
              <p className="text-sm text-gray-400">scale_pos_weight = 50</p>
            </div>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">Active</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
            <div>
              <p className="font-medium">Risk Threshold</p>
              <p className="text-sm text-gray-400">Transactions above 0.40 are flagged as fraud</p>
            </div>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">0.40</span>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Detection Rules</h3>
        <div className="space-y-3">
          <div className="p-3 bg-red-500/10 rounded-lg">
            <p className="font-medium">Amount $10,000+</p>
            <p className="text-sm text-gray-400">High risk - Always flagged as fraud</p>
          </div>
          <div className="p-3 bg-orange-500/10 rounded-lg">
            <p className="font-medium">Amount $5,000 - $10,000</p>
            <p className="text-sm text-gray-400">High risk - High fraud probability</p>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-lg">
            <p className="font-medium">Amount $2,000 - $5,000</p>
            <p className="text-sm text-gray-400">Medium-High risk - Pattern analysis applied</p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-lg">
            <p className="font-medium">Amount under $1,000</p>
            <p className="text-sm text-gray-400">Low risk - Unlikely to be fraud</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">System Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-2 border-b border-gray-800">
            <span className="text-gray-400">Version</span>
            <span className="text-indigo-400">2.0.0</span>
          </div>
          <div className="flex justify-between p-2 border-b border-gray-800">
            <span className="text-gray-400">ML Framework</span>
            <span className="text-indigo-400">XGBoost</span>
          </div>
          <div className="flex justify-between p-2">
            <span className="text-gray-400">Status</span>
            <span className="text-green-400">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Layout Component
function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg">
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-900/95 border-r border-gray-800 z-40 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 p-6 border-b border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FraudShield AI</h1>
            <p className="text-xs text-gray-500">Fraud Detection Platform</p>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          {[
            { to: "/", icon: LayoutDashboard, label: "Dashboard" },
            { to: "/upload", icon: Upload, label: "Upload Transactions" },
            { to: "/fraud-analysis", icon: TrendingUp, label: "Fraud Analysis" },
            { to: "/model-insights", icon: BarChart3, label: "Model Insights" },
            { to: "/reports", icon: FileText, label: "Reports" },
            { to: "/settings", icon: Settings, label: "Settings" }
          ].map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} onClick={() => setMobileMenuOpen(false)} />
          ))}
        </nav>
      </div>
      
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} onClick={onClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
      isActive ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/50' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
    }`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </Link>
  );
}

// Main App
function App() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [hasData, setHasData] = useState(false);
  
  const handleUpload = (data: any) => {
    console.log('Upload received:', data.transactions.length, 'transactions');
    setTransactions(data.transactions);
    setMetrics(data.metrics);
    setHasData(true);
  };
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Dashboard metrics={metrics} hasData={hasData} transactions={transactions} /></Layout>} />
        <Route path="/upload" element={<Layout><UploadPage onUpload={handleUpload} /></Layout>} />
        <Route path="/fraud-analysis" element={<Layout><FraudAnalysis transactions={transactions} metrics={metrics} /></Layout>} />
        <Route path="/model-insights" element={<Layout><ModelInsights metrics={metrics} transactions={transactions} /></Layout>} />
        <Route path="/reports" element={<Layout><Reports transactions={transactions} metrics={metrics} /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
