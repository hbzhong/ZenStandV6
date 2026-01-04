
import React, { useState, useEffect } from 'react';
import { Timer as TimerIcon, History as HistoryIcon, BarChart2, Info, Quote } from 'lucide-react';
import Timer from './components/Timer';
import History from './components/History';
import Stats from './components/Stats';
import Guidance from './components/Guidance';
import { AppTab, Session } from './types';
import { COLORS } from './constants';
import { getStanceAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.TIMER);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [dailyAdvice, setDailyAdvice] = useState<string>("气沉丹田，虚灵顶劲。");
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem('zenstance_sessions');
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load sessions", e);
      }
    }
    
    // Fetch daily AI advice
    fetchAdvice();
  }, []);

  const fetchAdvice = async () => {
    setIsLoadingAdvice(true);
    const advice = await getStanceAdvice(sessions);
    setDailyAdvice(advice);
    setIsLoadingAdvice(false);
  };

  const saveSession = (duration: number) => {
    const newSession: Session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration,
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    localStorage.setItem('zenstance_sessions', JSON.stringify(updated));
    setActiveTab(AppTab.HISTORY);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.TIMER:
        return <Timer onComplete={saveSession} />;
      case AppTab.HISTORY:
        return <History sessions={sessions} />;
      case AppTab.STATS:
        return <Stats sessions={sessions} />;
      case AppTab.GUIDANCE:
        return <Guidance />;
      default:
        return <Timer onComplete={saveSession} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col shadow-2xl relative">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <span className="w-2 h-8 bg-emerald-600 rounded-full mr-3" />
            ZenStance
          </h1>
          <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
            Lv. {Math.floor(sessions.length / 5) + 1} 修行者
          </div>
        </div>
        
        {/* Daily Insight Box */}
        <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-200 relative overflow-hidden group">
          <Quote className="absolute -right-2 -bottom-2 text-slate-200 w-16 h-16 transform -rotate-12" />
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Master's Insight</span>
              {isLoadingAdvice && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-serif italic">
              "{dailyAdvice}"
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 bg-white/50">
        {renderContent()}
      </main>

      {/* Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-lg border-t border-slate-100 flex justify-around items-center py-3 px-2 z-50">
        <button 
          onClick={() => setActiveTab(AppTab.TIMER)}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === AppTab.TIMER ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <TimerIcon size={24} fill={activeTab === AppTab.TIMER ? 'currentColor' : 'none'} className={activeTab === AppTab.TIMER ? 'opacity-20 absolute' : ''} />
          <TimerIcon size={24} />
          <span className="text-[10px] font-medium mt-1">练功</span>
        </button>
        
        <button 
          onClick={() => setActiveTab(AppTab.HISTORY)}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === AppTab.HISTORY ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <HistoryIcon size={24} />
          <span className="text-[10px] font-medium mt-1">足迹</span>
        </button>

        <button 
          onClick={() => setActiveTab(AppTab.STATS)}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === AppTab.STATS ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <BarChart2 size={24} />
          <span className="text-[10px] font-medium mt-1">精进</span>
        </button>

        <button 
          onClick={() => setActiveTab(AppTab.GUIDANCE)}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === AppTab.GUIDANCE ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Info size={24} />
          <span className="text-[10px] font-medium mt-1">指引</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
