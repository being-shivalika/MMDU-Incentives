import React from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { Megaphone, Plus, Trash2 } from "lucide-react";

const mockCirculars = [
  { id: 1, title: "Revision of Incentive Rates for Q1 Journals", date: "20 Jul 2024", audience: "All Faculty", active: true },
  { id: 2, title: "Submission Deadline for Patent Claims 2023-24", date: "15 Jun 2024", audience: "HODs, Faculty", active: true },
  { id: 3, title: "System Maintenance Scheduled for 1st Aug", date: "25 Jul 2024", audience: "All Users", active: true },
];

const Circulars = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Circulars & Notifications"
        subtitle="Broadcast important updates to users across the portal."
        icon={Megaphone}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-gray-900">Active Circulars</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus size={16} /> New Circular
          </button>
        </div>

        <div className="space-y-4">
          {mockCirculars.map((circular) => (
            <div key={circular.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:border-indigo-100 hover:shadow-sm transition-all group">
              <div>
                <h4 className="font-medium text-gray-900">{circular.title}</h4>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>Published: {circular.date}</span>
                  <span>Target: {circular.audience}</span>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Circulars;
