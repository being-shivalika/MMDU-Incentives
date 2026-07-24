import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/Ui/Card";
import Badge from "../../../components/Ui/Badge";
import { LineChart } from "../../../components/charts/DashboardCharts";
import { FileText, ArrowRight, HelpCircle } from "lucide-react";
import dayjs from "dayjs";
import StatsRow from "./components/StatsRow";
import WelcomeHero from "./components/WelcomeHero";

const ApplicantsDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Temporary fallback until backend APIs are connected
  const submissions = [];
  const circulars = [];

  // User submissions
  const mySubmissions = submissions.filter((s) => s.creatorId === user?._id);

  const drafts = mySubmissions.filter((s) => s.status === "draft");

  const pending = mySubmissions.filter((s) =>
    ["pending_hod", "pending_rpc", "pending_accounts"].includes(s.status),
  );

  const approved = mySubmissions.filter((s) =>
    ["released", "approved"].includes(s.status),
  );

  const returned = mySubmissions.filter((s) =>
    ["returned_hod", "returned_rpc"].includes(s.status),
  );

  const totalReleasedIncentive = mySubmissions
    .filter((s) => s.status === "released")
    .reduce((acc, s) => acc + (s.incentiveAmount || 0), 0);

  const totalProcessingIncentive = mySubmissions
    .filter((s) => s.status === "pending_accounts")
    .reduce((acc, s) => acc + (s.incentiveAmount || 0), 0);

  const chartData = [
    { label: "Feb", value: 1 },
    { label: "Mar", value: 0 },
    { label: "Apr", value: 2 },
    { label: "May", value: 1 },
    { label: "Jun", value: 4 },
    {
      label: "Jul",
      value: mySubmissions.filter((s) => s.status !== "draft").length,
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "released":
        return <Badge variant="success">Disbursed</Badge>;

      case "pending_hod":
        return <Badge variant="warning">HOD Review</Badge>;

      case "pending_rpc":
        return <Badge variant="info">RPC Verification</Badge>;

      case "pending_accounts":
        return <Badge variant="purple">Accounts Release</Badge>;

      case "returned_hod":
      case "returned_rpc":
        return <Badge variant="danger">Returned</Badge>;

      case "draft":
        return <Badge variant="default">Draft</Badge>;

      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-left">
      <WelcomeHero
        userName={user?.name}
        userDesignation={user?.designation}
        userDepartment={user?.department}
        onNewClaim={() => navigate("/teacher/submission/publication")}
      />

      <StatsRow
        mySubmissionsCount={mySubmissions.length}
        pendingCount={pending.length}
        approvedCount={approved.length}
        returnedCount={returned.length}
        totalReleasedIncentive={totalReleasedIncentive}
        totalProcessingIncentive={totalProcessingIncentive}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h1>My Research Submissions Output Trend</h1>

          <div className="h-56 flex items-center justify-center p-4">
            <LineChart data={chartData} />
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="border-b border-brand-gray-100">
            <h2>University Research Bulletins</h2>
          </div>

          <div className="p-0 overflow-y-auto max-h-48 flex-1">
            {circulars.length === 0 ? (
              <div className="p-5 text-sm text-gray-400 text-center">
                No announcements available
              </div>
            ) : (
              circulars.slice(0, 4).map((circ) => (
                <div key={circ.id} className="p-3 border-b">
                  <div className="flex justify-between">
                    <span>{circ.category}</span>

                    <span>{dayjs(circ.date).format("MMM DD")}</span>
                  </div>

                  <h4>{circ.title}</h4>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t text-center">
            <Link
              to="/policies"
              className="text-xs font-bold uppercase flex justify-center gap-1"
            >
              View Policies
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between">
            <h1>Recent Research Submissions</h1>

            <Link
              to="/teacher/submissions"
              className="text-xs font-bold uppercase"
            >
              See Ledger
            </Link>
          </div>

          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th>Category</th>

                <th>Title</th>

                <th>Date</th>

                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {mySubmissions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-400">
                    No submissions yet
                  </td>
                </tr>
              ) : (
                mySubmissions.slice(0, 3).map((claim) => (
                  <tr key={claim.id}>
                    <td>{claim.category}</td>

                    <td>{claim.title}</td>

                    <td>{dayjs(claim.dateSubmitted).format("MMM DD YYYY")}</td>

                    <td>{getStatusBadge(claim.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>

        <Card>
          <div className="flex gap-2 items-center">
            <HelpCircle />

            <span>Incentive Policy Guidelines</span>
          </div>

          <div className="text-sm mt-4 space-y-3">
            <p>• Journals: SCI/SCIE indexed publications</p>

            <p>• Patents: Verified granted patents</p>

            <p>• Startups: Incubated entities</p>
          </div>

          <Link to="/policies" className="block mt-5 text-xs font-bold">
            Read Policy Document
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantsDashboard;
