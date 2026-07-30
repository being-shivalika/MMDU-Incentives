import React from "react";
import PageHeader from "../../shared/components/PageHeader";
import { BookOpen, Download, FileText, ExternalLink, ShieldCheck } from "lucide-react";

const Policies = () => {
  const pdfUrl = "/Research_Promotion_Policy_3.0.pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "MMDU_Research_Promotion_Policy_3.0.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] max-w-7xl mx-auto p-4 md:p-6 space-y-6 text-left pb-24">
      {/* HEADER */}
      <PageHeader
        title="MMDU Research Promotion Policy 3.0"
        subtitle="Official Maharishi Markandeshwar (Deemed to be University) Research & Incentive Policy Guidelines"
        icon={BookOpen}
      />

      {/* TOP ACTION BAR */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 md:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-neutral-900">Research Promotion Policy 3.0</h2>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200/80">
                Official Active Policy
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              Comprehensive guidelines on incentive structures for publications, patents, projects, and consultancy.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors flex items-center gap-2"
          >
            <ExternalLink size={14} />
            Open in New Tab
          </a>
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} />
            Download PDF
          </button>
        </div>
      </div>

      {/* PDF VIEWER CONTAINER */}
      <div className="w-full bg-neutral-900 rounded-2xl border border-neutral-300 shadow-xl overflow-hidden flex flex-col h-[750px] md:h-[880px]">
        <div className="bg-neutral-800 text-neutral-200 px-4 py-3 border-b border-neutral-700 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-400" />
            <span>Document Viewer — Research Promotion Policy 3.0</span>
          </div>
          <span className="text-neutral-400 text-[11px] hidden sm:inline">
            Maharishi Markandeshwar (Deemed to be University)
          </span>
        </div>

        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
          title="MMDU Research Promotion Policy 3.0"
          className="w-full flex-1 border-none"
        />
      </div>

      {/* STICKY FLOATING DOWNLOAD BUTTON (BOTTOM RIGHT) */}
      <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          type="button"
          onClick={handleDownload}
          className="group flex items-center gap-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-5 py-3.5 rounded-full shadow-2xl border border-neutral-800 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Download size={16} className="text-blue-400 group-hover:animate-bounce" />
          <span>Download Policy PDF</span>
        </button>
      </div>
    </div>
  );
};

export default Policies;