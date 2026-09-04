import React, { useState } from 'react';
import { Sliders, TrendingUp, DollarSign, Clock, Target, ArrowRight, RotateCcw } from 'lucide-react';
import { ExecutiveReportData } from '../types';

interface ScenarioSimulatorViewProps {
  data: ExecutiveReportData;
}

export const ScenarioSimulatorView: React.FC<ScenarioSimulatorViewProps> = ({ data }) => {
  const baseConversion = Math.round(data.executiveSnapshot.leadToWinRate);
  const baseCycleDays = data.executiveSnapshot.avgSalesCycleDays;
  const basePipeline = data.executiveSnapshot.totalPipelineValue;
  const baseWeighted = data.executiveSnapshot.weightedPipelineValue;

  const [conversionDelta, setConversionDelta] = useState<number>(3); // +3% conversion
  const [cycleReductionDays, setCycleReductionDays] = useState<number>(7); // -7 days cycle
  const [unblockBottleneckRate, setUnblockBottleneckRate] = useState<number>(40); // 40% unblocked

  // Calculated gains:
  // 1% increase in conversion over total pipeline
  const conversionGain = Math.round(basePipeline * (conversionDelta / 100) * 0.45);
  // Velocity gain from shorter cycle: (days saved / baseCycleDays) * factor
  const velocityGain = Math.round(baseWeighted * (cycleReductionDays / Math.max(30, baseCycleDays)) * 0.25);
  // Bottleneck recovery (from stalled proposals)
  const stalledTotal = data.funnelVelocity.stages
    .filter(s => s.bottleneckDetected)
    .reduce((sum, s) => sum + s.totalValue, 0);
  const bottleneckGain = Math.round(stalledTotal * (unblockBottleneckRate / 100));

  const totalSimulatedIncrementalRevenue = conversionGain + velocityGain + bottleneckGain;
  const newSimulatedWeightedPipeline = Math.round(baseWeighted + totalSimulatedIncrementalRevenue);

  const resetToDefault = () => {
    setConversionDelta(3);
    setCycleReductionDays(7);
    setUnblockBottleneckRate(40);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
              <Sliders className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              İcraçı Ssenari Simulyatoru (What-If Revenue Engine)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Konversiya artımı, dövrün qısaldılması və tıxacların açılmasının gəlirə proqnozlaşdırılan təsiri
          </p>
        </div>
        <button
          onClick={resetToDefault}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3 h-3" />
          İlkin Vəziyyətə Qaytar
        </button>
      </div>

      {/* Top Level Output Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <TrendingUp className="w-3.5 h-3.5" />
            Simulyasiya Nəticəsi: Əlavə Gəlir Potensialı
          </span>
          <div className="text-3xl sm:text-4xl font-black mt-2 text-emerald-400 tracking-tight">
            +${totalSimulatedIncrementalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Seçilmiş təkmilləşdirmələr nəticəsində növbəti 90 gün ərzində gözlənilən xalis kassa artımı
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Baza Gözlənilən Gəlir</span>
            <span className="text-lg font-bold text-slate-200">${Math.round(baseWeighted).toLocaleString()}</span>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
            <span className="text-[11px] text-emerald-300 uppercase tracking-wider block">Yeni Proqnozlaşdırılan</span>
            <span className="text-lg font-black text-emerald-400">${newSimulatedWeightedPipeline.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Control Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Slider 1: Lead-to-Win Conversion Improvement */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              Konversiya Artımı
            </span>
            <span className="text-sm font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              +{conversionDelta}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Baza: {baseConversion}% → Yeni Hədəf: {baseConversion + conversionDelta}%
          </p>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={conversionDelta}
            onChange={e => setConversionDelta(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Maliyyə Qazancı:</span>
            <strong className="text-emerald-700 font-bold">+${conversionGain.toLocaleString()}</strong>
          </div>
        </div>

        {/* Slider 2: Sales Cycle Reduction */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-600" />
              Dövrün Qısaldılması
            </span>
            <span className="text-sm font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              -{cycleReductionDays} gün
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Baza: {baseCycleDays} gün → Yeni Sürət: {Math.max(10, baseCycleDays - cycleReductionDays)} gün
          </p>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={cycleReductionDays}
            onChange={e => setCycleReductionDays(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Sürət Qazancı:</span>
            <strong className="text-emerald-700 font-bold">+${velocityGain.toLocaleString()}</strong>
          </div>
        </div>

        {/* Slider 3: Unblocking Bottleneck Deals */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-600" />
              Tıxacdan Qurtarma
            </span>
            <span className="text-sm font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {unblockBottleneckRate}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Tıxacda qalan həcm: ${stalledTotal.toLocaleString()}
          </p>
          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={unblockBottleneckRate}
            onChange={e => setUnblockBottleneckRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Xilas Edilən Gəlir:</span>
            <strong className="text-emerald-700 font-bold">+${bottleneckGain.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
