import React, { useState, useEffect } from 'react';
import { getEntries, addEntry } from './services/api';
import FinanceTable from './components/FinanceTable';
import { LayoutDashboard, Plus, X, TrendingUp, TrendingDown, Lock, User } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'vibe2026') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid Credentials. Try admin / vibe2026');
    }
  };

  const [entries, setEntries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ category: '', type: 'expense', goal: '', actual: '' });

  useEffect(() => { 
    if (isLoggedIn) loadData(); 
  }, [isLoggedIn]);

  const loadData = async () => {
    try {
      const res = await getEntries();
      setEntries(res.data || []);
    } catch (err) { console.error("API Error:", err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addEntry({
        ...formData,
        goal: parseFloat(formData.goal),
        actual: parseFloat(formData.actual)
      });
      setIsModalOpen(false);
      setFormData({ category: '', type: 'expense', goal: '', actual: '' });
      loadData();
    } catch (err) { console.error("Save Error:", err); }
  };

  const income = entries.filter(e => e.type === 'income').reduce((s, e) => s + (e.actual || 0), 0);
  const expense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + (e.actual || 0), 0);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 text-center">
          <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <LayoutDashboard className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Finance.io</h1>
          <p className="text-slate-400 text-sm mb-8 font-medium">Please sign in to access your dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1 px-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
                <input required type="text" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-3.5 pl-11 rounded-2xl outline-none focus:ring-2 ring-orange-100" placeholder="admin" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1 px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
                <input required type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-3.5 pl-11 rounded-2xl outline-none focus:ring-2 ring-orange-100" placeholder="••••••••" />
              </div>
            </div>
            {error && <p className="text-red-400 text-xs font-bold text-center mt-2">{error}</p>}
            <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold mt-4 hover:scale-[1.02] transition-all shadow-lg shadow-slate-200">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pb-20 font-sans">
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-8 py-4">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-xl">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">Finance.io</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsLoggedIn(false)} className="text-slate-400 text-xs font-bold uppercase hover:text-slate-600">Logout</button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-slate-200"
            >
              <Plus size={18} /> Add Entry
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="group relative overflow-hidden bg-white p-10 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Revenue Streams</p>
            <h2 className="text-5xl font-black text-slate-900">₹{income.toLocaleString()}</h2>
            <TrendingUp className="absolute -right-6 -bottom-6 w-32 h-32 text-green-500/5 -rotate-12" />
          </div>
          <div className="group relative overflow-hidden bg-white p-10 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Outflow</p>
            <h2 className="text-5xl font-black text-slate-900">₹{expense.toLocaleString()}</h2>
            <TrendingDown className="absolute -right-6 -bottom-6 w-32 h-32 text-red-500/5 -rotate-12" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          <FinanceTable title="Income Streams" data={entries} type="income" accent="#F8D7CC" />
          <FinanceTable title="Expense Tracking" data={entries} type="expense" accent="#D4A373" />
        </div>
      </main>

      {/* MODAL (Same as before) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <form onSubmit={handleAdd} className="relative bg-white w-full max-w-md p-8 rounded-[2rem] shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 uppercase">New Transaction</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <div className="space-y-4">
              <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none" placeholder="Category" />
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none" placeholder="Goal (₹)" />
                <input required type="number" value={formData.actual} onChange={e => setFormData({...formData, actual: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none" placeholder="Actual (₹)" />
              </div>
            </div>
            <button type="submit" className="w-full mt-8 bg-slate-900 text-white p-4 rounded-2xl font-bold shadow-lg">Save Transaction</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;