import React, { useState, useEffect } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { Megaphone, Plus, Trash2, CheckCircle2, X, AlertCircle, RefreshCw } from "lucide-react";
import { getCirculars, createCircular, deleteCircular, toggleCircularActive } from "../../../services/adminService";

const AUDIENCE_OPTIONS = ["All Users", "Faculty & HODs", "R&D & RPC Cell", "Accounts & Finance", "Students Only"];

const Circulars = () => {
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audience: "All Users",
    category: "ANNOUNCEMENT",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchCircularsList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCirculars();
      if (res?.data) {
        setCirculars(res.data);
      } else if (Array.isArray(res)) {
        setCirculars(res);
      } else {
        setCirculars([]);
      }
    } catch (err) {
      console.error("Error loading circulars:", err);
      setError(err.message || "Failed to load circulars.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCircularsList();
  }, []);

  const handleCreateCircular = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    if (!formData.title.trim()) {
      setFormError("Circular title is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      await createCircular({
        title: formData.title.trim(),
        content: formData.content.trim(),
        audience: formData.audience,
        category: formData.category,
      });

      setSuccessMessage(`New circular "${formData.title}" published successfully!`);
      setIsModalOpen(false);
      setFormData({ title: "", content: "", audience: "All Users", category: "ANNOUNCEMENT" });
      await fetchCircularsList();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Error creating circular:", err);
      setFormError(err.message || "Failed to create circular bulletin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCircular = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the circular "${title}"?`)) return;

    try {
      await deleteCircular(id);
      setSuccessMessage(`Circular "${title}" deleted.`);
      await fetchCircularsList();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to delete circular.");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleCircularActive(id);
      await fetchCircularsList();
    } catch (err) {
      alert(err.message || "Failed to update circular status.");
    }
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Circulars & Bulletins"
        subtitle="Broadcast announcements and policy updates to users across the portal."
        icon={Megaphone}
      />

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage("")} className="text-emerald-700 hover:text-emerald-900">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">Active Bulletins & Announcements</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Circulars published here appear on user dashboards in real time.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCircularsList}
              className="p-2.5 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-xl text-neutral-600 transition-colors cursor-pointer"
              title="Refresh circulars"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={() => {
                setFormError("");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#8C0404] hover:bg-[#6F0303] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Plus size={16} /> New Circular
            </button>
          </div>
        </div>

        {/* Circulars List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-8 text-center text-xs text-neutral-400">Loading circulars from database...</div>
          ) : error ? (
            <div className="py-8 text-center text-xs text-rose-600 font-semibold">{error}</div>
          ) : circulars.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              No active circulars published. Click "New Circular" to broadcast a bulletin.
            </div>
          ) : (
            circulars.map((circular) => (
              <div
                key={circular._id || circular.id}
                className="flex justify-between items-center p-4 border border-neutral-200/80 rounded-xl hover:border-[#8C0404]/40 hover:shadow-sm transition-all group bg-white"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-neutral-900 text-sm">{circular.title}</h4>
                    <span
                      onClick={() => handleToggleActive(circular._id || circular.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase cursor-pointer ${
                        circular.isActive !== false ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {circular.isActive !== false ? "Active" : "Hidden"}
                    </span>
                  </div>

                  {circular.content && <p className="text-xs text-neutral-600 mt-1">{circular.content}</p>}

                  <div className="flex gap-4 mt-2 text-[11px] text-neutral-500 font-medium">
                    <span>Published: {new Date(circular.date || circular.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Target: <strong>{circular.audience}</strong></span>
                    <span>•</span>
                    <span>By: {circular.createdByName || "Admin"}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCircular(circular._id || circular.id, circular.title)}
                  className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete circular"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Create Circular Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-100 text-left relative overflow-hidden">
            
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-bold text-neutral-900">Publish New Bulletin Circular</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCircular} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Bulletin Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Revision of Incentive Guidelines 2026-27"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 p-3 text-xs font-semibold outline-none focus:border-[#8C0404] focus:ring-1 focus:ring-[#8C0404]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Target Audience *
                </label>
                <select
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 p-3 text-xs font-bold text-neutral-800 outline-none focus:border-[#8C0404]"
                >
                  {AUDIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Detailed Announcement Text (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide details about the circular..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 p-3 text-xs font-medium outline-none focus:border-[#8C0404] focus:ring-1 focus:ring-[#8C0404]"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#8C0404] hover:bg-[#6F0303] text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Publishing..." : "Publish Circular"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Circulars;
