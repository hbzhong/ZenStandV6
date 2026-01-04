
import React, { useState, useRef } from 'react';
import { Sparkles, Camera, BookOpen, ChevronRight, X } from 'lucide-react';
import { analyzePosture } from '../services/geminiService';
import { ZHAN_ZHUANG_TIPS } from '../constants';

const Guidance: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      alert('无法访问摄像头，请确保已授予权限。');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      
      const result = await analyzePosture(imageData);
      setAnalysisResult(result);
    }
    setIsAnalyzing(false);
    stopCamera();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Posture Analysis Tool */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 shadow-sm border border-blue-100">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <Sparkles size={20} />
          </div>
          <h3 className="font-semibold text-slate-800">AI 姿势纠正</h3>
        </div>
        
        {!stream && !analysisResult && (
          <p className="text-sm text-slate-600 mb-6">
            上传或拍摄一张你正在练习桩功的照片，AI 将为你提供反馈建议。
          </p>
        )}

        {stream ? (
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-4">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button 
                onClick={stopCamera}
                className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30"
              >
                <X size={20} />
              </button>
              <button 
                onClick={captureAndAnalyze}
                disabled={isAnalyzing}
                className="bg-white p-3 rounded-full text-indigo-600 hover:bg-indigo-50 shadow-lg"
              >
                <Camera size={24} />
              </button>
            </div>
          </div>
        ) : analysisResult ? (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-inner italic text-slate-700 leading-relaxed">
              {analysisResult}
            </div>
            <button 
              onClick={() => {setAnalysisResult(null); startCamera();}}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              再次分析
            </button>
          </div>
        ) : (
          <button 
            onClick={startCamera}
            className="w-full py-4 flex items-center justify-center space-x-2 rounded-xl bg-white border-2 border-dashed border-indigo-200 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
          >
            <Camera size={20} />
            <span className="font-medium">启动摄像头分析</span>
          </button>
        )}
      </div>

      {/* Learning Resources */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-800 px-2 flex items-center space-x-2">
          <BookOpen size={18} className="text-emerald-600" />
          <span>桩功精要</span>
        </h3>
        <div className="space-y-3">
          {ZHAN_ZHUANG_TIPS.map((tip, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start space-x-3">
              <span className="bg-slate-50 text-slate-400 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm text-slate-600">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Guidance;
