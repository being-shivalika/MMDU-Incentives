import React from "react";
import PageHeader from "../../shared/components/PageHeader";
import { BookOpen, FileText, Download, ShieldCheck } from "lucide-react";

const mockPolicies = [
  {
    id: 1,
    title: "University Research Incentive Policy 2024",
    category: "General",
    date: "10 Jan 2024",
    version: "2.1",
    description: "Comprehensive guidelines on incentive structures for publications, patents, and projects.",
  },
  {
    id: 2,
    title: "Intellectual Property Rights (IPR) Guidelines",
    category: "Patents & Copyrights",
    date: "05 Mar 2023",
    version: "1.4",
    description: "Procedures for filing patents, ownership rights, and university support mechanisms.",
  },
  {
    id: 3,
    title: "Journal Quality and Indexing Requirements",
    category: "Publications",
    date: "15 Aug 2023",
    version: "3.0",
    description: "Approved list of indexing databases (Scopus, Web of Science) and quality criteria for incentive eligibility.",
  },
  {
    id: 4,
    title: "Research Ethics and Integrity Framework",
    category: "Ethics",
    date: "20 Nov 2022",
    version: "1.0",
    description: "Plagiarism guidelines, ethical clearance for human/animal subjects, and conflict of interest policies.",
  },
];

const Policies = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-left">
      <PageHeader
        title="Research Policies & Guidelines"
        subtitle="Important documents, frameworks, and incentive structures."
        icon={BookOpen}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Important Notice Card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-neutral-50 rounded-2xl p-6 border border-neutral-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl text-neutral-950 border border-neutral-200 shrink-0 shadow-sm">
            <ShieldCheck size={22} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-neutral-950 text-base tracking-tight">Policy Update Notice</h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-medium">
              The University Research Incentive Policy has been updated for the academic year 2024-2025.
              Key changes include revised incentive slabs for Q1 journals and new support for student-led startups.
              Please review the latest document below.
            </p>
          </div>
        </div>

        {/* Policy Cards */}
        {mockPolicies.map((policy) => (
          <div 
            key={policy.id} 
            className="group bg-white rounded-xl p-6 shadow-sm border border-neutral-200 transition-all duration-200 hover:border-neutral-950 hover:shadow-md flex flex-col h-full justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="p-2 bg-neutral-50 rounded-lg text-neutral-600 border border-neutral-100">
                  <FileText size={18} />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded border border-neutral-200 uppercase tracking-wider">
                  v{policy.version}
                </span>
              </div>
              
              <h3 className="font-bold text-neutral-950 text-base mb-2 line-clamp-2 leading-snug">
                {policy.title}
              </h3>
              
              <p className="text-xs text-neutral-500 mb-6 leading-relaxed line-clamp-3">
                {policy.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Updated: {policy.date}
              </div>
              <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:text-neutral-600 transition-colors cursor-pointer">
                <Download size={14} />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Policies;