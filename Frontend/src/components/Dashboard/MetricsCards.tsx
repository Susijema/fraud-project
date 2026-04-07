import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } })
};

export function MetricsCards() {
  const { metrics } = useApp();
  if (!metrics) return null;

  const cards = [
    {
      title: 'Total Transactions',
      value: metrics.totalTransactions,
      sub: 'Analyzed',
      icon: DollarSign,
      color: 'from-blue-600 to-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Fraud Detected',
      value: metrics.fraudDetected,
      sub: `${metrics.fraudRate}% fraud rate`,
      icon: AlertTriangle,
      color: 'from-red-600 to-red-400',
      bg: 'bg-red-500/10'
    },
    {
      title: 'Legitimate',
      value: metrics.legitimate,
      sub: 'Verified safe',
      icon: CheckCircle,
      color: 'from-green-600 to-green-400',
      bg: 'bg-green-500/10'
    },
    {
      title: 'Avg. Risk Score',
      value: metrics.avgRiskScore.toFixed(3),
      sub: 'Across all transactions',
      icon: TrendingUp,
      color: 'from-purple-600 to-purple-400',
      bg: 'bg-purple-500/10'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="card relative overflow-hidden group"
        >
          <div className={`absolute inset-0 ${card.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
