import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const DisclaimerFooter = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950 py-8 px-4 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-start gap-3 max-w-3xl text-left">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-300">Medical Regulatory Disclaimer:</strong> MediHelp is an artificial intelligence-assisted medical intelligence platform built solely for educational and preliminary health triaging purposes. It is <strong className="text-slate-200">not a substitute for professional clinical diagnosis</strong>, emergency medical treatment, or physician consultation. If you are experiencing a life-threatening medical emergency, call 112, 108, or 911 immediately.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 shrink-0">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>© {new Date().getFullYear()} MediHelp Systems Inc.</span>
        </div>

      </div>
    </footer>
  );
};
