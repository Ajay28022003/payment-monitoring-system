import { useState } from 'react';
import { CalendarClock, MessageSquare, Clock, User, History, Send, CalendarDays, ChevronDown } from 'lucide-react';
import { mockFollowUps } from '../mockData/followups';

export default function FollowUps({ userName, userRole }) {
  // Initialize data with default history if missing
  const [tasksData, setTasksData] = useState(() => {
      return mockFollowUps.map(task => ({
          ...task,
          history: task.history || [
              { date: '2026-04-01', remark: 'Initial invoice sent to client.', author: 'System' },
              { date: '2026-04-04', remark: 'Client requested an extension.', author: task.employee },
              { date: '2026-04-06', remark: task.lastRemark, author: task.employee }
          ]
      }));
  });
  
  const [logInputs, setLogInputs] = useState({});
  const [expandedCards, setExpandedCards] = useState([]);

  const toggleHistory = (id) => {
    setExpandedCards(prev => prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]);
  };

  const handleInputChange = (taskId, field, value) => {
      setLogInputs(prev => ({ ...prev, [taskId]: { ...prev[taskId], [field]: value } }));
  };

  const handleLogUpdate = (taskId) => {
      const inputs = logInputs[taskId];
      
      if (!inputs || !inputs.remark?.trim()) {
          alert("Please enter a remark to log this update.");
          return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      const newHistoryEntry = {
          date: today,
          remark: inputs.remark,
          author: userName || (userRole === 'admin' ? 'System Admin' : 'Employee') 
      };

      setTasksData(prevTasks => prevTasks.map(task => {
          if (task.id === taskId) {
              let newStatus = task.status;
              
              if (inputs.nextDate) {
                  if (inputs.nextDate < today) {
                      newStatus = 'overdue';
                  } else if (inputs.nextDate === today) {
                      newStatus = 'today';
                  } else {
                      newStatus = 'upcoming';
                  }
              }

              return {
                  ...task,
                  lastRemark: inputs.remark,
                  nextDate: inputs.nextDate || task.nextDate,
                  status: newStatus,
                  history: [...task.history, newHistoryEntry]
              };
          }
          return task;
      }));

      setLogInputs(prev => ({ ...prev, [taskId]: { nextDate: '', remark: '' } }));

      if (!expandedCards.includes(taskId)) {
          setExpandedCards(prev => [...prev, taskId]);
      }
  };

  const StatusBadge = ({ status }) => {
    const config = {
      today: { bg: "bg-amber-50", text: "text-amber-700", label: "Due Today" },
      overdue: { bg: "bg-rose-50", text: "text-rose-700", label: "Overdue" },
      upcoming: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Upcoming" }
    };
    const style = config[status] || config.overdue;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Follow-up Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Log updates and view chronological communication histories.</p>
        </div>
        <div className="text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            Total Pending: <span className="text-gray-900 font-bold ml-1">{tasksData.length} Tasks</span>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasksData.map((task) => {
          const isExpanded = expandedCards.includes(task.id);
          const historyList = task.history;
          const currentInputs = logInputs[task.id] || { nextDate: '', remark: '' };

          return (
            <div key={task.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              
              {/* Top Info Section */}
              <div className="p-5 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{task.invoiceNo}</span>
                    <StatusBadge status={task.status} />
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <CalendarClock size={14} />
                      Next: {task.nextDate}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{task.customer}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <User size={14} /> Assigned to {task.employee}
                    </div>
                  </div>
                </div>

                <div className="md:text-right">
                  <p className="text-xs font-medium text-gray-500 mb-1">Balance</p>
                  <p className="text-xl font-bold text-gray-900">{task.dueAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* History Section */}
              <div className="px-5 pb-5 border-b border-gray-100">
                  {!isExpanded && (
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <MessageSquare size={16} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-gray-600">Latest Update</p>
                            <p className="text-sm text-gray-800 mt-0.5">{task.lastRemark}</p>
                        </div>
                    </div>
                  )}

                  {isExpanded && (
                      <div className="pl-4 space-y-4 border-l-2 border-gray-200 ml-2 mt-2">
                          {historyList.map((hist, idx) => (
                              <div key={idx} className="relative pl-4">
                                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white" />
                                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                      <div className="flex items-center justify-between mb-1">
                                          <p className="text-xs font-medium text-gray-500">{hist.date}</p>
                                          <p className="text-xs font-medium text-indigo-600">{hist.author}</p>
                                      </div>
                                      <p className="text-sm text-gray-800">{hist.remark}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}

                  <button 
                    onClick={() => toggleHistory(task.id)}
                    className="mt-4 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                      <History size={14} />
                      {isExpanded ? 'Hide History' : `View Full History (${historyList.length})`}
                  </button>
              </div>

              {/* Input Section */}
              <div className="bg-gray-50 p-4 flex flex-col md:flex-row items-center gap-3">
                  <div className="relative w-full md:w-48">
                      <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="date" 
                        value={currentInputs.nextDate}
                        onChange={(e) => handleInputChange(task.id, 'nextDate', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                  </div>
                  
                  <div className="relative w-full flex-1">
                      <input 
                        type="text" 
                        placeholder="Log a new follow-up remark..."
                        value={currentInputs.remark}
                        onChange={(e) => handleInputChange(task.id, 'remark', e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleLogUpdate(task.id); }}
                        className="w-full pl-4 pr-12 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button 
                        onClick={() => handleLogUpdate(task.id)}
                        className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
                      >
                          <Send size={14} />
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