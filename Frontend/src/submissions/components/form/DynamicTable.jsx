import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { FieldRegistry } from "../../registry/FieldRegistry";

export const DynamicTable = ({ name, label, columns = [], value = [], onChange, error }) => {
  // Safe array value
  const rows = Array.isArray(value) ? value : [];

  const addRow = () => {
    const defaultRow = {};
    columns.forEach(col => {
      defaultRow[col.name] = col.type === "number" ? 0 : col.type === "checkbox" ? false : "";
    });
    onChange([...rows, defaultRow]);
  };

  const removeRow = (index) => {
    onChange(rows.filter((_, idx) => idx !== index));
  };

  const updateCell = (index, fieldName, cellValue) => {
    const updatedRows = rows.map((row, idx) => {
      if (idx === index) {
        return { ...row, [fieldName]: cellValue };
      }
      return row;
    });
    onChange(updatedRows);
  };

  return (
    <div className="space-y-2.5 w-full text-left">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-brand-gray-700">{label}</label>
        <Button
          type="button"
          onClick={addRow}
          variant="outline"
          className="h-7 px-2 text-xs flex items-center gap-1 border-dashed"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Row
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="border border-dashed border-brand-gray-200 rounded-md p-4 text-center text-xs text-brand-gray-400 bg-white">
          No records added. Click "Add Row" to populate this section.
        </div>
      ) : (
        <div className="border border-brand-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-gray-50 border-b border-brand-gray-200">
                  {columns.map((col, idx) => (
                    <th key={idx} className="p-2.5 text-[11px] font-bold text-brand-gray-500 uppercase tracking-wider">
                      {col.label}
                    </th>
                  ))}
                  <th className="p-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-brand-gray-50/55 transition-colors">
                    {columns.map((col, cIdx) => {
                      const CellField = FieldRegistry.get(col.type);
                      return (
                        <td key={cIdx} className="p-2">
                          {col.type === "checkbox" ? (
                            <input
                              type="checkbox"
                              checked={!!row[col.name]}
                              onChange={(e) => updateCell(rIdx, col.name, e.target.checked)}
                              className="h-4 w-4 rounded border-brand-gray-300 text-black focus:ring-black"
                            />
                          ) : (
                            <CellField
                              value={row[col.name]}
                              onChange={(cellVal) => updateCell(rIdx, col.name, cellVal)}
                              options={col.options}
                              placeholder={col.placeholder || "Enter value..."}
                            />
                          )}
                        </td>
                      );
                    })}
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeRow(rIdx)}
                        className="text-brand-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {error && <span className="text-xs text-red-500">{error.message}</span>}
    </div>
  );
};
