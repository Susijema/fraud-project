import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useApp } from '../../context/AppContext';

export function FraudChart() {
  const { metrics } = useApp();
  if (!metrics) return null;

  const data = [
    { name: 'Legitimate', value: metrics.legitimate, color: '#10b981' },
    { name: 'Fraud', value: metrics.fraudDetected, color: '#ef4444' },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Fraud vs Legitimate Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

