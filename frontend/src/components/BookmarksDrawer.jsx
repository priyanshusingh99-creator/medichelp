import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, Trash2, ChevronRight, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BookmarksDrawer = ({ isOpen, onClose, onSelectDisease }) => {
  const { savedConditions, toggleBookmark, user } = useAuth();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />
        
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Saved Conditions</h2>
                <span className="px-2 py-0.5 text-xs font-bold bg-cyan-950 text-cyan-400 rounded-full border border-cyan-800">
                  {savedConditions.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {!user ? (
                <div className="text-center py-12 text-slate-400">
                  <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
                  <p className="text-sm font-medium">Please sign in to view and save your health bookmarks across devices.</p>
                </div>
              ) : savedConditions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-500" />
                  <p className="text-sm font-medium">No saved conditions yet.</p>
                  <p className="text-xs text-slate-500 mt-1">Bookmark any condition dossier to reference it anytime.</p>
                </div>
              ) : (
                savedConditions.map((disease) => (
                  <div
                    key={disease._id}
                    className="group relative p-4 rounded-xl bg-slate-800/60 border border-white/10 hover:border-cyan-500/40 transition-all flex items-center justify-between"
                  >
                    <div
                      className="flex-1 cursor-pointer pr-3"
                      onClick={() => {
                        onSelectDisease(disease);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {disease.name}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          disease.severity === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                          disease.severity === 'Moderate' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {disease.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-cyan-400" />
                        <span>{disease.bodyRegion} Region</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleBookmark(disease)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          onSelectDisease(disease);
                          onClose();
                        }}
                        className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-950/40 transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
