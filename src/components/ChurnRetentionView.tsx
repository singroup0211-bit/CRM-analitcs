import React from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  UserX, 
  Layers, 
  AlertCircle, 
  Sparkles,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { HighRiskDeal, ExpansionPotential } from '../types';

interface ChurnRetentionViewProps {
  highRiskDeals: HighRiskDeal[];
  expansionPotentials: ExpansionPotential[];
  totalAtRiskValue: number;
  totalExpansionOpportunity: number;
}

export const ChurnRetentionView: React.FC<ChurnRetentionViewProps> = ({
  highRiskDeals,
  expansionPotentials,
  totalAtRiskValue,
  totalExpansionOpportunity,
}) => {
  return (
    <section id="churn-retention-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-900 text-xs font-bold">
              4
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Müştəri Seqmentasiyası və Risk Analizi (Churn & Retention)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            İtirmə təhlükəsi altında olan iri sövdələşmələr və mövcud portfeldə genişlənmə (Cross-sell / Up-sell) imkanları
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
            Risk Altında: -${totalAtRiskValue.toLocaleString()}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
            Up-sell İmkanı: +${totalExpansionOpportunity.toLocaleString()}
          </span>
        </div>
      </div>

      {/* High-Risk / High-Value Deals Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Yüksək Dəyərli Risk Altında Olan Müştərilər (High-Risk / High-Value Deals)
            </h3>
          </div>
          <span className="text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            Dərhal İcraçı Müdaxiləsi Tələb Olunur
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Müştəri / Sövdələşmə</th>
                <th className="py-2.5 px-3 font-semibold">Müqavilə Dəyəri</th>
                <th className="py-2.5 px-3 font-semibold">Mərhələ</th>
                <th className="py-2.5 px-3 font-semibold">Risk Səbəbi / Faktor</th>
                <th className="py-2.5 px-3 font-semibold">İtki Ehtimalı</th>
                <th className="py-2.5 px-3 font-semibold">Məsul Rep</th>
                <th className="py-2.5 px-3 font-semibold">Maliyyə Təhlükəsi</th>
                <th className="py-2.5 px-3 font-semibold">Tövsiyə Olunan İcraçı Addım</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {highRiskDeals.map((deal, idx) => (
                <tr key={idx} className="hover:bg-rose-50/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <UserX className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{deal.clientName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-black text-slate-900">
                    ${deal.dealValue.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {deal.stage}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-rose-900 font-medium">
                    {deal.riskFactor}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-rose-700">{deal.churnProbability}%</span>
                      <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-rose-600 h-1.5 rounded-full" 
                          style={{ width: `${deal.churnProbability}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {deal.assignedRep}
                  </td>
                  <td className="py-3 px-3 font-bold text-rose-700">
                    {deal.financialRisk}
                  </td>
                  <td className="py-3 px-3 text-slate-700 bg-amber-50/40 rounded max-w-xs font-medium">
                    {deal.recommendedAction}
                  </td>
                </tr>
              ))}
              {highRiskDeals.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400">
                    Bu portfeldə kritik risk altında olan böyük sövdələşmə aşkar edilmədi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-sell & Up-sell Opportunities */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Çarpaz Satış (Cross-sell) və Yüksək Satış (Up-sell) Potensial Sahələri
            </h3>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Portfel Qoruması & NRR Artımı
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expansionPotentials.map((item, idx) => (
            <div
              key={idx}
              id={`expansion-item-${idx}`}
              className="p-4 rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/40 to-teal-50/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <ArrowUpRight className="w-3 h-3" />
                    {item.type} Modulu
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {item.targetAccountsCount} Hədəf Şirkət
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-2.5">
                  {item.segment}
                </h4>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  <strong>İcra Strategiyası:</strong> {item.actionStrategy}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200/70 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-900">
                  Potensial Maliyyə Qazancı:
                </span>
                <span className="text-sm font-black text-emerald-700">
                  {item.potentialValue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
