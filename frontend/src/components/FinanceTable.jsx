import React from 'react';

const FinanceTable = ({ title, data, type }) => {
  const filteredData = data.filter(item => item.type === type);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-[#F8D7CC] p-3 font-bold text-slate-800 uppercase tracking-wider">
        {title}
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-slate-500 text-sm border-b">
            <th className="p-4 font-medium">Category</th>
            <th className="p-4 font-medium">Goal</th>
            <th className="p-4 font-medium">Actual</th>
            <th className="p-4 font-medium">Difference</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => {
            const diff = item.actual - item.goal;
            return (
              <tr key={item.ID} className="border-b last:border-0 hover:bg-slate-50">
                <td className="p-4 text-slate-700">{item.category}</td>
                <td className="p-4 text-slate-600">₹{item.goal.toLocaleString()}</td>
                <td className="p-4 text-slate-600">₹{item.actual.toLocaleString()}</td>
                <td className={`p-4 font-semibold ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                   {diff > 0 ? `+₹${diff}` : `₹${diff}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FinanceTable;