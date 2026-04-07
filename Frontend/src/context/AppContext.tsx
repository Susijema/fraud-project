import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Transaction {
  id: string;
  amount: number;
  time: number;
  class: string;
  prediction?: string;
  riskScore?: number;
}

interface Metrics {
  totalTransactions: number;
  fraudDetected: number;
  legitimate: number;
  fraudRate: number;
  avgRiskScore: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  confusionMatrix: { tn: number; fp: number; fn: number; tp: number };
}

interface AppContextType {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  metrics: Metrics | null;
  setMetrics: (metrics: Metrics) => void;
  flaggedTransactions: Transaction[];
  setFlaggedTransactions: (transactions: Transaction[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const defaultMetrics: Metrics = {
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
  confusionMatrix: { tn: 166, fp: 24, fn: 0, tp: 10 }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(defaultMetrics);
  const [flaggedTransactions, setFlaggedTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider value={{
      transactions, setTransactions,
      metrics, setMetrics,
      flaggedTransactions, setFlaggedTransactions,
      loading, setLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

