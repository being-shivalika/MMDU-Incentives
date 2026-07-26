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
    <div className="space-y-6">
      <PageHeader
        title="Research Policies & Guidelines"
        subtitle="Important documents, frameworks, and incentive structures."
        icon={BookOpen}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Important Notice Card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-indigo-50 rounded-xl p-6 border border-indigo-100 flex items-start gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-700 shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900 text-lg">Policy Update Notice</h3>
            <p className="text-indigo-700 mt-1">
              The University Research Incentive Policy has been updated for the academic year 2024-2025.
              Key changes include revised incentive slabs for Q1 journals and new support for student-led startups.
              Please review the latest document below.
            </p>
          </div>
        </div>

        {/* Policy Cards */}
        {mockPolicies.map((policy) => (
          <div key={policy.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                <FileText size={20} />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                v{policy.version}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{policy.title}</h3>
            
            <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-3">
              {policy.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-400">
                Updated: {policy.date}
              </div>
              <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                <Download size={16} />
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
