import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const riskData = [
  { range: '0.0–0.2', count: 160 },
  { range: '0.2–0.4', count: 120 },
  { range: '0.4–0.6', count: 80 },
  { range: '0.6–0.8', count: 40 },
  { range: '0.8–1.0', count: 20 },
];

export function RiskScoreChart() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Risk Score Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={riskData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="range" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
          />
          <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
