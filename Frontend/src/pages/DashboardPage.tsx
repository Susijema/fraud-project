import React from 'react';
import { MetricsCards } from '../components/Dashboard/MetricsCards';
import { FraudChart } from '../components/Dashboard/FraudChart';
import { RiskScoreChart } from '../components/Dashboard/RiskScoreChart';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const { metrics } = useApp();

  const metricCards = metrics ? [
    { label: 'ACCURACY', value: `${metrics.accuracy.toFixed(2)}%` },
    { label: 'PRECISION', value: `${metrics.precision.toFixed(2)}%` },
    { label: 'RECALL', value: `${metrics.recall.toFixed(2)}%` },
    { label: 'F1-SCORE', value: `${metrics.f1Score.toFixed(2)}%` },
    { label: 'ROC-AUC', value: `${metrics.rocAuc.toFixed(2)}%` },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          FraudShield AI Dashboard
        </h2>
        <p className="text-gray-400 mt-2">
          Real-time fraud detection powered by XGBoost cost-sensitive learning. Designed for financial analysts working with imbalanced transaction datasets.
        </p>
      </div>

      <MetricsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <FraudChart />
        </div>
        <div className="lg:col-span-2">
          <RiskScoreChart />
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Model Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {metricCards.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <p className="text-2xl font-bold text-indigo-400">{metric.value}</p>
              <p className="text-xs text-gray-400 mt-1">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

