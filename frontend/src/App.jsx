import React, { useState, useEffect } from 'react';
import { getEntries } from './services/api';
import FinanceTable from './components/FinanceTable';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

function App() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getEntries();
      setEntries(res.data);
    } catch (err) {
      console.error("Backend vibe check failed:", err);
    }
  };
  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.actual, 0);

  const totalExpense = entries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.actual, 0);

  return (
    <div className="min-h-screen bg-[#F5F7F9] p-4 md:p-8">
      {/* Header Summary */}
      <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border-t-4 border-[#F8D7CC] shadow-sm flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase">Total Income</p>
            <h2 className="text-3xl font-bold text-slate-800">₹{totalIncome.toLocaleString()}</h2>
          </div>
          <TrendingUp className="text-green-500 w-10 h-10" />
        </div>

        <div className="bg-white p-6 rounded-xl border-t-4 border-[#D4A373] shadow-sm flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase">Total Expenses</p>
            <h2 className="text-3xl font-bold text-slate-800">₹{totalExpense.toLocaleString()}</h2>
          </div>
          <TrendingDown className="text-red-400 w-10 h-10" />
        </div>
      </div>

      {/* Main Tables Container */}
      <div className="max-w-6xl mx-auto space-y-8">
        <FinanceTable title="Income Breakdown" data={entries} type="income" />
        <FinanceTable title="Expense Breakdown" data={entries} type="expense" />
      </div>
    </div>
  );
}

export default App;