import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Card from "../components/Ui/Card";
import { DataTable } from "../components/Ui/DataTables";
import Badge from "../components/Ui/Badge";
import { Drawer } from "../components/Ui/Drawer";
import { Timeline } from "../components/Ui/Timeline";
import Button from "../components/Ui/Button";
import { FileText, Download, Edit3, ArrowRight } from "lucide-react";
import dayjs from "dayjs";

export const MySubmissions = () => {
  const { user, submissions } = useAuth();
  const navigate = useNavigate();
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Filter submissions by this faculty/student
  const myClaims = submissions.filter(
    (s) => s.creatorId === user?.id && s.status !== "draft",
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "released":
        return <Badge variant="success">Released</Badge>;
      case "pending_hod":
        return <Badge variant="warning">Pending HOD</Badge>;
      case "pending_rpc":
        return <Badge variant="info">Pending RPC</Badge>;
      case "pending_accounts":
        return <Badge variant="purple">Pending Accounts</Badge>;
      case "returned_hod":
        return <Badge variant="danger">Returned by HOD</Badge>;
      case "returned_rpc":
        return <Badge variant="danger">Returned by RPC</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Subject Research Title",
      cell: ({ row }) => (
        <span className="font-semibold text-brand-gray-900 line-clamp-1 block">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="uppercase text-brand-gray-500 font-bold">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: "dateSubmitted",
      header: "Submitted On",
      cell: ({ row }) =>
        dayjs(row.original.dateSubmitted).format("MMM DD, YYYY"),
    },
    {
      accessorKey: "incentiveAmount",
      header: "Incentive Paid",
      cell: ({ row }) => (
        <span className="font-bold text-emerald-800">
          {row.original.incentiveAmount > 0
            ? `$${row.original.incentiveAmount}`
            : "--"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Workflow Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
  ];

  const handleEditAndResubmit = (claim) => {
    setSelectedClaim(null);
    navigate("/submissions/submit", { state: { claim } });
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl font-bold text-brand-gray-900 m-0">
          My Submissions Ledger
        </h1>
        <p className="text-xs text-brand-gray-500 mt-1">
          Review, track, or edit active research claim submissions and disburse
          metrics.
        </p>
      </div>

      <Card>
        <div className="flex justify-between items-center gap-4 ">
          <h1>Research Incentive Submissions Ledger</h1>
          <Button
            size="sm"
            onClick={() => navigate("/submissions/submit")}
            className="h-9 text-xs font-semibold"
          >
            Create New Claim
          </Button>
        </div>
        <div className="p-0">
          <DataTable
            columns={columns}
            data={myClaims}
            searchKey="title"
            searchPlaceholder="Search by title..."
            onRowClick={(row) => setSelectedClaim(row)}
            exportPlaceholder={true}
          />
        </div>
      </Card>

      {/* DETAIL OVERLAY DRAWER */}
      <Drawer
        isOpen={!!selectedClaim}
        onClose={() => setSelectedClaim(null)}
        title="Research Claim Workspace Details"
        size="lg"
        footer={
          <div className="flex justify-between items-center w-full">
            <span className="text-xs text-brand-gray-400">
              Claim ID: {selectedClaim?.id}
            </span>
            <div className="flex gap-2">
              {["returned_hod", "returned_rpc"].includes(
                selectedClaim?.status,
              ) && (
                <Button
                  variant="primary"
                  onClick={() => handleEditAndResubmit(selectedClaim)}
                  className="h-10 text-xs font-bold flex items-center gap-1.5"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit & Resubmit Claim
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setSelectedClaim(null)}
                className="h-10 text-xs font-semibold"
              >
                Close Detail
              </Button>
            </div>
          </div>
        }
      >
        {selectedClaim && (
          <div className="space-y-6 text-left">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="uppercase text-[10px] font-bold text-brand-gray-400 bg-brand-gray-100 px-2 py-0.5 rounded">
                  {selectedClaim.category}
                </span>
                {getStatusBadge(selectedClaim.status)}
              </div>
              <h3 className="text-base font-bold text-brand-gray-900 m-0 leading-snug">
                {selectedClaim.title}
              </h3>
              <p className="text-xs text-brand-gray-500 mt-2">
                Created:{" "}
                {dayjs(selectedClaim.dateSubmitted).format(
                  "MMM DD, YYYY hh:mm A",
                )}{" "}
                &bull; Domain: {selectedClaim.fields?.researchDomain || "N/A"}
              </p>
            </div>

            {/* If returned, show prominent warning banner with the reason */}
            {["returned_hod", "returned_rpc"].includes(
              selectedClaim.status,
            ) && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded p-4 text-xs space-y-2">
                <span className="font-bold flex items-center gap-1.5 uppercase text-[10px] tracking-wider text-rose-900">
                  ⚠️ Action Required: Returned for Changes
                </span>
                <p className="m-0 text-brand-gray-700 font-medium">
                  The reviewer has returned this submission. Review the comment
                  below, edit the necessary values or attachments, and resubmit
                  it.
                </p>
              </div>
            )}

            <hr className="border-brand-gray-200" />

            {/* Submission specific metadata */}
            <div>
              <h4 className="text-xs font-bold text-brand-gray-800 uppercase tracking-wider mb-2">
                Submitted Field Values
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-brand-gray-50/50 p-4 border border-brand-gray-200 rounded text-xs">
                {Object.entries(selectedClaim.fields || {}).map(
                  ([key, value]) => {
                    if (
                      typeof value === "object" ||
                      key.endsWith("Url") ||
                      key.endsWith("Link") ||
                      key === "doi" ||
                      key === "website"
                    )
                      return null;
                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());
                    return (
                      <div key={key} className="space-y-0.5">
                        <span className="font-semibold text-brand-gray-400 block">
                          {label}
                        </span>
                        <span className="font-bold text-brand-gray-800">
                          {value || "N/A"}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Verification Links */}
            <div>
              <h4 className="text-xs font-bold text-brand-gray-800 uppercase tracking-wider mb-2">
                Verification Links
              </h4>
              <div className="space-y-2">
                {Object.entries(selectedClaim.fields || {}).filter(
                  ([key, val]) =>
                    (key.endsWith("Url") ||
                      key.endsWith("Link") ||
                      key === "doi" ||
                      key === "website") &&
                    val,
                ).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedClaim.fields || {})
                      .filter(
                        ([key, val]) =>
                          (key.endsWith("Url") ||
                            key.endsWith("Link") ||
                            key === "doi" ||
                            key === "website") &&
                          val,
                      )
                      .map(([key, val]) => {
                        const label = key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase());
                        return (
                          <div
                            key={key}
                            className="flex justify-between items-center border border-brand-gray-200 rounded p-2 bg-white shadow-sm font-semibold text-brand-gray-700"
                          >
                            <span className="text-[10px] text-brand-gray-400 font-bold uppercase">
                              {label}
                            </span>
                            <a
                              href={val}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black font-bold underline hover:text-brand-gray-700 truncate max-w-[200px]"
                            >
                              Open Link
                            </a>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-xs text-brand-gray-400 italic">
                    No verification links provided.
                  </p>
                )}
              </div>
            </div>

            {/* Approval progress timeline */}
            <div>
              <h4 className="text-xs font-bold text-brand-gray-800 uppercase tracking-wider mb-4">
                Workflow Status Timeline
              </h4>
              <Timeline history={selectedClaim.approvalHistory} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
