import React, { useState, useEffect } from 'react';
import { getEntries, addEntry } from './services/api';
import FinanceTable from './components/FinanceTable';
import axios from 'axios';
import { LayoutDashboard, Plus, X, TrendingUp, TrendingDown, ShieldCheck, Wallet } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [entries, setEntries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ category: '', type: 'expense', actual: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'vibe2026') setIsLoggedIn(true);
  };

  useEffect(() => { if (isLoggedIn) loadData(); }, [isLoggedIn]);

  const loadData = async () => {
    try {
      const res = await getEntries();
      setEntries(res.data || []);
    } catch (err) { console.error(err); }
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.ID);
    setFormData({ category: item.category, type: item.type, actual: item.actual });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, actual: Number(formData.actual), goal: 0 };
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/entries/${editingId}`, payload);
      } else {
        await addEntry(payload);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ category: '', type: 'expense', actual: '' });
      loadData();
    } catch (err) { console.error(err); }
  };

  const income = entries.filter(e => e.type === 'income').reduce((s, e) => s + (e.actual || 0), 0);
  const expense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + (e.actual || 0), 0);
  const netSavings = income - expense;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,#1e293b,transparent)] flex items-center justify-center p-6">
        <div className="w-full max-w-md relative">
          {/* Decorative glow behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-700 to-slate-800 rounded-[3rem] blur opacity-25"></div>
          
          <div className="relative bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100">
            <div className="bg-[#0f172a] w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 group hover:rotate-0 transition-transform duration-500">
              <ShieldCheck className="text-white w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2 italic">Finance<span className="text-slate-400">.io</span></h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Terminal Authentication</p>
            
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="group">
                <input required type="text" onChange={e => setLoginForm({...loginForm, username: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-2xl font-bold outline-none focus:border-[#0f172a] transition-all text-slate-900" placeholder="Operator ID" />
              </div>
              <div className="group">
                <input required type="password" onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-2xl font-bold outline-none focus:border-[#0f172a] transition-all text-slate-900" placeholder="Access Key" />
              </div>
              <button className="w-full bg-[#0f172a] text-white p-5 rounded-2xl font-black uppercase tracking-widest mt-6 shadow-[0_10px_30px_rgba(15,23,42,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                Initialize System
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      <nav className="bg-[#0f172a] text-white px-10 py-6 sticky top-0 z-50 flex justify-between items-center shadow-2xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">Finance.io</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Connection</span>
             <div className="flex items-center gap-2 text-green-400 text-[10px] font-black uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Encrypted
             </div>
          </div>
          <button onClick={() => { setEditingId(null); setFormData({category:'', type:'expense', actual:''}); setIsModalOpen(true); }} 
            className="bg-white text-[#0f172a] px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-tighter hover:bg-slate-100 transition-all shadow-xl flex items-center gap-2">
            <Plus size={20} /> New Transaction
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-10 mt-12">
        {/* --- STAT CARDS: NET SAVINGS ON THE LEFT --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#0f172a] p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(15,23,42,0.15)] border border-white/5 flex flex-col justify-center relative overflow-hidden group">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Total Net Savings</p>
            <h2 className="text-6xl font-black text-white tracking-tighter italic">₹{netSavings.toLocaleString()}</h2>
            <div className="absolute right-10 top-10 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.5)]" />
            <Wallet className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50 flex flex-col justify-center relative overflow-hidden group">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Gross Revenue</p>
            <h2 className="text-5xl font-black text-[#0f172a] tracking-tighter">₹{income.toLocaleString()}</h2>
            <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-green-500/5 -rotate-12" />
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50 flex flex-col justify-center relative overflow-hidden group">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Outflow</p>
            <h2 className="text-5xl font-black text-[#0f172a] tracking-tighter">₹{expense.toLocaleString()}</h2>
            <TrendingDown className="absolute -right-4 -bottom-4 w-24 h-24 text-red-500/5 -rotate-12" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <FinanceTable title="Revenue Log" data={entries} type="income" color="text-green-500" onEdit={handleOpenEdit} />
          <FinanceTable title="Expense Ledger" data={entries} type="expense" color="text-red-500" onEdit={handleOpenEdit} />
        </div>
      </main>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">{editingId ? 'Modify Entry' : 'New Entry'}</h2>
                <button type="button" onClick={() => setIsModalOpen(false)}><X className="text-slate-300 hover:text-slate-900 transition-colors" /></button>
             </div>
             <div className="space-y-6">
                <input required value={formData.category} placeholder="Description" onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-2xl font-bold outline-none focus:border-[#0f172a] text-slate-900" />
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-2xl font-bold outline-none text-slate-900">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <input required type="number" value={formData.actual} placeholder="Amount ₹" onChange={e => setFormData({...formData, actual: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-2xl font-bold outline-none focus:border-[#0f172a] text-slate-900" />
             </div>
             <button type="submit" className="w-full bg-[#0f172a] text-white p-6 rounded-2xl font-black uppercase tracking-widest mt-10 hover:shadow-2xl transition-all">
               {editingId ? 'Update Record' : 'Confirm & Post'}
             </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;