"use client";

interface Person {
  id: number;
  name: string;
  position: string;
}

interface PersonSlotProps {
  label: string;
  options: Person[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  disabled?: boolean;
}

export default function PersonSlot({ label, options, selectedId, onSelect, disabled }: PersonSlotProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>
      <select
        disabled={disabled}
        value={selectedId || ""}
        onChange={(e) => {
          const val = e.target.value;
          onSelect(val ? parseInt(val) : null);
        }}
        // ADDED: text-gray-900 to force black text
        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
      >
        <option value="" className="text-gray-500">-- Select a Speaker --</option>
        {options.map((person) => (
          <option key={person.id} value={person.id} className="text-gray-900">
            {person.name} ({person.position})
          </option>
        ))}
      </select>
    </div>
  );
}