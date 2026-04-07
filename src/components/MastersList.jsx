import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Database, ChevronLeft, ArrowUpRight, Hash } from 'lucide-react';

export default function MastersList({ 
  title, 
  data, 
  columns, 
  onAdd, 
  onEdit, 
  onDelete 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // --- Dynamic Search Logic ---
  const filteredData = data.filter((item) => {
    return Object.values(item).some((val) => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto animate-in slide-in-from-bottom-6 fade-in duration-1000">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-gray-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Database size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Core Registry</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="text-sm text-gray-500 font-medium">
            Manage and audit {title.toLowerCase()} within the PayTrack ecosystem.
          </p>
        </div>
        
        <button 
          onClick={onAdd}
          className="group flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-xl shadow-gray-900/10 hover:bg-indigo-600 hover:shadow-indigo-500/20 transition-all duration-300 active:scale-95"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Create New
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full lg:w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}...`}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all shadow-sm"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200/60 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {columns.map((col) => (
                  <th key={col} className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{col}</th>
                ))}
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {filteredData.length === 0 ? (
                 <tr>
                    <td colSpan={columns.length + 1} className="px-8 py-10 text-center text-gray-500 font-medium italic">
                        No {title.toLowerCase()} records found.
                    </td>
                 </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={item.id || idx} className="group hover:bg-indigo-50/30 transition-all duration-300">
                    
                    {/* --- DYNAMIC COLUMN RENDERING (ID EXCLUDED) --- */}
                    {Object.entries(item)
                      .filter(([key]) => key !== 'id') // This is the secret sauce!
                      .map(([key, val], i) => {
                        
                        // Style for Column 1
                        if (i === 0) {
                          const strVal = String(val);
                          // Hyphen logic for Code-style entries (e.g. DEP-FIN)
                          if (strVal.includes('-') && strVal.length < 15) {
                            return (
                              <td key={i} className="px-8 py-5 relative">
                                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-indigo-600 opacity-0 group-hover:opacity-100 transition-all rounded-r-full" />
                                <div className="flex items-center gap-2">
                                  <Hash size={12} className="text-gray-300" />
                                  <span className="font-mono text-[11px] font-bold text-gray-500 bg-gray-100/80 px-2 py-1 rounded-lg border border-gray-200/60">
                                      {val}
                                  </span>
                                </div>
                              </td>
                            );
                          }
                          
                          // Style for Name-style entries with Avatar Box
                          return (
                            <td key={i} className="px-8 py-5 relative">
                              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-indigo-600 opacity-0 group-hover:opacity-100 transition-all rounded-r-full" />
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-indigo-600 transition-colors border border-transparent group-hover:border-indigo-100 text-[14px] font-bold shadow-sm">
                                  {strVal.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-[14px] font-bold text-gray-900 tracking-tight">
                                  {val}
                                </div>
                              </div>
                            </td>
                          );
                        }

                        // Standard Data Columns
                        return (
                          <td key={i} className="px-8 py-5 text-[13px] text-gray-600 font-medium">
                            {val}
                          </td>
                        );
                      })}

                    {/* Actions Column */}
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <button onClick={() => onEdit && onEdit(item)} className="p-2 bg-white text-gray-400 hover:text-indigo-600 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => onDelete && onDelete(item)} className="p-2 bg-white text-gray-400 hover:text-rose-600 rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Registry Status: <span className="text-gray-900">{filteredData.length} active entries</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 cursor-not-allowed" disabled>
                <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 text-[11px] font-bold text-white bg-gray-900 rounded-md">1</button>
            <button className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-sm">
                <ArrowUpRight size={16} className="rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}