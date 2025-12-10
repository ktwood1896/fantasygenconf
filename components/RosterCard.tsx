"use client";

export default function RosterCard({ 
  person, 
  isSelected, 
  onToggle 
}: { 
  person: any, 
  isSelected: boolean, 
  onToggle: () => void 
}) {
  return (
    <div 
      onClick={onToggle}
      className={`
        cursor-pointer p-6 rounded-lg shadow-md border-t-4 transition-all duration-200
        ${isSelected ? "bg-blue-50 border-blue-600 scale-105" : "bg-white border-gray-200 hover:border-blue-400"}
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-bold text-xl text-gray-900">{person.name}</h2>
          <p className="text-gray-600 font-medium">{person.position}</p>
        </div>
        {isSelected && (
          <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
            ✓
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 mt-2 uppercase tracking-wide">{person.organization}</p>
    </div>
  );
}