import { Database } from 'lucide-react';

export default function Login({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <Database size={32} className="text-indigo-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">PayTrack Login</h1>
        <p className="text-sm text-center text-gray-500 mb-8">Select your role to continue</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => onLogin('admin')}
            className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Login as Admin
          </button>
          <button 
            onClick={() => onLogin('employee')}
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Login as Employee
          </button>
        </div>
      </div>
    </div>
  );
}