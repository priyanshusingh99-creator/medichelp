import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PhoneCall, MapPin, AlertTriangle, ShieldAlert, Navigation } from 'lucide-react';

export const EmergencyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const nearbyHospitals = [
    { name: 'City Central Trauma & Emergency Center', distance: '1.2 km', time: '4 mins', phone: '112' },
    { name: 'St. Jude Heart & Cardiac Institute', distance: '2.8 km', time: '8 mins', phone: '108' },
    { name: 'Metropolitan General Hospital ER', distance: '3.5 km', time: '11 mins', phone: '911' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-slate-900 border-2 border-rose-500/80 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 p-5 border-b border-rose-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white animate-pulse">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-wide">EMERGENCY SOS PORTAL</h3>
                <p className="text-xs text-rose-300 font-medium">Immediate Medical Crisis Response & Dispatch</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Speed Dial Numbers Grid */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span>Instant Emergency Dispatch Speed-Dials</span>
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Global Emergency', number: '112', sub: 'All Medical & Police' },
                  { label: 'National Ambulance', number: '108', sub: 'Trauma & Paramedic' },
                  { label: 'North America / SOS', number: '911', sub: 'Urgent Care Dispatch' }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={`tel:${item.number}`}
                    className="p-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 hover:border-rose-400 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                  >
                    <span className="text-2xl font-black text-rose-400 group-hover:scale-110 transition-transform">{item.number}</span>
                    <span className="text-xs font-bold text-white mt-1">{item.label}</span>
                    <span className="text-[10px] text-rose-300 mt-0.5">{item.sub}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Critical Symptoms Warning Box */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block mb-1">Seek Immediate Emergency Care If Experiencing:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  <li>Severe crushing chest pain radiating to jaw or arm</li>
                  <li>Sudden numbness or facial drooping (Stroke warning)</li>
                  <li>Inability to breathe or coughing up blood</li>
                </ul>
              </div>
            </div>

            {/* Embedded Nearby ER Center Map View */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Nearby Emergency Trauma Centers</span>
                </p>
                <span className="text-xs text-emerald-400 font-medium">GPS Triangulated</span>
              </div>
              <div className="space-y-2.5">
                {nearbyHospitals.map((h, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-between hover:border-cyan-500/40 transition-all">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {h.name}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1 text-cyan-400">
                          <Navigation className="w-3 h-3" /> {h.distance} away
                        </span>
                        <span>• ETA: {h.time}</span>
                      </div>
                    </div>
                    <a
                      href={`tel:${h.phone}`}
                      className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call ER</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
