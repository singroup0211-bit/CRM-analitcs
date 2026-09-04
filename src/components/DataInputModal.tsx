import React, { useState } from 'react';
import { X, Upload, Database, RefreshCw, FileSpreadsheet, Check, Sparkles } from 'lucide-react';
import { PresetDataset } from '../types';
import { PRESET_DATASETS } from '../data/presets';

interface DataInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (rawData: string, title: string) => void;
  currentRawData: string;
  currentTitle: string;
}

export const DataInputModal: React.FC<DataInputModalProps> = ({
  isOpen,
  onClose,
  onApplyData,
  currentRawData,
  currentTitle,
}) => {
  const [inputText, setInputText] = useState(currentRawData);
  const [datasetTitle, setDatasetTitle] = useState(currentTitle);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: PresetDataset) => {
    setSelectedPresetId(preset.id);
    setInputText(preset.rawData);
    setDatasetTitle(preset.title);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        setDatasetTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onApplyData(inputText, datasetTitle || 'Fərdi CRM Məlumatları');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Xam CRM Məlumatlarını Daxil Edin (Data Inspector)
              </h3>
              <p className="text-xs text-slate-500">
                CSV, TSV və ya JSON formatında CRM məlumatlarını yapışdırın və ya hazır şablon seçin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Quick Presets Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Hazır Şablon Portfellər
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESET_DATASETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPresetId === preset.id
                      ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {preset.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {preset.industry}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title & File Upload Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hesabat / Şirkət Başlığı
              </label>
              <input
                type="text"
                value={datasetTitle}
                onChange={(e) => setDatasetTitle(e.target.value)}
                placeholder="məs: Q3 Enterprise CRM Satış Portfeli"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CSV / JSON Faylı Yüklə
              </label>
              <label className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-300 hover:border-amber-500 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Upload className="w-3.5 h-3.5 text-amber-600" />
                <span>Kompüterdən Seç...</span>
                <input
                  type="file"
                  accept=".csv,.txt,.json,.tsv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Raw Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Xam Məlumat Mətni (CSV Başlıqları: Deal_Name, Stage, Deal_Value, Days_In_Stage, Rep_Name, Calls_Meetings, Status, Loss_Reason)
              </label>
              <span className="text-[11px] text-slate-400">
                {inputText.split('\n').filter(Boolean).length} sətir
              </span>
            </div>
            <textarea
              rows={9}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setSelectedPresetId('');
              }}
              placeholder="ID,Deal_Name,Stage,Deal_Value,Probability,Days_In_Stage,Rep_Name,Calls_Meetings,Status,Loss_Reason..."
              className="w-full font-mono text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setInputText(PRESET_DATASETS[0].rawData);
                setDatasetTitle(PRESET_DATASETS[0].title);
              }}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Standart B2B SaaS Məlumatını Bərpa Et
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              >
                Ləğv Et
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm shadow-amber-600/20 transition-colors"
              >
                Tətbiq Et və Analiz Et
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
