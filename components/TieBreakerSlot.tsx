"use client";

interface TieBreakerSlotProps {
  label: string;
  type: "text" | "number";
  options?: string[]; // Only for dropdowns
  value: string | null;
  onChange: (val: string) => void;
}

export default function TieBreakerSlot({ label, type, options, value, onChange }: TieBreakerSlotProps) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md border border-slate-700 hover:border-emerald-500/50 transition">
      <label className="block text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wide">
        {label}
      </label>
      
      {options ? (
        // Render Dropdown
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-600 text-white rounded-md p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition appearance-none cursor-pointer"
        >
          <option value="">-- Make a Guess --</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        // Render Number Input
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full bg-slate-900 border border-slate-600 text-white rounded-md p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
        />
      )}
    </div>
  );
}