
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Session } from '../types';
import { COLORS } from '../constants';

interface StatsProps {
  sessions: Session[];
}

const Stats: React.FC<StatsProps> = ({ sessions }) => {
  // Aggregate data for the last 7 days
  const getChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const dataMap = new Map();
    last7Days.forEach(date => dataMap.set(date, 0));

    sessions.forEach(session => {
      const date = session.date.split('T')[0];
      if (dataMap.has(date)) {
        dataMap.set(date, dataMap.get(date) + Math.round(session.duration / 60));
      }
    });

    return last7Days.map(date => ({
      name: date.slice(5), // MM-DD
      minutes: dataMap.get(date)
    }));
  };

  const chartData = getChartData();
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration / 60, 0);
  const totalSessions = sessions.length;
  const avgMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-700">{Math.round(totalMinutes)}</div>
          <div className="text-xs text-emerald-600/70 mt-1">总分钟</div>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-700">{totalSessions}</div>
          <div className="text-xs text-amber-600/70 mt-1">总次数</div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{avgMinutes}</div>
          <div className="text-xs text-blue-600/70 mt-1">平均时长</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 h-64">
        <h3 className="text-sm font-medium text-slate-500 mb-4">近7日桩龄分布 (分钟)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? COLORS.primary : '#e2e8f0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Stats;
