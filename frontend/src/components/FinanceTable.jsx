import React from 'react';
import { Edit3 } from 'lucide-react';

const FinanceTable = ({ title, data, type, color, onEdit }) => {
  const filtered = data.filter(item => item.type === type);

  return (
    <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-10 pb-6">
        <h3 className="font-black text-slate-900 uppercase tracking-tighter text-3xl italic">
          {title}
        </h3>
      </div>
      
      <div className="px-10">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-300 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-50">
              <th className="py-6 w-1/2">Transaction</th>
              <th className="py-6">Value</th>
              <th className="py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((item) => (
              <tr key={item.ID} className="group hover:bg-slate-50/50 transition-all">
                <td className="py-8 font-black text-slate-800 text-2xl tracking-tighter">
                  {item.category}
                </td>
                <td className={`py-8 font-black text-2xl tracking-tighter ${color}`}>
                  ₹{item.actual.toLocaleString()}
                </td>
                <td className="py-8 text-right">
                  <button 
                    onClick={() => onEdit(item)}
                    className="p-3 bg-slate-50 text-slate-300 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm"
                  >
                    <Edit3 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="3" className="py-20 text-center text-slate-200 font-bold italic uppercase tracking-widest text-xs">
                  Awaiting Data Streams...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceTable;