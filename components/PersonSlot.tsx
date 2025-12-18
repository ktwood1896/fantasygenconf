"use client";

interface PersonSlotProps {
  label: string;
  options: any[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export default function PersonSlot({ label, options, selectedId, onSelect }: PersonSlotProps) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md border border-slate-700 hover:border-emerald-500/50 transition">
      <label className="block text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={selectedId || ""}
        onChange={(e) => onSelect(e.target.value ? parseInt(e.target.value) : null)}
        className="w-full bg-slate-900 border border-slate-600 text-white rounded-md p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition appearance-none cursor-pointer"
      >
        <option value="" className="text-slate-500">-- Select a Speaker --</option>
        {options.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name} {person.position ? `(${person.position})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}