import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Edit2, ArrowRight } from "lucide-react";
import dayjs from "dayjs";

export const Drafts = () => {
  const { user, submissions } = useAuth();
  const navigate = useNavigate();

  // Filter drafts by this faculty/student
  const myDrafts = submissions.filter(s => s.creatorId === user?.id && s.status === "draft");

  const columns = [
    {
      accessorKey: "title",
      header: "Draft Title",
      cell: ({ row }) => (
        <span className="font-semibold text-brand-gray-900 line-clamp-1 block">
          {row.original.title || "Untitled Draft"}
        </span>
      )
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span className="uppercase text-brand-gray-500 font-bold">{row.original.category || "Unassigned"}</span>
    },
    {
      accessorKey: "dateUpdated",
      header: "Last Saved",
      cell: ({ row }) => {
        const lastStep = row.original.approvalHistory?.[row.original.approvalHistory.length - 1];
        return lastStep?.date ? dayjs(lastStep.date).format("MMM DD, YYYY hh:mm A") : "--";
      }
    },
    {
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/submissions/submit", { state: { claim: row.original } });
          }}
          className="h-8 text-xs font-semibold flex items-center gap-1 border-brand-gray-200"
        >
          <Edit2 className="h-3 w-3" />
          Resume
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl font-bold text-brand-gray-900 m-0">My Saved Drafts</h1>
        <p className="text-xs text-brand-gray-500 mt-1">
          Resume unfinished research claims from your local drafts folder.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Drafts ({myDrafts.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={myDrafts}
            searchKey="title"
            searchPlaceholder="Search drafts..."
            onRowClick={(row) => navigate("/submissions/submit", { state: { claim: row } })}
          />
        </CardContent>
      </Card>
    </div>
  );
};
