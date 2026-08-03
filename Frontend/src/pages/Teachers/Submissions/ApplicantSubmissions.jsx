import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SubmissionCard from "../../../components/Ui/SubmissionCard";
import { getSubmissions } from "../../../services/submissionService";
import {
  Plus,
  FileText,
  Inbox,
  ChevronDown,
  BookOpen,
  Layers,
  Award,
  Copyright as CopyrightIcon,
  Rocket,
} from "lucide-react";

const ApplicantSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const response = await getSubmissions();
        setSubmissions(response.data || response.claims || []);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = (submission) => {
    navigate(`/applicant/submissions/${submission._id || submission.id}`);
  };

  const submissionTypes = [
    {
      label: "Journal Publication",
      path: "/applicant/submissions/create/publication",
      icon: BookOpen,
    },
    {
      label: "Conference / Seminar",
      path: "/applicant/submissions/create/conference",
      icon: FileText,
    },
    {
      label: "Books & Chapters",
      path: "/applicant/submissions/create/book",
      icon: Layers,
    },
    {
      label: "Patent",
      path: "/applicant/submissions/create/patent",
      icon: Award,
    },
    {
      label: "Copyright",
      path: "/applicant/submissions/create/copyright",
      icon: CopyrightIcon,
    },
    {
      label: "Startup",
      path: "/applicant/submissions/create/startup",
      icon: Rocket,
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-left">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-neutral-100 rounded-lg text-neutral-800">
              <FileText className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              My Submissions
            </h1>
          </div>
          <p className="text-sm text-neutral-500 font-medium">
            Track, manage, and review the status of your research incentive
            claims.
          </p>
        </div>

        {/* DROPDOWN CONTAINER */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-900 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create New Submission
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* DROPDOWN MENU */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 mb-1">
                Select Claim Category
              </div>
              {submissionTypes.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(item.path);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-colors text-left cursor-pointer"
                  >
                    <IconComponent className="h-4 w-4 text-neutral-500" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC CONTENT AREA */}
      {loading ? (
        /* PREMIUM SKELETON LOADER */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-xl bg-neutral-50 border border-neutral-200 animate-pulse flex flex-col p-5 justify-between"
            >
              <div className="space-y-3">
                <div className="h-4 w-24 bg-neutral-200 rounded"></div>
                <div className="h-6 w-full bg-neutral-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-neutral-200/60 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : submissions.length === 0 ? (
        /* BEAUTIFUL EMPTY STATE */
        <div className="flex flex-col justify-center items-center h-[45vh] bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
          <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center border border-neutral-200 mb-4 shadow-sm">
            <Inbox className="h-6 w-6 text-neutral-400" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-1">
            No submissions found
          </h3>
          <p className="text-sm text-neutral-500 max-w-sm mb-6 leading-relaxed">
            You haven't logged any research incentive claims yet. Get started by
            creating a new submission.
          </p>
          <button
            onClick={() => navigate("/applicant/submissions/create")}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white rounded-xl hover:bg-neutral-900 transition-colors shadow-sm cursor-pointer"
          >
            Create First Submission
          </button>
        </div>
      ) : (
        /* SUBMISSIONS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission, idx) => (
            <div
              key={submission._id || submission.id || idx}
              className="transition-transform duration-200 hover:-translate-y-1"
            >
              <SubmissionCard
                submission={submission}
                onClick={handleCardClick}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantSubmissions;
