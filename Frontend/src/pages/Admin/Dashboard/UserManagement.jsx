import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { Users, Search, UserPlus, RefreshCw, AlertCircle, CheckCircle2, X, Edit2, Trash2, Download, FileText } from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser, toggleUserActive } from "../../../services/adminService";
import { exportToCSV, exportToPDF } from "../../../utils/exportUtils";

const ROLES = [
  { value: "faculty", label: "Faculty Member" },
  { value: "hod", label: "Head of Department (HOD)" },
  { value: "principal", label: "Principal" },
  { value: "director", label: "Director / Dean" },
  { value: "rd_cell", label: "R&D Cell" },
  { value: "rpc_cell", label: "RPC Member" },
  { value: "accounts", label: "Finance & Accounts" },
  { value: "registrar", label: "Registrar" },
  { value: "vc", label: "Vice Chancellor (VC)" },
  { value: "student", label: "Student Researcher" },
  { value: "admin", label: "System Admin" },
];

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "MCA",
  "Information Technology",
  "Software Engineering",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Biotechnology",
  "Management Studies (MBA)",
  "Computer Applications (MCA)",
  "Pharmacy",
  "Nursing",
  "Physiotherapy",
  "Law",
  "Medical Sciences",
  "Dental Sciences",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Humanities & Social Sciences",
  "Agriculture & Food Technology",
  "Accounts",
  "Registrar",
  "R&D",
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = Add mode, object = Edit mode

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
    department: "Computer Science & Engineering",
    employeeId: "",
    designation: "",
    phone: "",
    institute: "MMDU",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users from database
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers({
        search: searchTerm,
        role: selectedRoleFilter !== "ALL" ? selectedRoleFilter : undefined,
        limit: 100,
      });

      if (res?.data?.users) {
        setUsers(res.data.users);
      } else if (Array.isArray(res?.users)) {
        setUsers(res.users);
      } else if (Array.isArray(res)) {
        setUsers(res);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to load users from database:", err);
      setError(err.message || "Failed to load database users.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedRoleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle open modal for Add
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "faculty",
      department: "Computer Science & Engineering",
      employeeId: "",
      designation: "",
      phone: "",
      institute: "MMDU",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Handle open modal for Edit
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "", // Leave blank if not changing password
      role: user.role || "faculty",
      department: user.department || "Computer Science & Engineering",
      employeeId: user.employeeId || "",
      designation: user.designation || "",
      phone: user.phone || "",
      institute: user.institute || "MMDU",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Submit Add or Edit User Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Name and Email are required.");
      setIsSubmitting(false);
      return;
    }

    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      setFormError("Default password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingUser) {
        // Edit mode
        const updatePayload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          department: formData.department,
          employeeId: formData.employeeId.trim(),
          designation: formData.designation.trim(),
          phone: formData.phone.trim(),
          institute: formData.institute,
        };
        if (formData.password) {
          updatePayload.password = formData.password;
        }

        const res = await updateUser(editingUser._id || editingUser.id, updatePayload);
        setSuccessMessage(`User "${formData.name}" updated successfully!`);
      } else {
        // Add mode
        const createPayload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          department: formData.department,
          employeeId: formData.employeeId.trim(),
          designation: formData.designation.trim(),
          phone: formData.phone.trim(),
          institute: formData.institute || "MMDU",
        };

        const res = await createUser(createPayload);
        setSuccessMessage(`New User "${formData.name}" created successfully in database!`);
      }

      setIsModalOpen(false);
      await loadUsers();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Error saving user:", err);
      setFormError(err.message || "Failed to save user in database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle user active status
  const handleToggleActive = async (user) => {
    try {
      const userId = user._id || user.id;
      await toggleUserActive(userId);
      setSuccessMessage(`User "${user.name}" status updated.`);
      await loadUsers();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to change user status.");
    }
  };

  // Delete user from database
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${user.name}" (${user.email}) from database?`)) {
      return;
    }
    try {
      const userId = user._id || user.id;
      await deleteUser(userId);
      setSuccessMessage(`User "${user.name}" deleted successfully.`);
      await loadUsers();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to delete user.");
    }
  };

  // Export User Activity Report CSV
  const handleExportUserCSV = () => {
    const reportData = users.map((u) => ({
      claimNumber: u.employeeId || u.studentId || u._id || "N/A",
      applicantName: u.name,
      department: u.department || "N/A",
      applicantRole: u.role,
      category: `Submissions: ${u.submissionsCount || 0}`,
      subtype: `Approvals: ${u.approvalsCount || 0}`,
      title: `${u.designation || 'Staff'} • ${u.email}`,
      userShare: u.submissionsCount || 0,
      paymentStatus: u.isActive !== false ? "Active" : "Inactive"
    }));
    exportToCSV(reportData, "MMDU_User_Activity_Report.csv");
  };

  // Export User Activity Report PDF
  const handleExportUserPDF = () => {
    const reportData = users.map((u) => ({
      id: u._id,
      claimNumber: u.employeeId || u.studentId || "N/A",
      applicantName: u.name,
      department: u.department || "N/A",
      category: `Submissions: ${u.submissionsCount || 0}`,
      subtype: `Approvals: ${u.approvalsCount || 0}`,
      title: `${u.role.toUpperCase()} • ${u.email}`,
      userShare: u.submissionsCount || 0,
      paymentStatus: u.isActive !== false ? "ACTIVE" : "INACTIVE"
    }));
    exportToPDF(reportData, "MMDU_User_Activity_Report.pdf", {
      filterScope: "User Submissions & Approvals Activity Report"
    });
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Database User Management"
        subtitle="Create, update, delete, and monitor activity for system accounts directly in the database."
        icon={Users}
      />

      {/* Global Success Notification */}
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

      {/* Header Controls Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200/80 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#8C0404] focus:ring-1 focus:ring-[#8C0404] text-xs font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Role Filter, Export & Add User Button */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          <select
            className="px-3.5 py-2.5 border border-neutral-200 bg-white rounded-xl text-xs font-bold text-neutral-700 focus:outline-none focus:border-[#8C0404]"
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
          >
            <option value="ALL">All System Roles</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <button
            onClick={loadUsers}
            className="p-2.5 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-xl text-neutral-600 transition-colors cursor-pointer"
            title="Refresh database users"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={handleExportUserCSV}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Download User Activity Report CSV"
          >
            <Download size={14} /> CSV Report
          </button>

          <button
            onClick={handleExportUserPDF}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
            title="Download User Activity Report PDF"
          >
            <FileText size={14} /> PDF Report
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8C0404] hover:bg-[#6F0303] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ml-auto md:ml-0"
          >
            <UserPlus size={16} /> Add New User
          </button>
        </div>
      </div>

      {/* Users Database Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase font-bold tracking-wider border-b border-neutral-200 text-[11px]">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Department / Designation</th>
                <th className="p-4 text-center">Submissions Submitted</th>
                <th className="p-4 text-center">Approvals Conducted</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400 font-medium">
                    Loading database users & activity records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-rose-600 font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle size={18} />
                      <span>{error}</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const roleObj = ROLES.find((r) => r.value === u.role);
                  const roleLabel = roleObj ? roleObj.label : u.role;

                  return (
                    <tr key={u._id || u.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-neutral-900 text-sm">{u.name}</div>
                        <div className="text-[11px] text-neutral-500">{u.email}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">ID: {u.employeeId || u.studentId || "-"}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-[#8C0404]/10 text-[#8C0404] border border-[#8C0404]/20 font-bold text-[11px]">
                          {roleLabel}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-neutral-800">{u.department || "-"}</div>
                        <div className="text-[11px] text-neutral-500">{u.designation || "-"}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-bold text-xs">
                          {u.submissionsCount || 0}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold text-xs">
                          {u.approvalsCount || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer border ${
                            u.isActive !== false
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                          }`}
                          title="Click to toggle active/inactive status"
                        >
                          {u.isActive !== false ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-[#8C0404] hover:text-[#8C0404] text-xs font-bold transition-colors cursor-pointer"
                            title="Edit user details"
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer"
                            title="Delete user from database"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60 animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-100 text-left relative overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-bold text-neutral-900">
                {editingUser ? `Edit User: ${editingUser.name}` : "Add New User to Database"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Error */}
            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs outline-none focus:border-[#8C0404] focus:ring-1 focus:ring-[#8C0404]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh@mmumullana.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs outline-none focus:border-[#8C0404] focus:ring-1 focus:ring-[#8C0404]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    {editingUser ? "New Password (Optional)" : "Default Password *"}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    placeholder={editingUser ? "Leave blank to keep current" : "Minimum 6 characters"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs outline-none focus:border-[#8C0404] focus:ring-1 focus:ring-[#8C0404]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    System Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs font-bold text-neutral-800 outline-none focus:border-[#8C0404]"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs font-medium text-neutral-800 outline-none focus:border-[#8C0404]"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Employee / Student ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 115201"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs outline-none focus:border-[#8C0404] focus:ring-1 focus:ring-[#8C0404]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Associate Professor"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs outline-none focus:border-[#8C0404] focus:ring-1 focus:ring-[#8C0404]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs outline-none focus:border-[#8C0404] focus:ring-1 focus:ring-[#8C0404]"
                  />
                </div>
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
                  {isSubmitting ? "Saving..." : editingUser ? "Save Changes" : "Create User in Database"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
