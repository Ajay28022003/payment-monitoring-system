import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, trend, type, accentColor = "bg-[#4F46E5]" }) {
  let TrendIcon = Minus;
  let trendClass = "text-gray-500 bg-gray-100";
  
  if (type === 'good') {
    TrendIcon = TrendingUp;
    trendClass = "text-emerald-700 bg-emerald-50";
  } else if (type === 'bad') {
    TrendIcon = TrendingDown;
    trendClass = "text-red-700 bg-red-50";
  }

  return (
    <div className="relative overflow-hidden bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow group">
      <div className={`absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity ${accentColor}`} />
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${trendClass}`}>
          <TrendIcon size={12} />
          {trend}
        </span>
      </div>
      
      <div className="flex items-baseline">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}