import React from 'react';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

export function ReportsPage() {
  const handleDownload = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csvContent = "Transaction ID,Amount,Time,Prediction,Risk Score\n" +
        Array.from({ length: 50 }, (_, i) =>
          `TXN-${String(i+1).padStart(5, '0')},${(Math.random() * 10000).toFixed(2)},${Math.floor(Math.random() * 200000)},${Math.random() < 0.17 ? 'Fraud' : 'Legit'},${(Math.random() * 0.99).toFixed(3)}`
        ).join('\n');
     
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fraud-report.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert('PDF report generation would connect to backend API');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white">Reports</h2>
        <p className="text-gray-400">Download comprehensive fraud detection reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="card">
          <FileSpreadsheet className="w-10 h-10 text-green-400 mb-4" />
          <h3 className="text-xl font-semibold">CSV Report</h3>
          <p className="text-gray-400 text-sm mt-1 mb-4">
            All predictions with risk scores in spreadsheet format.
          </p>
          <button onClick={() => handleDownload('csv')} className="btn-primary w-full flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="card">
          <FileText className="w-10 h-10 text-red-400 mb-4" />
          <h3 className="text-xl font-semibold">PDF Report</h3>
          <p className="text-gray-400 text-sm mt-1 mb-4">
            Full report with summary, metrics, and flagged transactions.
          </p>
          <button onClick={() => handleDownload('pdf')} className="btn-primary w-full flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </motion.div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Report Contents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            <span>Executive summary with fraud counts and rates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            <span>Model performance metrics (Accuracy, Precision, Recall, F1, ROC-AUC)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            <span>Full list of flagged fraud transactions with risk scores</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            <span>Exportable data for further analysis in Excel/BI tools</span>
          </div>
        </div>
      </div>
    </div>
  );
}
