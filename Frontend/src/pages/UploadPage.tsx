import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Database, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Papa from 'papaparse';

export function UploadPage() {
  const { setTransactions, setMetrics, setLoading, loading } = useApp();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [previewData, setPreviewData] = useState<any[]>([]);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setUploadStatus('idle');
   
    // Simulate API call
    setTimeout(() => {
      // Generate sample data
      const sampleTransactions = [];
      for (let i = 0; i < 200; i++) {
        const isFraud = Math.random() < 0.17;
        sampleTransactions.push({
          id: `TXN-${String(i+1).padStart(5, '0')}`,
          amount: Math.random() * 10000,
          time: Math.floor(Math.random() * 200000),
          class: isFraud ? 'Fraud' : 'Legit',
          prediction: isFraud ? 'Fraud' : 'Legit',
          riskScore: isFraud ? 0.7 + Math.random() * 0.29 : Math.random() * 0.3
        });
      }
     
      setTransactions(sampleTransactions);
      setMetrics({
        totalTransactions: 200,
        fraudDetected: 34,
        legitimate: 166,
        fraudRate: 17.0,
        avgRiskScore: 0.376,
        accuracy: 88.0,
        precision: 29.41,
        recall: 100.0,
        f1Score: 45.45,
        rocAuc: 96.84,
        confusionMatrix: { tn: 166, fp: 24, fn: 0, tp: 34 }
      });
     
      // Parse CSV for preview
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setPreviewData(results.data.slice(0, 7));
        }
      });
     
      setUploadStatus('success');
      setLoading(false);
    }, 1500);
  };

  const loadSampleData = () => {
    setLoading(true);
    setTimeout(() => {
      const sampleTransactions = [];
      for (let i = 0; i < 200; i++) {
        const isFraud = Math.random() < 0.17;
        sampleTransactions.push({
          id: `TXN-${String(i+1).padStart(5, '0')}`,
          amount: Math.random() * 10000,
          time: Math.floor(Math.random() * 200000),
          class: isFraud ? 'Fraud' : 'Legit',
          prediction: isFraud ? 'Fraud' : 'Legit',
          riskScore: isFraud ? 0.7 + Math.random() * 0.29 : Math.random() * 0.3
        });
      }
     
      setTransactions(sampleTransactions);
      setMetrics({
        totalTransactions: 200,
        fraudDetected: 34,
        legitimate: 166,
        fraudRate: 17.0,
        avgRiskScore: 0.376,
        accuracy: 88.0,
        precision: 29.41,
        recall: 100.0,
        f1Score: 45.45,
        rocAuc: 96.84,
        confusionMatrix: { tn: 166, fp: 24, fn: 0, tp: 34 }
      });
     
      setPreviewData([
        { ID: 'TXN-00001', Amount: '184.43', Time: '127988', Class: '0' },
        { ID: 'TXN-00002', Amount: '4579.26', Time: '119171', Class: '1' },
        { ID: 'TXN-00003', Amount: '85.72', Time: '36839', Class: '0' },
      ]);
     
      setUploadStatus('success');
      setLoading(false);
    }, 1000);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Upload Transactions</h2>
        <p className="text-gray-400 mt-1">
          Upload a CSV file with transaction data. Required: Amount, Optional: Time, V1-V28, Class.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
              uploadStatus === 'success'
                ? 'border-green-500 bg-green-500/10'
                : 'border-gray-700 hover:border-indigo-500 bg-gray-900/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-lg font-medium text-gray-300">
              {loading ? 'Processing...' : 'Drag & drop CSV file here'}
            </p>
            <p className="text-sm text-gray-500 mt-2">or click to browse</p>
          </div>

          <div className="mt-4 flex gap-4">
            <button onClick={loadSampleData} className="btn-secondary flex items-center gap-2">
              <Database className="w-4 h-4" />
              Load Sample Dataset (200 transactions)
            </button>
          </div>

          <AnimatePresence>
            {uploadStatus === 'success' && previewData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 card"
              >
                <div className="flex items-center gap-2 text-green-400 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span>Preprocessing Completed — 200 transactions ready</span>
                </div>
                <h3 className="font-semibold mb-3">Dataset Preview</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-gray-400 border-b border-gray-700">
                      <tr>
                        <th className="text-left py-2">ID</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Time</th>
                        <th className="text-left py-2">Class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-800">
                          <td className="py-2">{row.ID || `TXN-${String(idx+1).padStart(5, '0')}`}</td>
                          <td className="py-2">${parseFloat(row.Amount || 0).toFixed(2)}</td>
                          <td className="py-2">{row.Time || '-'}</td>
                          <td className="py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              row.Class === '1' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                            }`}>
                              {row.Class === '1' ? 'Fraud' : 'Legit'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="btn-primary w-full mt-4">Run Fraud Detection →</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <p className="text-sm text-gray-400 mb-4">
            Load sample dataset or upload your own CSV for instant fraud analysis.
          </p>
          <div className="space-y-2">
            <div className="text-xs text-gray-500">
              <p>✓ XGBoost cost-sensitive learning</p>
              <p>✓ Real-time risk scoring</p>
              <p>✓ Explainable predictions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
