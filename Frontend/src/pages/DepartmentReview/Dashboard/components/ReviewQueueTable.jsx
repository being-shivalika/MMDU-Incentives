// import React from "react";
// import dayjs from "dayjs";
// import Badge from "../../../../components/Ui/Badge";
// import { ChevronRight } from "lucide-react";

// const ReviewQueueTable = ({ data = [], onRowClick }) => {
//   const getStatusBadge = (status) => {
//     if (!status) {
//       return <Badge variant="default">Unknown</Badge>;
//     }

//     if (status === "Approved") {
//       return <Badge variant="success">Approved</Badge>;
//     }

//     if (status === "Rejected") {
//       return <Badge variant="danger">Rejected</Badge>;
//     }

//     if (status === "Revision Requested") {
//       return <Badge variant="danger">Revision Requested</Badge>;
//     }

//     if (status.includes("Pending")) {
//       return <Badge variant="warning">{status}</Badge>;
//     }

//     return <Badge variant="default">{status}</Badge>;
//   };

//   const getCurrentLevelBadge = (level) => {
//     if (!level) return "-";

//     return (
//       <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
//         {level}
//       </span>
//     );
//   };

//   if (!data.length) {
//     return (
//       <div className="py-12 text-center text-gray-500">
//         No submissions available.
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
//       <table className="min-w-full divide-y divide-neutral-100 text-xs text-left font-medium">
//         <thead className="bg-neutral-50/80 text-neutral-500 uppercase font-bold tracking-wider text-[11px] border-b border-neutral-200/80">
//           <tr>
//             <th className="px-5 py-3.5">Submission</th>
//             <th className="px-5 py-3.5">Applicant</th>
//             <th className="px-5 py-3.5">Category & Subtype</th>
//             <th className="px-5 py-3.5">Current Stage</th>
//             <th className="px-5 py-3.5">Submitted Date</th>
//             <th className="px-5 py-3.5">Status</th>
//             <th className="px-5 py-3.5 text-center">Action</th>
//           </tr>
//         </thead>

//         <tbody className="divide-y divide-neutral-100 bg-white text-neutral-700">
//           {data.map((submission) => (
//             <tr
//               key={submission.id || submission._id}
//               onClick={() => onRowClick(submission)}
//               className="cursor-pointer hover:bg-blue-50/40 transition-colors group"
//             >
//               <td className="px-5 py-4">
//                 <p className="font-bold text-neutral-900 text-xs">
//                   {submission.claimNumber || submission.id}
//                 </p>
//                 <p className="text-[11px] text-neutral-500 font-medium mt-0.5 max-w-xs truncate" title={submission.title}>
//                   {submission.title}
//                 </p>
//               </td>

//               <td className="px-5 py-4">
//                 <p className="font-bold text-neutral-900">
//                   {submission.submittedBy ||
//                     submission.creatorName ||
//                     "Unknown Applicant"}
//                 </p>
//                 <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
//                   {submission.creatorDept || submission.department || "MMDU Department"}
//                 </p>
//               </td>

//               <td className="px-5 py-4">
//                 <p className="font-bold text-neutral-800 uppercase tracking-wide text-[11px]">
//                   {String(submission.category || "").replace(/_/g, " ")}
//                 </p>
//                 <p className="text-[11px] text-neutral-500 capitalize mt-0.5">
//                   {String(submission.subtype || "").replace(/_/g, " ")}
//                 </p>
//               </td>

//               <td className="px-5 py-4">
//                 {getCurrentLevelBadge(submission.currentLevel)}
//               </td>

//               <td className="px-5 py-4 whitespace-nowrap text-neutral-500 font-medium">
//                 {dayjs(submission.dateSubmitted || submission.createdAt).format("DD MMM YYYY")}
//               </td>

//               <td className="px-5 py-4 whitespace-nowrap">
//                 {getStatusBadge(submission.status)}
//               </td>

//               <td className="px-5 py-4 text-center whitespace-nowrap">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onRowClick(submission);
//                   }}
//                   className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-neutral-50 text-neutral-700 font-bold text-[11px] uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors cursor-pointer border border-neutral-200/80 group-hover:border-blue-600"
//                 >
//                   Review <ChevronRight className="ml-1 h-3.5 w-3.5" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ReviewQueueTable;
import React from "react";
import dayjs from "dayjs";
import Badge from "../../../../components/Ui/Badge";
import { ChevronRight } from "lucide-react";

const ReviewQueueTable = ({ data = [], onRowClick }) => {
  const getStatusBadge = (status) => {
    if (!status) {
      return <Badge variant="default">Unknown</Badge>;
    }

    if (status === "Approved") {
      return <Badge variant="success">Approved</Badge>;
    }

    if (status === "Rejected") {
      return <Badge variant="danger">Rejected</Badge>;
    }

    if (status === "Revision Requested") {
      return <Badge variant="danger">Revision Requested</Badge>;
    }

    if (status.includes("Pending")) {
      return <Badge variant="warning">{status}</Badge>;
    }

    return <Badge variant="default">{status}</Badge>;
  };

  const getCurrentLevelBadge = (level) => {
    if (!level) return "-";

    return (
      <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium whitespace-nowrap">
        {level}
      </span>
    );
  };

  if (!data.length) {
    return (
      <div className="py-12 text-center text-gray-500">
        No submissions available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 bg-white shadow-sm w-full">
      <table className="min-w-full divide-y divide-neutral-100 text-xs text-left font-medium table-auto">
        <thead className="bg-neutral-50/80 text-neutral-500 uppercase font-bold tracking-wider text-[11px] border-b border-neutral-200/80">
          <tr>
            <th className="px-3 py-3.5">Submission</th>
            <th className="px-3 py-3.5">Applicant</th>
            <th className="px-3 py-3.5">Category & Subtype</th>
            <th className="px-3 py-3.5 whitespace-nowrap">Current Stage</th>
            <th className="px-3 py-3.5">Submitted Date</th>
            <th className="px-3 py-3.5">Status</th>
            <th className="px-3 py-3.5 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-100 bg-white text-neutral-700">
          {data.map((submission) => (
            <tr
              key={submission.id || submission._id}
              onClick={() => onRowClick(submission)}
              className="cursor-pointer hover:bg-blue-50/40 transition-colors group"
            >
              <td className="px-3 py-3.5">
                <p className="font-bold text-neutral-900 text-xs whitespace-nowrap">
                  {submission.claimNumber || submission.id}
                </p>
                <p className="text-[11px] text-neutral-500 font-medium mt-0.5 max-w-[160px] truncate" title={submission.title}>
                  {submission.title}
                </p>
              </td>

              <td className="px-3 py-3.5">
                <p className="font-bold text-neutral-900 whitespace-nowrap">
                  {submission.submittedBy ||
                    submission.creatorName ||
                    "Unknown Applicant"}
                </p>
                <p className="text-[11px] text-neutral-500 font-medium mt-0.5 min-w-[120px]">
                  {submission.creatorDept || submission.department || "MMDU Department"}
                </p>
              </td>

              <td className="px-3 py-3.5">
                <p className="font-bold text-neutral-800 uppercase tracking-wide text-[11px] min-w-[140px]">
                  {String(submission.category || "").replace(/_/g, " ")}
                </p>
                <p className="text-[11px] text-neutral-500 capitalize mt-0.5">
                  {String(submission.subtype || "").replace(/_/g, " ")}
                </p>
              </td>

              <td className="px-3 py-3.5">
                {getCurrentLevelBadge(submission.currentLevel)}
              </td>

              <td className="px-3 py-3.5 whitespace-nowrap text-neutral-500 font-medium">
                {dayjs(submission.dateSubmitted || submission.createdAt).format("DD MMM YYYY")}
              </td>

              <td className="px-3 py-3.5 whitespace-nowrap">
                {getStatusBadge(submission.status)}
              </td>

              <td className="px-3 py-3.5 text-center whitespace-nowrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRowClick(submission);
                  }}
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-neutral-50 text-neutral-700 font-bold text-[11px] uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors cursor-pointer border border-neutral-200/80 group-hover:border-blue-600"
                >
                  Review <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewQueueTable;