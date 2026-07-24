import React from "react";

export const Table = ({ children, className = "" }) => (
  <div className="w-full overflow-x-auto bg-white">
    <table className={`w-full text-left border-collapse ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className = "" }) => (
  <thead className={`border-b border-zinc-100 bg-zinc-50/50 ${className}`}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = "" }) => (
  <tbody className={`divide-y divide-zinc-100 ${className}`}>{children}</tbody>
);

export const TableRow = ({ children, className = "", onClick }) => (
  <tr
    onClick={onClick}
    className={`transition-colors ${onClick ? "cursor-pointer hover:bg-zinc-50/70" : ""} ${className}`}
  >
    {children}
  </tr>
);

export const TableHead = ({ children, className = "" }) => (
  <th
    className={`px-6 py-3.5 text-xs uppercase tracking-wider text-zinc-400 font-medium ${className}`}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className = "" }) => (
  <td
    className={`px-6 py-4 text-sm text-zinc-600 whitespace-nowrap ${className}`}
  >
    {children}
  </td>
);
