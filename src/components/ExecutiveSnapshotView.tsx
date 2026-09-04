import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { ExecutiveReportData } from '../types';

interface ExecutiveSnapshotViewProps {
  data: ExecutiveReportData;
  aiInsights?: {
    summaryNarrative?: string;
  };
}

export const ExecutiveSnapshotView: React.FC<ExecutiveSnapshotViewProps> = ({
  data,
  aiInsights,
}) => {
  const { executiveSnapshot } = data;

  return (
    <section id="executive-snapshot-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              1
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              İcraçı Xülasə (Executive Snapshot)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Boru kəmərinin sağlamlığı, çəkili gəlir proqnozu və icraçı rəhbərlik üçün əsas siqnallar
          </p>
        </div>
        <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
          <span>Portfel:</span>
          <strong className="text-slate-800">{data.companyOrDatasetName}</strong>
        </div>
      </div>

      {/* AI Strategic Narrative Banner if present */}
      {aiInsights?.summaryNarrative && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 text-slate-800 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-600 text-white shrink-0 mt-0.5 shadow-sm shadow-purple-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm leading-relaxed">
            <strong className="font-semibold text-purple-900 block mb-1">
              Baş Biznes Strateqi və AI Müşahidəsi:
            </strong>
            <p className="text-slate-700">{aiInsights.summaryNarrative}</p>
          </div>
        </div>
      )}

      {/* 4 Core Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Pipeline Value */}
        <div 
          id="card-total-pipeline"
          className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ümumi Pipeline Dəyəri
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ${executiveSnapshot.totalPipelineValue.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Cəmi Sövdələşmə:</span>
            <strong className="text-slate-800 font-semibold">{executiveSnapshot.totalDealsCount} ədəd</strong>
          </div>
          <div className="mt-1 text-[11px] font-medium text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded inline-block">
            Maliyyə Bazası: Tam Boru Kəməri
          </div>
        </div>

        {/* Metric 2: Weighted Pipeline (Expected Revenue) */}
        <div 
          id="card-weighted-pipeline"
          className="bg-white rounded-xl p-5 border border-emerald-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Gözlənilən Gəlir (Weighted)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
              ${Math.round(executiveSnapshot.weightedPipelineValue).toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-emerald-100/60">
            <span>Ehtimal çəkisi ilə:</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Proqnozlaşdırılan Gəlir
            </span>
          </div>
          <div className="mt-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded inline-block">
            Birbaşa Gözlənti: +${Math.round(executiveSnapshot.weightedPipelineValue).toLocaleString()}
          </div>
        </div>

        {/* Metric 3: Lead-to-Win Conversion Rate */}
        <div 
          id="card-lead-to-win"
          className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Konversiya (Lead-to-Win)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {executiveSnapshot.leadToWinRate.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({executiveSnapshot.wonDealsCount} won / {executiveSnapshot.totalDealsCount})
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>B2B Benchmark:</span>
            <strong className="text-slate-800 font-medium">20% - 25% Hədəf</strong>
          </div>
          <div className="mt-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">
            {executiveSnapshot.leadToWinRate >= 22 ? '🟢 Sağlam Konversiya' : '🟡 Optimizasiya Tələb Olunur'}
          </div>
        </div>

        {/* Metric 4: Average Sales Cycle Length */}
        <div 
          id="card-sales-cycle"
          className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Orta Satış Dövrü (Cycle)
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {executiveSnapshot.avgSalesCycleDays}
            </span>
            <span className="text-sm font-semibold text-slate-600">gün</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Təsir:</span>
            <span className="text-slate-700 font-medium">Hər -5 gün = +$85k sürət</span>
          </div>
          <div className="mt-1 text-[11px] font-medium text-purple-800 bg-purple-50 px-2 py-0.5 rounded inline-block">
            {executiveSnapshot.avgSalesCycleDays > 60 ? '🔴 Uzun Dövr / Tıxac' : '🟢 İcraçı Sürət Standartı'}
          </div>
        </div>
      </div>

      {/* 3 Critical Attention Signals (Qırmızı / Yaşıl / Sarı Siqnallar) with Direct Financial Impact */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Təcili Diqqət Tələb Edən 3 Əsas Kritik Siqnal
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            CEO & Satış Direktoru Eskalasiyası
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {executiveSnapshot.criticalSignals.map((signal, idx) => {
            const isDanger = signal.type === 'danger';
            const isWarning = signal.type === 'warning';
            const isSuccess = signal.type === 'success';

            const borderClass = isDanger 
              ? 'border-rose-200 bg-rose-50/50' 
              : isWarning 
              ? 'border-amber-200 bg-amber-50/50' 
              : 'border-emerald-200 bg-emerald-50/50';

            const iconClass = isDanger 
              ? 'text-rose-600 bg-rose-100' 
              : isWarning 
              ? 'text-amber-600 bg-amber-100' 
              : 'text-emerald-600 bg-emerald-100';

            const tagColor = signal.impactType === 'loss' 
              ? 'bg-rose-100 text-rose-800 border-rose-200' 
              : signal.impactType === 'gain' 
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
              : 'bg-slate-100 text-slate-800 border-slate-200';

            return (
              <div 
                key={idx}
                id={`critical-signal-${idx}`}
                className={`rounded-xl p-4 border ${borderClass} flex flex-col justify-between transition-all hover:translate-y-[-1px]`}
              >
                <div>
                  <div className="flex items-start gap-2.5">
                    <div className={`p-1.5 rounded-lg shrink-0 ${iconClass}`}>
                      {isDanger && <AlertOctagon className="w-4 h-4" />}
                      {isWarning && <AlertTriangle className="w-4 h-4" />}
                      {isSuccess && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {signal.title}
                    </h4>
                  </div>
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                    {signal.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Maliyyə Təsiri:</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${tagColor}`}>
                    {signal.financialImpact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
