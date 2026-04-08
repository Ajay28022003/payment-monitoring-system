import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Database } from 'lucide-react';

export default function MastersList({ 
  title, 
  data, 
  columns, 
  onAdd, 
  onEdit, 
  onDelete 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic
  const filteredData = data.filter((item) => {
    return Object.values(item).some((val) => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    // Changed to max-w-7xl to match Dashboard and Orders perfectly
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 hidden sm:block">
            <Database size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              Manage and audit {title.toLowerCase()} records in the system.
            </p>
          </div>
        </div>
        
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
        >
          <Plus size={16} strokeWidth={3} />
          Add New {title}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* High-Visibility Table */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden z-10 relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-300 text-slate-600">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-6 py-4 font-bold uppercase tracking-wider text-xs">
                    {col}
                  </th>
                ))}
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.length === 0 ? (
                 <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500 font-medium">
                        No {title.toLowerCase()} records found matching your search.
                    </td>
                 </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* Render table cells dynamically, omitting the ID */}
                    {Object.entries(item)
                      .filter(([key]) => key !== 'id')
                      .map(([key, val], i) => (
                        <td key={i} className={`px-6 py-4 ${i === 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-600'}`}>
                          {val}
                        </td>
                      ))}

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                        {onEdit && (
                            <button 
                              onClick={() => onEdit(item)} 
                              className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                              title="Edit Record"
                            >
                              <Edit2 size={18} />
                            </button>
                        )}
                        {onDelete && (
                            <button 
                              onClick={() => onDelete(item)} 
                              className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                              title="Delete Record"
                            >
                              <Trash2 size={18} />
                            </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <p className="text-sm font-semibold text-slate-500">
            Showing <span className="font-bold text-slate-900">{filteredData.length}</span> records
          </p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-slate-200 rounded bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                <ChevronLeft size={16} />
            </button>
            <button className="p-1.5 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-100 transition-colors">
                <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}