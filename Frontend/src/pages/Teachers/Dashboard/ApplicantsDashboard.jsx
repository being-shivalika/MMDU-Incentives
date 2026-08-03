import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/Ui/Card";
import Badge from "../../../components/Ui/Badge";
import { LineChart } from "../../../components/charts/DashboardCharts";
import { FileText, ArrowRight, HelpCircle, Inbox } from "lucide-react";
import dayjs from "dayjs";
import StatsRow from "./components/StatsRow";
import WelcomeHero from "./components/WelcomeHero";
import { getSubmissions } from "../../../services/submissionService";

const ApplicantsDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const circulars = [];

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await getSubmissions();
        setSubmissions(res.data || res.claims || []);
      } catch (err) {
        console.error("Failed to load submissions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const mySubmissions = submissions;

  const isApproved = (s) => {
    const st = (s?.status || "").toLowerCase();
    const ost = (s?.originalStatus || "").toLowerCase();
    return st === "approved" || st === "released" || st === "completed" || ost === "completed";
  };

  const isPending = (s) => {
    const st = (s?.status || "").toLowerCase();
    const ost = (s?.originalStatus || "").toLowerCase();
    return st.includes("pending") || ost === "department_review" || ost === "rpc_verification" || ost === "accounts_processing";
  };

  const isReturned = (s) => {
    const st = (s?.status || "").toLowerCase();
    const ost = (s?.originalStatus || "").toLowerCase();
    return st.includes("return") || st.includes("revision") || ost === "returned";
  };

  const pending = mySubmissions.filter(isPending);
  const approved = mySubmissions.filter(isApproved);
  const returned = mySubmissions.filter(isReturned);

  const isPaidClaim = (s) => {
    const status = (s?.status || "").toLowerCase();
    const paymentStatus = (s?.paymentStatus || "").toLowerCase();
    return (s?.isPaid === true || paymentStatus === "paid" || status === "released") && !s?.isHeld;
  };

  const isPendingPaymentClaim = (s) => {
    return !isPaidClaim(s) && !s?.isHeld;
  };

  const totalReleasedIncentive = mySubmissions
    .filter(isPaidClaim)
    .reduce(
      (acc, s) =>
        acc +
        Number(s.userShare || s.individualShare || s.approvedAmount || s.totalIncentive || s.incentiveAmount || 0),
      0,
    );

  const totalProcessingIncentive = mySubmissions
    .filter(isPendingPaymentClaim)
    .reduce(
      (acc, s) =>
        acc +
        Number(s.userShare || s.individualShare || s.approvedAmount || s.totalIncentive || s.incentiveAmount || 0),
      0,
    );

  const chartData = [
    { label: "Feb", value: 1 },
    { label: "Mar", value: 0 },
    { label: "Apr", value: 2 },
    { label: "May", value: 1 },
    { label: "Jun", value: 4 },
    {
      label: "Jul",
      value: mySubmissions.filter(
        (s) => (s?.status || "").toLowerCase() !== "draft" && (s?.originalStatus || "").toLowerCase() !== "draft",
      ).length,
    },
  ];

  const getStatusBadge = (status = "") => {
    const safe = String(status).toLowerCase();
    if (safe === "approved" || safe === "released" || safe === "completed") {
      return <Badge variant="success">Completed & Disbursed</Badge>;
    }
    if (safe.includes("hod")) {
      return <Badge variant="warning">HOD Review</Badge>;
    }
    if (safe.includes("rpc") || safe.includes("r & d")) {
      return <Badge variant="info">RPC Verification</Badge>;
    }
    if (safe.includes("accounts") || safe.includes("finance")) {
      return <Badge variant="purple">Accounts Release</Badge>;
    }
    if (safe.includes("pending")) {
      return <Badge variant="warning">Under Review</Badge>;
    }
    if (safe.includes("return") || safe.includes("revision")) {
      return <Badge variant="danger">Returned</Badge>;
    }
    if (safe.includes("reject")) {
      return <Badge variant="danger">Rejected</Badge>;
    }
    if (safe.includes("draft")) {
      return <Badge variant="default">Draft</Badge>;
    }
    return <Badge variant="default">{status?.replace(/_/g, " ")}</Badge>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-left">
      {/* Welcome Hero Section */}
      <WelcomeHero
        userName={user?.name}
        userDesignation={user?.designation}
        userDepartment={user?.department}
        onNewClaim={() => navigate("/applicant/submissions/create/publication")}
      />

      {/* Stats Overview */}
      <StatsRow
        mySubmissionsCount={mySubmissions.length}
        pendingCount={pending.length}
        approvedCount={approved.length}
        returnedCount={returned.length}
        totalReleasedIncentive={totalReleasedIncentive}
        totalProcessingIncentive={totalProcessingIncentive}
      />

      {/* Charts & Circulars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
            My Research Submissions Output Trend
          </h2>
          <div className="h-60 flex items-center justify-center p-2">
            <LineChart data={chartData} />
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm">
          <div className="border-b border-neutral-100 pb-3 mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              University Research Bulletins
            </h2>
          </div>

          <div className="overflow-y-auto max-h-48 flex-1 space-y-2">
            {circulars.length === 0 ? (
              <div className="py-8 text-xs text-neutral-400 text-center font-medium">
                No announcements available
              </div>
            ) : (
              circulars.slice(0, 4).map((circ) => (
                <div key={circ.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase">
                    <span>{circ.category}</span>
                    <span>{dayjs(circ.date).format("MMM DD")}</span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900">{circ.title}</h4>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 mt-3 border-t border-neutral-100 text-center">
            <Link
              to="/policies"
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 flex justify-center items-center gap-1.5 transition-colors"
            >
              View Policies
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Submissions Ledger & Policies Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              Recent Research Submissions
            </h2>
            <Link
              to="/applicant/submissions"
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors"
            >
              See Ledger
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 uppercase font-bold tracking-wider">
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {mySubmissions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-neutral-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Inbox className="h-6 w-6 text-neutral-300" />
                        <span className="text-xs font-medium">No submissions yet</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  mySubmissions.slice(0, 5).map((claim, idx) => (
                    <tr key={claim._id || claim.id || idx} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 font-semibold text-neutral-700 uppercase">
                        {String(claim.category || "").replace(/_/g, " ")}
                      </td>
                      <td className="py-3 font-bold text-neutral-950 max-w-[240px] truncate">{claim.title}</td>
                      <td className="py-3 text-neutral-500 font-medium">
                        {dayjs(claim.submissionDate || claim.createdAt || claim.dateSubmitted).format("MMM DD YYYY")}
                      </td>
                      <td className="py-3">{getStatusBadge(claim.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex gap-2 items-center text-neutral-950 pb-3 border-b border-neutral-100">
              <HelpCircle className="h-5 w-5 text-neutral-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Incentive Guidelines</h2>
            </div>

            <div className="text-xs mt-4 space-y-3 text-neutral-600 font-medium leading-relaxed">
              <p className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />
                <span><strong className="text-neutral-900">Journals:</strong> SCI/SCIE indexed publications</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />
                <span><strong className="text-neutral-900">Patents:</strong> Verified granted patents</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />
                <span><strong className="text-neutral-900">Startups:</strong> Incubated entities</span>
              </p>
            </div>
          </div>

          <Link 
            to="/policies" 
            className="block mt-6 pt-4 border-t border-neutral-100 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:text-neutral-600 transition-colors text-center"
          >
            Read Policy Document &rarr;
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantsDashboard;