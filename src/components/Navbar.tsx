import React from 'react';
import { 
  Building2, 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  Database, 
  FileText, 
  Sliders, 
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { PresetDataset } from '../types';
import { PRESET_DATASETS } from '../data/presets';

interface NavbarProps {
  activeTab: 'dashboard' | 'report' | 'simulator' | 'data';
  setActiveTab: (tab: 'dashboard' | 'report' | 'simulator' | 'data') => void;
  currentDatasetTitle: string;
  onSelectPreset: (preset: PresetDataset) => void;
  onOpenDataModal: () => void;
  onTriggerAIAnalysis: () => void;
  isAILoading: boolean;
  hasAICached: boolean;
  onCopyReport: () => void;
  copied: boolean;
  onPrintReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentDatasetTitle,
  onSelectPreset,
  onOpenDataModal,
  onTriggerAIAnalysis,
  isAILoading,
  hasAICached,
  onCopyReport,
  copied,
  onPrintReport,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight truncate text-slate-100">
                  Executive CRM Health & Revenue Report
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CEO / CRO Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate hidden sm:block">
                Qabaqcıl biznes analitikası, konversiya qıfı və kommersiya strategiyası
              </p>
            </div>
          </div>

          {/* Quick Dataset Selector Dropdown */}
          <div className="relative shrink-0">
            <button
              id="dataset-selector-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="max-w-[130px] sm:max-w-[200px] truncate">{currentDatasetTitle}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl shadow-black/50 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Nümunə CRM Portfelləri
                </div>
                {PRESET_DATASETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-750 transition-colors flex flex-col"
                  >
                    <span className="text-xs font-semibold text-slate-200">{preset.title}</span>
                    <span className="text-[11px] text-slate-400 truncate">{preset.industry}</span>
                  </button>
                ))}
                <div className="border-t border-slate-700/80 my-1 pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenDataModal();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-amber-400 hover:bg-slate-750 transition-colors flex items-center gap-2"
                  >
                    <Database className="w-3.5 h-3.5" />
                    Öz Xam CRM Məlumatını Daxil Et...
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Trigger & Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              id="ai-analysis-btn"
              onClick={onTriggerAIAnalysis}
              disabled={isAILoading}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                isAILoading
                  ? 'bg-purple-900/60 text-purple-300 cursor-wait border border-purple-700'
                  : hasAICached
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/25'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAILoading ? 'animate-spin' : 'text-purple-300'}`} />
              <span className="hidden sm:inline">
                {isAILoading ? 'AI Təhlil Edir...' : hasAICached ? 'AI Yenilə' : 'AI Dərin Təhlil'}
              </span>
              <span className="sm:hidden">AI</span>
            </button>

            <button
              id="copy-report-btn"
              onClick={onCopyReport}
              title="Markdown Hesabatı Kopyala"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              id="print-report-btn"
              onClick={onPrintReport}
              title="Çap et / PDF Saxla"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors hidden sm:inline-flex"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex space-x-1 border-t border-slate-800/80 pt-1 pb-2 overflow-x-auto scrollbar-none">
          <button
            id="tab-dashboard-btn"
            onClick={() => setActiveTab('dashboard')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            İcraçı İdarəetmə Paneli (Dashboard)
          </button>

          <button
            id="tab-report-btn"
            onClick={() => setActiveTab('report')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Rəsmi İcraçı Hesabat (Executive Report)
          </button>

          <button
            id="tab-simulator-btn"
            onClick={() => setActiveTab('simulator')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Ssenari Simulyatoru (What-If)
          </button>

          <button
            id="tab-data-btn"
            onClick={() => setActiveTab('data')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'data'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Xam Məlumat Müfəttişi (CRM Data)
          </button>
        </div>
      </div>
    </header>
  );
};
