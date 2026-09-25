import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2, VolumeX, Download, Bookmark, BookmarkCheck,
  CheckCircle2, AlertTriangle, Activity, Pill, Clock, Apple, Ban, HelpCircle, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { speakText, stopSpeech } from '../utils/ttsHelper';
import { exportDoctorChecklistPDF } from '../utils/pdfGenerator';

export const ConditionDossier = ({ disease, onClose }) => {
  const { isBookmarked, toggleBookmark } = useAuth();
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState([]);

  if (!disease) return null;

  const bookmarked = isBookmarked(disease._id);

  const handleToggleTTS = () => {
    if (isPlayingTTS) {
      stopSpeech();
      setIsPlayingTTS(false);
    } else {
      const guideText = `Immediate First-Aid Solutions for ${disease.name}: ` + disease.temporarySolutions.join('. ');
      setIsPlayingTTS(true);
      speakText(guideText, () => setIsPlayingTTS(false));
    }
  };

  const toggleQuestion = (idx) => {
    if (checkedQuestions.includes(idx)) {
      setCheckedQuestions(checkedQuestions.filter(i => i !== idx));
    } else {
      setCheckedQuestions([...checkedQuestions, idx]);
    }
  };

  const handleExportPDF = () => {
    exportDoctorChecklistPDF(disease, checkedQuestions);
  };

  const getSeverityBadgeClass = (sev) => {
    if (sev === 'Critical') return 'bg-rose-950 text-rose-400 border-rose-500/50 glow-crimson';
    if (sev === 'Moderate') return 'bg-amber-950 text-amber-400 border-amber-500/50';
    return 'bg-emerald-950 text-emerald-400 border-emerald-500/50 glow-emerald';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-white/10 glass-card text-left space-y-8 shadow-2xl"
    >
      
      {/* Dossier Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getSeverityBadgeClass(disease.severity)}`}>
              {disease.severity} Severity
            </span>
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              {disease.bodyRegion} Region
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
            {disease.name}
          </h2>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            onClick={() => toggleBookmark(disease)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              bookmarked
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 glow-cyan'
                : 'bg-slate-800 text-slate-300 border-white/10 hover:border-cyan-500/40'
            }`}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4 text-cyan-400" /> : <Bookmark className="w-4 h-4" />}
            <span>{bookmarked ? 'Saved to Bookmarks' : 'Bookmark Condition'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* 4-CARD DOSSIER PRESENTATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: Symptoms Presentation */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Activity className="w-4 h-4" />
            <span>Symptoms & Signs</span>
          </div>
          <p className="text-xs text-slate-400">Common indicators associated with this condition:</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {disease.symptoms.map((sym, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-slate-200 text-xs font-medium flex items-center gap-1.5 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{sym}</span>
              </span>
            ))}
          </div>
        </div>

        {/* CARD 2: Long-Term Untreated Risks */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4 hover:border-amber-500/40 transition-all">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>Long-Term Effects & Risks</span>
          </div>
          <p className="text-xs text-slate-400">Complications if left unaddressed:</p>
          <ul className="space-y-2 text-xs text-slate-300 pt-1">
            {disease.longTermEffects.map((effect, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{effect}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CARD 3: Temporary First-Aid Solutions */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-4 relative hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Temporary Solutions & First-Aid</span>
            </div>

            <button
              onClick={handleToggleTTS}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingTTS
                  ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900'
              }`}
            >
              {isPlayingTTS ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Listen Guide (TTS)</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2.5">
            {disease.temporarySolutions.map((sol, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-200 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[10px] font-black border border-emerald-800">
                  Step {idx + 1}
                </span>
                <span>{sol}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 4: Permanent Clinical Solutions */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Pill className="w-4 h-4" />
            <span>Permanent Clinical Solutions</span>
          </div>
          <p className="text-xs text-slate-400">Clinical treatments, medical protocols, and curative solutions:</p>
          <ul className="space-y-2 text-xs text-slate-300 pt-1">
            {disease.permanentSolutions.map((psol, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{psol}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* DIETARY BLUEPRINT SECTION */}
      {disease.dietaryRecommendations && (
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Apple className="w-4 h-4 text-emerald-400" />
            <span>Dietary Recommendations</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Foods to Include
              </span>
              <ul className="space-y-1 text-xs text-emerald-200">
                {disease.dietaryRecommendations.foodsToEat?.map((food, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Ban className="w-4 h-4" /> Foods to Avoid
              </span>
              <ul className="space-y-1 text-xs text-rose-200">
                {disease.dietaryRecommendations.foodsToAvoid?.map((food, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR CHECKLIST SECTION */}
      {disease.doctorQuestions && (
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>What to Ask Your Doctor</span>
            </h3>
            <button
              onClick={handleExportPDF}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Printable PDF Report</span>
            </button>
          </div>

          <div className="space-y-2">
            {disease.doctorQuestions.map((q, idx) => {
              const isChecked = checkedQuestions.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleQuestion(idx)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isChecked
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                      : 'bg-slate-900 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <span className="pr-4">{q}</span>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                    isChecked ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-600'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </motion.div>
  );
};
