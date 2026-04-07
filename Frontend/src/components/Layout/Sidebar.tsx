import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  FileText,
  TrendingUp,
  BarChart3,
  Settings,
  Shield
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', group: 'MAIN' },
  { path: '/upload', icon: Upload, label: 'Upload Transactions', group: 'MAIN' },
  { path: '/manual', icon: FileText, label: 'Manual Entry', group: 'MAIN' },
  { path: '/fraud-analysis', icon: TrendingUp, label: 'Fraud Analysis', group: 'ANALYSIS' },
  { path: '/model-insights', icon: BarChart3, label: 'Model Insights', group: 'ANALYSIS' },
  { path: '/reports', icon: BarChart3, label: 'Reports', group: 'ANALYSIS' },
  { path: '/settings', icon: Settings, label: 'Settings', group: 'SYSTEM' },
];

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 z-30"
    >
      <div className="flex items-center gap-3 p-6 border-b border-gray-800">
        <Shield className="w-8 h-8 text-indigo-500" />
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            FraudShield AI
          </h1>
          <p className="text-xs text-gray-500">Fraud Detection Platform</p>
        </div>
      </div>
     
      <nav className="p-4 space-y-6">
        {['MAIN', 'ANALYSIS', 'SYSTEM'].map(group => (
          <div key={group}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              {group}
            </p>
            <div className="space-y-1">
              {navItems.filter(item => item.group === group).map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/50'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
}

