// import { useState } from 'react';
// import { Search, Plus, Edit2, Trash2, Users, Building2, Hash, Mail, Phone, ChevronRight } from 'lucide-react';
// import { mockCustomers, mockPartners } from '../mockData/masters';
// import MasterModal from '../components/MasterModal';

// export default function Masters() {
//   const [activeTab, setActiveTab] = useState('customers'); // 'customers' or 'partners'
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const tabs = [
//     { id: 'customers', label: 'Customers', icon: Users, count: mockCustomers.length },
//     { id: 'partners', label: 'Partners', icon: Building2, count: mockPartners.length },
//   ];

//   return (
//     <div className="space-y-8 max-w-[1600px] mx-auto animate-in slide-in-from-bottom-6 fade-in duration-1000">
      
//       {/* --- Page Header & Primary Action --- */}
//       <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-gray-200/60">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2 text-indigo-600 mb-1">
//             <DatabaseIcon size={16} />
//             <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Core Registry</span>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Master Data</h1>
//           <p className="text-sm text-gray-500 font-medium">Manage and audit the fundamental entities within the PayTrack ecosystem.</p>
//         </div>
        
//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="group flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-xl shadow-gray-900/10 hover:bg-indigo-600 hover:shadow-indigo-500/20 transition-all duration-300"
//         >
//           <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
//           Create New {activeTab === 'customers' ? 'Customer' : 'Partner'}
//         </button>
//       </div>

//       {/* --- Modern Segmented Control & Search --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        
//         {/* Segmented Tab Control */}
//         <div className="flex p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/50 w-full lg:w-auto">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             const isActive = activeTab === tab.id;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2.5 px-6 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 ${
//                   isActive 
//                     ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' 
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 <Icon size={16} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
//                 {tab.label}
//                 <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-200/50 text-gray-400'}`}>
//                   {tab.count}
//                 </span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Command Palette Style Search */}
//         <div className="relative w-full lg:w-96 group">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
//           <input
//             type="text"
//             placeholder={`Search ${activeTab}...`}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all shadow-sm"
//           />
//         </div>
//       </div>

//       {/* --- High-Contrast Data Workspace --- */}
//       <div className="bg-white border border-gray-200/60 rounded-[2rem] shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse whitespace-nowrap">
//             <thead>
//               <tr className="bg-gray-50/50 border-b border-gray-100">
//                 <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] w-24">Entry ID</th>
//                 <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Primary Identity</th>
//                 <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
//                   {activeTab === 'customers' ? 'Association' : 'Direct Contact'}
//                 </th>
//                 <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Network Link</th>
//                 <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100/80">
//               {(activeTab === 'customers' ? mockCustomers : mockPartners).map((row) => (
//                 <tr key={row.id} className="group hover:bg-indigo-50/30 transition-all duration-300 relative">
//                   {/* Linear Style Left indicator */}
//                   <td className="absolute left-0 top-0 bottom-0 w-[4px] bg-indigo-600 opacity-0 group-hover:opacity-100 transition-all rounded-r-full" />

//                   <td className="px-8 py-5">
//                     <div className="flex items-center gap-2">
//                         <Hash size={12} className="text-gray-300" />
//                         <span className="font-mono text-[11px] font-bold text-gray-500 bg-gray-100/80 px-2 py-1 rounded-lg border border-gray-200/60">
//                             {row.id}
//                         </span>
//                     </div>
//                   </td>

//                   <td className="px-8 py-5">
//                     <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-indigo-600 transition-colors border border-transparent group-hover:border-indigo-100">
//                             {activeTab === 'customers' ? <Users size={18} /> : <Building2 size={18} />}
//                         </div>
//                         <div className="text-[14px] font-bold text-gray-900 tracking-tight">
//                             {activeTab === 'customers' ? row.clientName : row.companyName}
//                         </div>
//                     </div>
//                   </td>

//                   <td className="px-8 py-5">
//                     <div className="flex items-center gap-2 text-[13px] text-gray-600 font-medium">
//                         {activeTab === 'customers' ? (
//                             <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[11px] font-bold border border-indigo-100">
//                                 {row.distributor}
//                             </span>
//                         ) : (
//                             <div className="flex items-center gap-2">
//                                 <Phone size={14} className="text-gray-300" />
//                                 <span>{row.phone}</span>
//                             </div>
//                         )}
//                     </div>
//                   </td>

//                   <td className="px-8 py-5">
//                     <div className="flex items-center gap-2 text-[13px] text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
//                         <Mail size={14} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
//                         {row.email}
//                     </div>
//                   </td>

//                   <td className="px-8 py-5">
//                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
//                       <button className="p-2 bg-white text-gray-400 hover:text-indigo-600 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200">
//                         <Edit2 size={15} />
//                       </button>
//                       <button className="p-2 bg-white text-gray-400 hover:text-rose-600 rounded-xl shadow-sm border border-gray-100 hover:border-rose-200">
//                         <Trash2 size={15} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* --- Minimalist Workspace Footer --- */}
//         <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
//           <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
//             Total Entry Count: <span className="text-gray-900">{(activeTab === 'customers' ? mockCustomers : mockPartners).length}</span>
//           </p>
//           <div className="flex items-center gap-1.5">
//             <button className="px-3 py-1.5 text-[11px] font-bold text-gray-400 bg-white border border-gray-200 rounded-lg cursor-not-allowed uppercase tracking-tighter" disabled>Prev</button>
//             <button className="px-3 py-1.5 text-[11px] font-bold text-white bg-gray-900 rounded-lg uppercase tracking-tighter">1</button>
//             <button className="px-3 py-1.5 text-[11px] font-bold text-gray-400 bg-white border border-gray-200 rounded-lg cursor-not-allowed uppercase tracking-tighter" disabled>Next</button>
//           </div>
//         </div>
//       </div>

//       <MasterModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         type={activeTab} 
//       />
//     </div>
//   );
// }

// // --- Internal Helper Icon ---
// const DatabaseIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>;