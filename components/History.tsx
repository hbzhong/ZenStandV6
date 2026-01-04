
import React from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Session } from '../types';

interface HistoryProps {
  sessions: Session[];
}

const History: React.FC<HistoryProps> = ({ sessions }) => {
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <Calendar size={48} className="mb-4 opacity-20" />
        <p>尚无打卡记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 px-2">历史记录</h2>
      {sortedSessions.map((session) => (
        <div 
          key={session.id} 
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
              <Clock size={20} />
            </div>
            <div>
              <div className="font-medium text-slate-800">
                {Math.round(session.duration / 60)} 分钟站桩
              </div>
              <div className="text-xs text-slate-500">
                {new Date(session.date).toLocaleDateString('zh-CN', {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
          <ChevronRight className="text-slate-300" size={20} />
        </div>
      ))}
    </div>
  );
};

export default History;
