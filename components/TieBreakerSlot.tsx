"use client";

interface TieBreakerSlotProps {
  label: string;
  type: "text" | "number";
  options?: string[]; // For dropdowns like Colors
  value: string | number | null;
  onChange: (val: string | number) => void;
}

export default function TieBreakerSlot({ label, type, options, value, onChange }: TieBreakerSlotProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>
      
      {options ? (
        // Render a Dropdown if options are provided (e.g., Colors)
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">-- Select --</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        // Render a Number input if no options (e.g., Temple Count)
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#"
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      )}
    </div>
  );
}