import React from 'react';
import { 
  Users, 
  Award, 
  AlertTriangle, 
  PhoneCall, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { RepPerformance } from '../types';

interface TeamPerformanceMatrixProps {
  reps: RepPerformance[];
  topPerformersNote: string;
  atRiskNote: string;
  activityVsOutcomeInsight: string;
}

export const TeamPerformanceMatrix: React.FC<TeamPerformanceMatrixProps> = ({
  reps,
  topPerformersNote,
  atRiskNote,
  activityVsOutcomeInsight,
}) => {
  // Sort reps by revenue won descending
  const sortedReps = [...reps].sort((a, b) => b.totalRevenueWon - a.totalRevenueWon);

  const topPerformers = sortedReps.filter(r => r.status === 'Top Performer' || r.quotaAttainment >= 100);
  const atRiskPerformers = sortedReps.filter(r => r.status === 'At-Risk' || r.quotaAttainment < 40);

  return (
    <section id="team-performance-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold">
              3
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Satış Komandasının Performans Matrisi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Satış nümayəndələrinin effektivlik dərəcəsi, kvorum icrası və fəaliyyət vs. nəticə korelasiyası
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            Top: {topPerformers.length} Nümayəndə
          </span>
          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
            Risk: {atRiskPerformers.length} Nümayəndə
          </span>
        </div>
      </div>

      {/* Main Performance Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Rep / Menecer Üzrə Nəticə və Fəaliyyət Bölgüsü
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Kvorum Hədəfi: $300,000 / Rüblük
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Satış Nümayəndəsi</th>
                <th className="py-2.5 px-3 font-semibold text-center">Fəaliyyət (Zəng/Görüş)</th>
                <th className="py-2.5 px-3 font-semibold text-center">Bağlanan Müqavilə</th>
                <th className="py-2.5 px-3 font-semibold">Qazanılan Gəlir</th>
                <th className="py-2.5 px-3 font-semibold">Win Rate</th>
                <th className="py-2.5 px-3 font-semibold">Kvorum İcrası</th>
                <th className="py-2.5 px-3 font-semibold">Status / Kateqoriya</th>
                <th className="py-2.5 px-3 font-semibold">Maliyyə Kəsiri / Fərq</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedReps.map((rep, idx) => {
                const isTop = rep.status === 'Top Performer' || rep.quotaAttainment >= 100;
                const isRisk = rep.status === 'At-Risk';
                const isHighActLowWin = rep.status === 'High Activity/Low Win';

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {isTop && <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        {isRisk && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                        <span>{rep.repName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{rep.role}</span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-800">
                        <PhoneCall className="w-3 h-3 text-slate-500" />
                        {rep.activitiesCount}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {rep.dealsClosedWon}
                    </td>

                    <td className="py-3 px-3 font-black text-slate-900">
                      ${rep.totalRevenueWon.toLocaleString()}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`font-bold ${rep.winRate >= 35 ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {rep.winRate}%
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 min-w-[32px]">{rep.quotaAttainment}%</span>
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${
                              rep.quotaAttainment >= 100 
                                ? 'bg-emerald-500' 
                                : rep.quotaAttainment >= 60 
                                ? 'bg-blue-500' 
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(100, rep.quotaAttainment)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        isTop
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isRisk
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isHighActLowWin
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {rep.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-bold">
                      <span className={rep.financialGap.startsWith('+') ? 'text-emerald-700' : 'text-rose-700'}>
                        {rep.financialGap}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity vs Outcome Insights & Coaching Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Performers Card */}
        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <Award className="w-4 h-4 text-emerald-600" />
            Top Performers Standartı
          </div>
          <p className="text-emerald-950/90 leading-relaxed">
            {topPerformersNote}
          </p>
          <div className="pt-2 border-t border-emerald-200/80 text-[11px] text-emerald-800 font-medium">
            🎯 <strong>Tövsiyə:</strong> Bu qrupun istifadə etdiyi zəng skriptləri və demo strukturu komanda üçün standart təlim bazasına çevrilməlidir.
          </div>
        </div>

        {/* At-Risk Performers Card */}
        <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            At-Risk & Fəaliyyət Kəsiri Olan Qrup
          </div>
          <p className="text-rose-950/90 leading-relaxed">
            {atRiskNote}
          </p>
          <div className="pt-2 border-t border-rose-200/80 text-[11px] text-rose-800 font-medium">
            ⚠️ <strong>Dərhal Addım:</strong> Fəaliyyəti az olan rep-lər üçün gündəlik 10 aktiv təmas kvotası və həftəlik rəhbər shadow-call tətbiq olunmalıdır.
          </div>
        </div>
      </div>

      {/* Activity vs Outcome Balance Deep Dive Callout */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs leading-relaxed space-y-1.5 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          Fəaliyyət vs. Nəticə Balansının Strateji Diaqnostikası
        </div>
        <p className="text-slate-300">
          {activityVsOutcomeInsight} Yüksək zəng və görüş sayı keyfiyyətli kəşfiyyat (Discovery) və güclü etiraz dəfetmə bacarığı ilə tamamlanmadıqda, rep sadəcə "məşğul" görünür, lakin kommersiya gəliri formalaşdırmır. Kommersiya rəhbərliyi fokuslanmanı sırf zəng sayından çıxararaq "kvalifikasiyalı təklifə keçid dərəcəsi" (Stage Conversion Velocity) üzrə qiymətləndirməlidir.
        </p>
      </div>
    </section>
  );
};
