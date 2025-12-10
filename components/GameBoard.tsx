"use client";

import { useState } from "react";
import RosterCard from "./RosterCard";
import { submitPicks } from "@/app/actions";

// Update the "props" to include initialPicks
export default function GameBoard({ 
  speakers, 
  user, 
  initialPicks 
}: { 
  speakers: any[], 
  user: any, 
  initialPicks: number[] 
}) {
  // Initialize state with the picks from the database (instead of empty [])
  const [selectedIds, setSelectedIds] = useState<number[]>(initialPicks);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ... (The rest of the file stays exactly the same) ...

  const handleToggle = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((existingId) => existingId !== id));
    } else {
      if (selectedIds.length < 5) {
        setSelectedIds([...selectedIds, id]);
      } else {
        alert("Whoa! You can only pick 5 people for now!");
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please sign in to submit your picks!");
      return;
    }

    setIsSubmitting(true);
    
    // Call the Server Action
    const result = await submitPicks(selectedIds);
    
    setIsSubmitting(false);

    if (result.success) {
      alert("✅ Picks Saved Successfully!");
    } else {
      alert("❌ Error: " + result.error);
    }
  };

  return (
    <div>
      {/* The Scoreboard */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur shadow-sm p-4 mb-6 rounded-xl border border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-700">Your Bracket</h3>
          <p className="text-sm text-gray-500">{selectedIds.length} / 5 Selected</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={selectedIds.length === 0 || isSubmitting}
          className={`
            px-6 py-2 rounded-full font-bold text-white transition-all
            ${selectedIds.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"}
            ${isSubmitting ? "opacity-70 animate-pulse" : ""}
          `}
        >
          {isSubmitting ? "Saving..." : "Submit Picks"}
        </button>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {speakers.map((person) => (
          <RosterCard 
            key={person.id} 
            person={person}
            isSelected={selectedIds.includes(person.id)}
            onToggle={() => handleToggle(person.id)}
          />
        ))}
      </div>
    </div>
  );
}