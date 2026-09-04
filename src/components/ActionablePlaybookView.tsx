import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Zap, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  UserCheck, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { TacticalStep } from '../types';

interface ActionablePlaybookViewProps {
  sevenDaySteps: TacticalStep[];
  thirtyDayStrategy: TacticalStep[];
}

export const ActionablePlaybookView: React.FC<ActionablePlaybookViewProps> = ({
  sevenDaySteps,
  thirtyDayStrategy,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="actionable-playbook-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
              5
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Dərhal Həyata Keçirilməli Taktiki Addımlar (Actionable Playbook)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            CEO və Satış Direktoru tərəfindən icraya veriləcək təcili 7 günlük və strateji 30 günlük yol xəritəsi
          </p>
        </div>
        <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Gəlir Təsiri İlə Prioritetləşdirilib
        </div>
      </div>

      {/* Part A: Next 7 Days 3 Urgent Steps */}
      <div className="bg-white rounded-xl p-5 border border-amber-200/90 shadow-sm space-y-4 bg-gradient-to-br from-white to-amber-50/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500 text-white">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Növbəti 7 Gün Ərzində Atılmalı 3 Təcili Addım
              </h3>
              <p className="text-[11px] text-amber-800 font-medium">
                Tıxacların aradan qaldırılması və riskdə olan gəlirin xilas edilməsi
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Təcili (Urgent)
          </span>
        </div>

        <div className="space-y-3">
          {sevenDaySteps.map((step) => {
            const isDone = !!completedSteps[step.id];
            return (
              <div
                key={step.id}
                id={step.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/40 opacity-75'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                  >
                    {isDone ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {step.actionTitle}
                        </h4>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 self-start sm:self-auto border border-emerald-200 whitespace-nowrap">
                        {step.financialImpact}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-7">
                      {step.detail}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 pl-7">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        Məsul: <strong>{step.ownerRole}</strong>
                      </span>
                      <span className="text-slate-400">
                        İcra Müddəti: 7 iş günü
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part B: Next 30 Days Revenue Protection & Expansion Strategy */}
      <div className="bg-white rounded-xl p-5 border border-indigo-200/90 shadow-sm space-y-4 bg-gradient-to-br from-white to-indigo-50/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Növbəti 30 Gün Üçün Gəliri Qoruma və Artırma Strategiyası
              </h3>
              <p className="text-[11px] text-indigo-800 font-medium">
                Davamlı dövriyyə artımı, SLA intizamı və NRR genişlənməsi
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
            Orta Müddətli (Strategic)
          </span>
        </div>

        <div className="space-y-3">
          {thirtyDayStrategy.map((step) => {
            const isDone = !!completedSteps[step.id];
            return (
              <div
                key={step.id}
                id={step.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/40 opacity-75'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                  >
                    {isDone ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {step.actionTitle}
                        </h4>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 self-start sm:self-auto border border-indigo-200 whitespace-nowrap">
                        {step.financialImpact}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-7">
                      {step.detail}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 pl-7">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        Məsul: <strong>{step.ownerRole}</strong>
                      </span>
                      <span className="text-slate-400">
                        İcra Müddəti: 30 gün
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
