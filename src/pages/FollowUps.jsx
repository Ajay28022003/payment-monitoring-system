import { useState } from 'react';
import { 
    CalendarClock, ChevronRight, MessageSquare, Clock, 
    User, History, Send, CalendarDays, ChevronDown 
} from 'lucide-react';
import { mockFollowUps } from '../mockData/followups';

export default function FollowUps() {
  // 1. Core Data State: We initialize the mock data to GUARANTEE every task has a history array.
  const [tasksData, setTasksData] = useState(() => {
      return mockFollowUps.map(task => ({
          ...task,
          // Give every task a proper starting history if it doesn't have one
          history: task.history || [
              { date: '2026-04-01', remark: 'Initial invoice sent to client.', author: 'System' },
              { date: '2026-04-04', remark: 'Client requested an extension.', author: task.employee },
              { date: '2026-04-06', remark: task.lastRemark, author: task.employee }
          ]
      }));
  });
  
  // 2. Input Tracking State (Tracks inputs for each card independently by ID)
  const [logInputs, setLogInputs] = useState({});
  
  // 3. UI State
  const [expandedCards, setExpandedCards] = useState([]);

  // --- Handlers ---
  const toggleHistory = (id) => {
    setExpandedCards(prev => 
        prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };

  const handleInputChange = (taskId, field, value) => {
      setLogInputs(prev => ({
          ...prev,
          [taskId]: {
              ...prev[taskId],
              [field]: value
          }
      }));
  };

  const handleLogUpdate = (taskId) => {
      const inputs = logInputs[taskId];
      
      // Validation: Ensure there is at least a remark
      if (!inputs || !inputs.remark?.trim()) {
          alert("Please enter a remark to log this update.");
          return;
      }

      const today = new Date().toISOString().split('T')[0];

      // Build the new history entry
      const newHistoryEntry = {
          date: today,
          remark: inputs.remark,
          author: 'Molina' // Simulating the logged-in user
      };

      // Update the main tasks data
      setTasksData(prevTasks => prevTasks.map(task => {
          if (task.id === taskId) {
              // Basic status logic: If they set a future date, mark as upcoming
              let newStatus = task.status;
              if (inputs.nextDate) {
                  const selectedDate = new Date(inputs.nextDate);
                  const currentDate = new Date();
                  newStatus = selectedDate > currentDate ? 'upcoming' : 'today';
              }

              return {
                  ...task,
                  lastRemark: inputs.remark, // Updates the quick summary box
                  nextDate: inputs.nextDate || task.nextDate,
                  status: newStatus,
                  history: [...task.history, newHistoryEntry] // Safely appends to the permanent timeline
              };
          }
          return task;
      }));

      // Clear the inputs for this specific card
      setLogInputs(prev => ({
          ...prev,
          [taskId]: { nextDate: '', remark: '' }
      }));

      // Auto-expand the history so the user instantly sees their new log added to the timeline
      if (!expandedCards.includes(taskId)) {
          setExpandedCards(prev => [...prev, taskId]);
      }
  };

  // --- Premium LED Status Badge ---
  const StatusBadge = ({ status }) => {
    const config = {
      today: { bg: "bg-amber-400/10", text: "text-amber-600", border: "border-amber-500/20", dot: "bg-amber-500", label: "DUE TODAY" },
      overdue: { bg: "bg-rose-400/10", text: "text-rose-600", border: "border-rose-500/20", dot: "bg-rose-500", label: "OVERDUE" },
      upcoming: { bg: "bg-emerald-400/10", text: "text-emerald-600", border: "border-emerald-500/20", dot: "bg-emerald-500", label: "UPCOMING" }
    };
    const style = config[status] || config.overdue;

    return (
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shadow-[0_0_8px_currentColor] ${status === 'overdue' ? 'animate-pulse' : ''}`} />
        <span className="text-[10px] font-bold tracking-[0.1em]">{style.label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in slide-in-from-bottom-6 fade-in duration-1000">
      
      {/* --- Page Header --- */}
      <div className="pb-6 border-b border-gray-200/60 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Clock size={16} />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Live Queue</span>
            </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Follow-up Tracker</h1>
          <p className="text-sm text-gray-500">Log updates and view chronological communication histories.</p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-2xl shadow-sm text-xs font-bold text-gray-500 uppercase tracking-widest">
            Total Pending: <span className="text-gray-900 ml-1">{tasksData.length} Tasks</span>
        </div>
      </div>

      {/* --- Task List --- */}
      <div className="space-y-4">
        {tasksData.map((task) => {
          const isExpanded = expandedCards.includes(task.id);
          const historyList = task.history; // Directly use the guaranteed history array
          const currentInputs = logInputs[task.id] || { nextDate: '', remark: '' };

          return (
            <div 
              key={task.id} 
              className="bg-white border border-gray-200/60 rounded-[2rem] shadow-sm overflow-hidden group hover:shadow-md hover:border-indigo-100 transition-all duration-300 relative"
            >
              {/* Linear Style Left Indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-indigo-600 opacity-0 group-hover:opacity-100 transition-all" />

              {/* Top Section: Core Info & Outstanding */}
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                  
                  {/* Tags & Dates */}
                  <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <span className="font-mono text-[13px] font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100">
                        {task.invoiceNo}
                    </span>
                    <StatusBadge status={task.status} />
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-400 font-bold uppercase tracking-tighter">
                      <CalendarClock size={14} className="text-gray-300" />
                      Next: <span className="text-gray-600">{task.nextDate}</span>
                    </div>
                  </div>
                  
                  {/* Client Info */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-950 transition-colors tracking-tight">
                        {task.customer}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 font-medium italic">
                        <User size={12} /> Assigned to {task.employee}
                    </div>
                  </div>
                </div>

                {/* Outstanding Amount */}
                <div className="md:text-right flex-shrink-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Outstanding</p>
                  <p className="text-3xl font-bold text-rose-600 tabular-nums tracking-tighter">{task.dueAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Middle Section: History Timeline */}
              <div className="px-6 md:px-8 pb-6 border-b border-gray-100/80">
                  {/* Latest Remark Summary (Always Visible) */}
                  {!isExpanded && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm text-gray-400">
                            <MessageSquare size={14} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Latest Update</p>
                            <p className="text-[13px] font-medium text-gray-700">"{task.lastRemark}"</p>
                        </div>
                    </div>
                  )}

                  {/* Expanded Chronological History */}
                  {isExpanded && (
                      <div className="pl-4 md:pl-6 space-y-5 relative before:absolute before:left-[23px] md:before:left-[31px] before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-100 animate-in fade-in duration-300">
                          {historyList.map((hist, idx) => (
                              <div key={idx} className="relative pl-8">
                                  {/* Timeline Node */}
                                  <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${idx === historyList.length - 1 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group/hist hover:border-indigo-100 transition-colors">
                                      <div className="flex items-center justify-between mb-1">
                                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{hist.date}</p>
                                          <p className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded">{hist.author}</p>
                                      </div>
                                      <p className="text-[13px] font-medium text-gray-700">{hist.remark}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}

                  {/* Toggle History Button */}
                  <button 
                    onClick={() => toggleHistory(task.id)}
                    className="mt-4 flex items-center gap-1.5 text-[12px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors mx-auto"
                  >
                      <History size={14} />
                      {isExpanded ? 'Hide History' : `View Full History (${historyList.length})`}
                      <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
              </div>

              {/* Bottom Section: Inline Quick-Log Input */}
              <div className="bg-gray-50/50 p-4 md:p-6 flex flex-col md:flex-row items-center gap-3">
                  {/* Next Date Input */}
                  <div className="relative w-full md:w-44 shrink-0">
                      <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="date" 
                        title="Set Next Follow-up Date"
                        value={currentInputs.nextDate}
                        onChange={(e) => handleInputChange(task.id, 'nextDate', e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                      />
                  </div>
                  
                  {/* Remark Input & Submit */}
                  <div className="relative w-full flex-1">
                      <input 
                        type="text" 
                        placeholder="Log a new follow-up remark..."
                        value={currentInputs.remark}
                        onChange={(e) => handleInputChange(task.id, 'remark', e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleLogUpdate(task.id); }}
                        className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                      />
                      <button 
                        onClick={() => handleLogUpdate(task.id)}
                        title="Log Update"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm active:scale-95"
                      >
                          <Send size={14} className="-ml-0.5 mt-0.5" />
                      </button>
                  </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}