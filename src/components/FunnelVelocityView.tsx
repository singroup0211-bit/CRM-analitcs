import React from 'react';
import { 
  GitCommit, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { FunnelStage, LostDealReason } from '../types';

interface FunnelVelocityViewProps {
  stages: FunnelStage[];
  lostDealReasons: LostDealReason[];
  summaryInsight: string;
  totalLostValue: number;
}

export const FunnelVelocityView: React.FC<FunnelVelocityViewProps> = ({
  stages,
  lostDealReasons,
  summaryInsight,
  totalLostValue,
}) => {
  const maxStageValue = Math.max(...stages.map(s => s.totalValue), 1);

  return (
    <section id="funnel-velocity-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
              2
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Satış Qıfı və Konversiya Analitikası (Funnel Velocity)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mərhələlər üzrə sürət, ləngimə nöqtələri (bottlenecks) və itirilmiş sövdələşmələrin kök səbəbləri
          </p>
        </div>
        <div className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          Cəmi Qeydə Alınan İtki: -${totalLostValue.toLocaleString()}
        </div>
      </div>

      {/* Funnel Stage Velocity Visual Cards */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Mərhələlər üzrə Keçid Sürəti və Sıxılmalar (Bottlenecks)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Stage Velocity & Bottleneck Diagnostic
          </span>
        </div>

        {/* Funnel Pipeline Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {stages.map((stage, idx) => {
            const isBottleneck = stage.bottleneckDetected;
            const barWidthPercent = Math.max(15, Math.round((stage.totalValue / maxStageValue) * 100));

            return (
              <div
                key={idx}
                id={`funnel-stage-${idx}`}
                className={`rounded-xl p-4 border transition-all flex flex-col justify-between relative overflow-hidden ${
                  isBottleneck
                    ? 'border-rose-300 bg-rose-50/40 ring-1 ring-rose-200'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                {/* Stage Step Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400">
                    Mərhələ #{idx + 1}
                  </span>
                  {isBottleneck ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                      <AlertCircle className="w-3 h-3" />
                      Tıxac (Bottleneck)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      <CheckCircle className="w-3 h-3" />
                      Normal
                    </span>
                  )}
                </div>

                {/* Stage Name & Value */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 truncate" title={stage.stageName}>
                    {stage.stageName}
                  </h4>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    ${stage.totalValue.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {stage.dealsCount} sövdələşmə ({stage.conversionRate}% pay)
                  </div>
                </div>

                {/* Velocity Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${isBottleneck ? 'bg-rose-500' : 'bg-blue-600'}`}
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  </div>
                </div>

                {/* Stage Time & Bottleneck Note */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Orta Vaxt:
                    </span>
                    <strong className={`font-semibold ${isBottleneck ? 'text-rose-700' : 'text-slate-800'}`}>
                      {stage.avgDaysInStage} gün
                    </strong>
                  </div>

                  {stage.financialLossEstimate && (
                    <div className="mt-2 text-[11px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                      Risk/İtki: {stage.financialLossEstimate}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Funnel Insight Summary Callout */}
        <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block text-blue-950">Qıf Sürəti Təhlili (Funnel Velocity Insight):</strong>
            <p className="mt-0.5 text-blue-800/90 leading-relaxed">{summaryInsight}</p>
          </div>
        </div>
      </div>

      {/* Lost Deal Root Cause Analysis Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              İtirilmiş Sövdələşmələrin Əsas Səbəbləri (Lost Deal Root Cause Analysis)
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Hər Tapıntının Birbaşa Maliyyə Təsiri
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">İtki Səbəbi (Category)</th>
                <th className="py-2.5 px-3 font-semibold text-center">Say</th>
                <th className="py-2.5 px-3 font-semibold">İtirilən Məbləğ</th>
                <th className="py-2.5 px-3 font-semibold">Pay (%)</th>
                <th className="py-2.5 px-3 font-semibold">Əsas Kök Səbəb (Root Cause)</th>
                <th className="py-2.5 px-3 font-semibold">Dərhal Həll Taktikası</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lostDealReasons.map((reason, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {reason.reason}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-600">
                    {reason.count}
                  </td>
                  <td className="py-3 px-3 font-bold text-rose-700">
                    -${reason.totalLostValue.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">{reason.percentage}%</span>
                      <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-rose-500 h-1.5 rounded-full" 
                          style={{ width: `${Math.min(100, reason.percentage * 2)}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs">
                    {reason.rootCause}
                  </td>
                  <td className="py-3 px-3 text-emerald-800 bg-emerald-50/30 rounded font-medium max-w-xs">
                    {reason.mitigation}
                  </td>
                </tr>
              ))}
              {lostDealReasons.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    Bu portfeldə itirilmiş sövdələşmə qeydi tapılmadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
