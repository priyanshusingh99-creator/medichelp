import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Eye, Sparkles, ArrowRight, Activity } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export const PrescriptionScanner = ({ onSelectDisease }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [ocrData, setOcrData] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setError('');
    setOcrData(null);

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setPreviewUrl('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please choose or drag a prescription file first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('prescription', file);

    try {
      const res = await axiosClient.post('/api/tools/ocr-scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setOcrData(res.data);
      }
    } catch (err) {
      setError('Failed to scan prescription. Try another image format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-8 rounded-3xl bg-slate-900 border border-white/10 glass-card text-left space-y-6 shadow-2xl">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 glow-cyan">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Prescription OCR Scanner</h2>
          <p className="text-xs text-slate-400">Upload prescription images to extract medications and directly view condition dossiers</p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="relative border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-8 bg-slate-950/60 text-center transition-all cursor-pointer">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="space-y-3 pointer-events-none">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-400 mx-auto flex items-center justify-center shadow-lg shadow-cyan-950">
            <FileText className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">
              {file ? file.name : 'Drag & drop prescription file or click to browse'}
            </span>
            <span className="text-xs text-slate-500">Supports PNG, JPEG, WEBP or PDF (Max 10MB)</span>
          </div>
        </div>
      </div>

      {/* Thumbnail Preview & Parsing Indicator */}
      {previewUrl && (
        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-950 border border-white/10 max-w-sm">
          <img src={previewUrl} alt="Prescription preview" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
          <div>
            <span className="text-xs font-bold text-white block truncate max-w-[200px]">{file?.name}</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              File Ready for OCR Scanning
            </span>
          </div>
        </div>
      )}

      {/* "Scan Prescription & Extract Medications" Button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 cursor-pointer transition-all"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Scanning Prescription & Extracting Text...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
              <span>Scan Prescription & Extract Medications</span>
            </>
          )}
        </button>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      {/* OCR Results Panel */}
      {ocrData && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>OCR Extraction Completed</span>
            </span>
            <span className="text-xs text-cyan-400 font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800">
              {ocrData.detectedMedications.length} Medication(s) Identified
            </span>
          </div>

          {/* Identified Meds */}
          <div className="flex flex-wrap gap-2">
            {ocrData.detectedMedications.map((med, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-xs font-bold shadow-sm"
              >
                💊 {med}
              </span>
            ))}
          </div>

          {/* Extracted Text */}
          <div className="p-4 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
            {ocrData.extractedText}
          </div>

          {/* Matched Condition Dossiers (Click to view Dossier) */}
          {ocrData.matchedConditions && ocrData.matchedConditions.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Click any extracted condition to view its Symptoms, Temporary Solutions & Permanent Solutions:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ocrData.matchedConditions.map((cond) => (
                  <div
                    key={cond._id}
                    onClick={() => {
                      onSelectDisease(cond);
                    }}
                    className="p-3.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors block">
                        {cond.name}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Activity className="w-3 h-3 text-cyan-400" /> {cond.bodyRegion} Region
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                      <span>View Dossier</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
