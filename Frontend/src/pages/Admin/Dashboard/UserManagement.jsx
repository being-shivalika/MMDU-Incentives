import React, { useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { Users, Search, Filter, UserPlus } from "lucide-react";
import StatusBadge from "../../../shared/components/StatusBadge";

const mockUsers = [
  { id: "U-101", name: "Dr. Anjali Sharma", role: "Faculty", dept: "Computer Science", email: "anjali.s@mmdu.ac.in", status: "Active" },
  { id: "U-102", name: "Prof. Rajesh Kumar", role: "HOD", dept: "Electrical Engineering", email: "rajesh.hod@mmdu.ac.in", status: "Active" },
  { id: "U-103", name: "Ravi Teja", role: "Student", dept: "Biotechnology", email: "ravi.t@mmdu.ac.in", status: "Inactive" },
  { id: "U-104", name: "Dr. Amit Patel", role: "RPC Member", dept: "Research Cell", email: "amit.rpc@mmdu.ac.in", status: "Active" },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = mockUsers.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage roles, access, and accounts across the portal."
        icon={Users}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors justify-center flex-1 sm:flex-none">
              <Filter size={16} /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-transparent bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors justify-center flex-1 sm:flex-none">
              <UserPlus size={16} /> Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-900 border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium">Name & Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-900">{user.dept}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
