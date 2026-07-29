import React from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { BarChart2, TrendingUp, BookOpen, Award } from "lucide-react";
import StatCard from "../../../shared/components/StatCard";

const ResearchAnalytics = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Research Analytics"
        subtitle="Insights and trends for university research output."
        icon={BarChart2}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Publications" value="124" icon={BookOpen} trend="+14%" trendLabel="This Year" />
        <StatCard title="Patents Filed" value="18" icon={Award} trend="+2%" trendLabel="This Year" />
        <StatCard title="Total Citations" value="1,450" icon={TrendingUp} trend="+24%" trendLabel="This Year" />
        <StatCard title="H-Index Avg" value="12.4" icon={BarChart2} trend="+1.1" trendLabel="This Year" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Placeholder Chart 1 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-[300px]">
          <h3 className="font-semibold text-gray-900 mb-6">Publications by Month</h3>
          <div className="flex-grow flex items-end justify-between gap-2 pt-10">
            {/* Simple CSS Bar Chart Placeholder */}
            {[40, 70, 45, 90, 65, 80, 55, 100, 30, 50, 75, 85].map((height, i) => (
              <div key={i} className="w-full bg-indigo-50 rounded-t flex flex-col justify-end group">
                <div 
                  className="bg-indigo-500 rounded-t w-full transition-all duration-500 group-hover:bg-indigo-600"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-[10px] text-center mt-2 text-gray-500">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder Chart 2 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-[300px]">
          <h3 className="font-semibold text-gray-900 mb-6">Output by Department</h3>
          <div className="flex-grow space-y-4">
            {[
              { dept: "Computer Science", val: 85 },
              { dept: "Biotechnology", val: 65 },
              { dept: "Mechanical Eng", val: 45 },
              { dept: "Management", val: 30 },
              { dept: "Pharmacy", val: 25 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">{item.dept}</span>
                  <span className="text-gray-500">{item.val}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAnalytics;
