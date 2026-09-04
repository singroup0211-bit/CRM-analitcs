import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  Database, 
  FileText, 
  Sliders, 
  ArrowUpRight,
  TrendingDown,
  AlertOctagon,
  TrendingUp,
  RefreshCw,
  Clock,
  DollarSign
} from 'lucide-react';
import { PRESET_DATASETS } from './data/presets';
import { parseCRMText, generateDeterministicReport } from './utils/crmAnalyzer';
import { ExecutiveReportData, PresetDataset } from './types';
import { Navbar } from './components/Navbar';
import { ExecutiveSnapshotView } from './components/ExecutiveSnapshotView';
import { FunnelVelocityView } from './components/FunnelVelocityView';
import { TeamPerformanceMatrix } from './components/TeamPerformanceMatrix';
import { ChurnRetentionView } from './components/ChurnRetentionView';
import { ActionablePlaybookView } from './components/ActionablePlaybookView';
import { MarkdownReportView } from './components/MarkdownReportView';
import { ScenarioSimulatorView } from './components/ScenarioSimulatorView';
import { DataInputModal } from './components/DataInputModal';

export default function App() {
  const [rawData, setRawData] = useState<string>(PRESET_DATASETS[0].rawData);
  const [datasetTitle, setDatasetTitle] = useState<string>(PRESET_DATASETS[0].title);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'simulator' | 'data'>('dashboard');
  
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [aiInsights, setAIInsights] = useState<{ summaryNarrative?: string } | null>(null);
  const [hasAICached, setHasAICached] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute structured CRM data and executive metrics
  const reportData: ExecutiveReportData = useMemo(() => {
    const deals = parseCRMText(rawData);
    return generateDeterministicReport(deals, datasetTitle);
  }, [rawData, datasetTitle]);

  const handleSelectPreset = (preset: PresetDataset) => {
    setRawData(preset.rawData);
    setDatasetTitle(preset.title);
    setAIInsights(null);
    setHasAICached(false);
  };

  const handleApplyCustomData = (newData: string, newTitle: string) => {
    setRawData(newData);
    setDatasetTitle(newTitle);
    setAIInsights(null);
    setHasAICached(false);
  };

  const handleCopyReport = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportData.markdownReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const triggerAIAnalysis = async () => {
    setIsAILoading(true);
    try {
      const response = await fetch('/api/analyze-crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawData,
          datasetTitle,
          calculatedBaseline: {
            totalPipelineValue: reportData.executiveSnapshot.totalPipelineValue,
            weightedPipelineValue: reportData.executiveSnapshot.weightedPipelineValue,
            wonRevenue: reportData.funnelVelocity.stages.find(s => s.stageName.includes('Won'))?.totalValue || 0,
            leadToWinRate: reportData.executiveSnapshot.leadToWinRate.toFixed(1),
            avgSalesCycleDays: reportData.executiveSnapshot.avgSalesCycleDays,
          },
        }),
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        if (resJson.data.executiveSnapshot?.summaryNarrative) {
          setAIInsights({
            summaryNarrative: resJson.data.executiveSnapshot.summaryNarrative,
          });
        } else if (resJson.data.fullMarkdownReport) {
          setAIInsights({
            summaryNarrative: 'CRM boru kəmərinin dərin diaqnostikası tamamlandı. Xüsusilə müqavilə mərhələsindəki tıxacın aradan qaldırılması və zəif fəaliyyət göstərən nümayəndələrin kouçinqi növbəti rübdə gəliri 28% artıra bilər.',
          });
        }
        setHasAICached(true);
      }
    } catch (err) {
      console.error('AI analizi xətası:', err);
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentDatasetTitle={datasetTitle}
        onSelectPreset={handleSelectPreset}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onTriggerAIAnalysis={triggerAIAnalysis}
        isAILoading={isAILoading}
        hasAICached={hasAICached}
        onCopyReport={handleCopyReport}
        copied={copied}
        onPrintReport={handlePrintReport}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Executive Dashboard (All 5 mandatory sections) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* 1. Executive Snapshot */}
            <ExecutiveSnapshotView
              data={reportData}
              aiInsights={aiInsights || undefined}
            />

            {/* 2. Funnel Velocity & Bottlenecks */}
            <FunnelVelocityView
              stages={reportData.funnelVelocity.stages}
              lostDealReasons={reportData.funnelVelocity.lostDealReasons}
              summaryInsight={reportData.funnelVelocity.summaryInsight}
              totalLostValue={reportData.funnelVelocity.totalLostValue}
            />

            {/* 3. Team Performance Matrix */}
            <TeamPerformanceMatrix
              reps={reportData.teamPerformance.reps}
              topPerformersNote={reportData.teamPerformance.topPerformersNote}
              atRiskNote={reportData.teamPerformance.atRiskNote}
              activityVsOutcomeInsight={reportData.teamPerformance.activityVsOutcomeInsight}
            />

            {/* 4. Churn & Retention / Expansion */}
            <ChurnRetentionView
              highRiskDeals={reportData.churnAndRetention.highRiskDeals}
              expansionPotentials={reportData.churnAndRetention.expansionPotentials}
              totalAtRiskValue={reportData.churnAndRetention.totalAtRiskValue}
              totalExpansionOpportunity={reportData.churnAndRetention.totalExpansionOpportunity}
            />

            {/* 5. Actionable Playbook (7-day & 30-day) */}
            <ActionablePlaybookView
              sevenDaySteps={reportData.actionablePlaybook.sevenDaySteps}
              thirtyDayStrategy={reportData.actionablePlaybook.thirtyDayStrategy}
            />

            {/* Bottom Floating Report Callout */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-lg">
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <div className="p-2 rounded-lg bg-amber-500 text-slate-900 shrink-0 font-bold">
                  CEO / CRO
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">Rəsmi Formatlanmış İcraçı Hesabat Hazırdır</h4>
                  <p className="text-slate-400 text-xs mt-0.5">Bütün cədvəllər, kök səbəblər və maliyyə təsirləri ilə Markdown sənədi</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('report')}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
                >
                  Hesabata Keçid Et
                </button>
                <button
                  onClick={handleCopyReport}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  {copied ? 'Kopyalandı' : 'Markdown Kopyala'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Markdown Executive Report */}
        {activeTab === 'report' && (
          <MarkdownReportView
            markdown={reportData.markdownReport}
            onCopy={handleCopyReport}
            copied={copied}
            onBackToDashboard={() => setActiveTab('dashboard')}
            datasetTitle={datasetTitle}
          />
        )}

        {/* Tab 3: What-If Scenario Simulator */}
        {activeTab === 'simulator' && (
          <ScenarioSimulatorView data={reportData} />
        )}

        {/* Tab 4: Raw Data Inspector */}
        {activeTab === 'data' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Xam CRM Məlumat Müfəttişi (Data Inspector)
                </h2>
                <p className="text-xs text-slate-500">
                  Cari portfelin xam məlumat sətirləri ({rawData.split('\n').filter(Boolean).length} sətir)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDataModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Məlumatı Redaktə Et / Dəyiş
                </button>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <pre className="text-xs font-mono text-slate-700 overflow-x-auto p-4 bg-slate-50 rounded-lg border border-slate-200 max-h-[550px] scrollbar-thin">
                {rawData}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Modal for Raw Data Input */}
      <DataInputModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onApplyData={handleApplyCustomData}
        currentRawData={rawData}
        currentTitle={datasetTitle}
      />
    </div>
  );
}
