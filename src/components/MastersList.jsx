import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Database, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="max-w-[1600px] mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage {title.toLowerCase()} records in the system.
          </p>
        </div>
        
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-6 py-4 font-semibold">{col}</th>
                ))}
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                 <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                        No {title.toLowerCase()} records found.
                    </td>
                 </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-gray-50">
                    
                    {/* Render table cells dynamically, omitting the ID */}
                    {Object.entries(item)
                      .filter(([key]) => key !== 'id')
                      .map(([key, val], i) => (
                        <td key={i} className="px-6 py-4 text-gray-900">
                          {val}
                        </td>
                      ))}

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        {onEdit && (
                            <button onClick={() => onEdit(item)} className="hover:text-indigo-600">
                              <Edit2 size={18} />
                            </button>
                        )}
                        {onDelete && (
                            <button onClick={() => onDelete(item)} className="hover:text-rose-600">
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{filteredData.length}</span> records
          </p>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200" disabled>
                <ChevronLeft size={18} />
            </button>
            <button className="p-1 rounded text-gray-600 hover:bg-gray-200">
                <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}