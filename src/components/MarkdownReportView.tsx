import React from 'react';
import { Copy, Check, Download, Printer, FileText, ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';

interface MarkdownReportViewProps {
  markdown: string;
  onCopy: () => void;
  copied: boolean;
  onBackToDashboard: () => void;
  datasetTitle: string;
}

export const MarkdownReportView: React.FC<MarkdownReportViewProps> = ({
  markdown,
  onCopy,
  copied,
  onBackToDashboard,
  datasetTitle,
}) => {
  const downloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `Executive_CRM_Health_Report_${datasetTitle.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="İdarəetmə Panelinə Qayıt"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Rəsmi İcraçı Hesabatı (Executive Markdown Document)
            </h2>
            <p className="text-xs text-slate-500">
              CEO & Satış Direktoru iclasları üçün tam formatlanmış Markdown sənədi
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Kopyalandı' : 'Kopyala'}
          </button>

          <button
            onClick={downloadMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            .MD Yüklə
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
            title="Çap et"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Styled Markdown Reader */}
      <article className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm text-slate-800 leading-relaxed font-sans prose prose-slate max-w-none print:shadow-none print:border-none print:p-0">
        <div className="markdown-body">
          <Markdown>{markdown}</Markdown>
        </div>
      </article>
    </div>
  );
};
