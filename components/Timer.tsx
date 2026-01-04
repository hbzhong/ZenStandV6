
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RefreshCcw } from 'lucide-react';
import { COLORS } from '../constants';

interface TimerProps {
  onComplete: (duration: number) => void;
}

const Timer: React.FC<TimerProps> = ({ onComplete }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const handleFinish = () => {
    if (seconds > 0) {
      onComplete(seconds);
      handleReset();
    }
  };

  const progress = (seconds % 60) / 60 * 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-6">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Progress Circle */}
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="transparent"
            stroke={COLORS.primary}
            strokeWidth="8"
            strokeDasharray={753.98}
            strokeDashoffset={753.98 - (753.98 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="text-5xl font-light text-slate-700 font-mono">
          {formatTime(seconds)}
        </div>
      </div>

      <div className="flex space-x-6">
        <button
          onClick={handleReset}
          className="p-4 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
        >
          <RefreshCcw size={24} />
        </button>
        <button
          onClick={handleStartStop}
          className={`p-6 rounded-full text-white transition-all shadow-lg transform active:scale-95 ${
            isActive ? 'bg-amber-500' : 'bg-emerald-600'
          }`}
        >
          {isActive ? <Square size={32} fill="white" /> : <Play size={32} fill="white" />}
        </button>
        <button
          onClick={handleFinish}
          disabled={seconds === 0}
          className={`p-4 rounded-full bg-slate-800 text-white hover:bg-black transition-colors ${
            seconds === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span className="px-2 font-medium">结束</span>
        </button>
      </div>
      
      <p className="text-slate-500 italic text-sm text-center max-w-xs">
        "万动不如一静，百练不如一站。"
      </p>
    </div>
  );
};

export default Timer;
