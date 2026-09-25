import React, { useState } from 'react';
import { Pill, ShieldAlert, AlertTriangle, CheckCircle, Search, ArrowRightLeft } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export const DrugChecker = () => {
  const [drugA, setDrugA] = useState('');
  const [drugB, setDrugB] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const presets = [
    { a: 'Aspirin', b: 'Warfarin', label: 'Aspirin + Warfarin (High Risk)' },
    { a: 'Ibuprofen', b: 'Lisinopril', label: 'Ibuprofen + Lisinopril' },
    { a: 'Metformin', b: 'Alcohol', label: 'Metformin + Alcohol' },
    { a: 'Cetirizine', b: 'Alcohol', label: 'Cetirizine + Alcohol (Safe)' }
  ];

  const handleCheck = async (e) => {
    if (e) e.preventDefault();
    if (!drugA.trim() || !drugB.trim()) {
      setError('Please enter both medication names');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await axiosClient.post('/tools/check-interactions', {
        drugA: drugA.trim(),
        drugB: drugB.trim()
      });
      if (res.data.success) {
        setResult(res.data);
      }
    } catch (err) {
      setError('Failed to evaluate medication interaction');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (a, b) => {
    setDrugA(a);
    setDrugB(b);
    setTimeout(() => {
      axiosClient.post('/tools/check-interactions', { drugA: a, drugB: b })
        .then(res => res.data.success && setResult(res.data));
    }, 100);
  };

  const getBadgeStyle = (level) => {
    if (level === 'Severe Danger') return 'bg-rose-950 text-rose-400 border-rose-500 glow-crimson';
    if (level === 'Moderate Risk') return 'bg-amber-950 text-amber-400 border-amber-500';
    return 'bg-emerald-950 text-emerald-400 border-emerald-500 glow-emerald';
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-8 rounded-3xl bg-slate-900 border border-white/10 glass-card text-left space-y-6">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 glow-cyan">
          <Pill className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Drug Conflict & Interaction Checker</h2>
          <p className="text-xs text-slate-400">Bidirectional contraindication check between two pharmaceutical compounds</p>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-slate-500 font-semibold mr-1">Quick Presets:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => loadPreset(p.a, p.b)}
            className="px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs text-cyan-300 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleCheck} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-5">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Medication A</label>
          <input
            type="text"
            placeholder="e.g. Aspirin, Metformin"
            value={drugA}
            onChange={(e) => setDrugA(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm"
          />
        </div>

        <div className="sm:col-span-2 flex items-center justify-center pt-5">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
        </div>

        <div className="sm:col-span-5">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Medication B</label>
          <input
            type="text"
            placeholder="e.g. Warfarin, Lisinopril"
            value={drugB}
            onChange={(e) => setDrugB(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm"
          />
        </div>

        <div className="sm:col-span-12 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Evaluate Conflict Safety Risk</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Result Display Box */}
      {result && (
        <div className="mt-6 p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {result.drugA} ↔ {result.drugB}
              </span>
            </div>

            <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getBadgeStyle(result.interactionLevel)}`}>
              {result.interactionLevel}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-cyan-400 block mb-1">Clinical Adverse Effect Assessment:</span>
            {result.adverseEffects}
          </div>
        </div>
      )}

    </div>
  );
};
