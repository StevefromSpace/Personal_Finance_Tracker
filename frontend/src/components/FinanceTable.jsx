import React from 'react';

const FinanceTable = ({ title, data, type, accent }) => {
  const filtered = data.filter(item => item.type === type);

  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.01)] border border-slate-100 overflow-hidden">
      <div className="flex justify-between items-center p-8 border-b border-slate-50">
        <h3 className="font-black text-slate-800 flex items-center gap-3 tracking-tight">
          <div className="w-2.5 h-8 rounded-full" style={{ backgroundColor: accent }}></div>
          {title.toUpperCase()}
        </h3>
        <span className="text-[10px] bg-slate-50 text-slate-400 px-3 py-1.5 rounded-full font-black uppercase border border-slate-100">
          {filtered.length} Active Rows
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-[11px] uppercase tracking-[0.2em] font-black border-b border-slate-50">
              <th className="px-10 py-6">Category Name</th>
              <th className="px-10 py-6">Target Budget</th>
              <th className="px-10 py-6">Actual Spend</th>
              <th className="px-10 py-6 text-right">Net Variance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((item) => {
              const diff = item.type === 'income' ? item.actual - item.goal : item.goal - item.actual;
              return (
                <tr key={item.ID} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-10 py-5 font-bold text-slate-700">{item.category}</td>
                  <td className="px-10 py-5 text-slate-400 font-medium">₹{item.goal.toLocaleString()}</td>
                  <td className="px-10 py-5 text-slate-400 font-medium">₹{item.actual.toLocaleString()}</td>
                  <td className={`px-10 py-5 text-right font-black ${diff >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                    {diff >= 0 ? '+' : ''}₹{Math.abs(diff).toLocaleString()}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="px-10 py-20 text-center text-slate-300 font-medium italic">No data points available yet. Click "Add Entry" to start.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceTable;