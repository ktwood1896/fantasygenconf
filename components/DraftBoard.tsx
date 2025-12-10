"use client";

import { useState } from "react";
import PersonSlot from "./PersonSlot";
import TieBreakerSlot from "./TieBreakerSlot";
import { submitPicks } from "@/app/actions";

interface DraftBoardProps {
  roster: any[];
  initialPicks: any[];
  user: any;
}

export default function DraftBoard({ roster, initialPicks, user }: DraftBoardProps) {
  const [picks, setPicks] = useState<Record<string, { roster_id?: number, value?: string }>>(() => {
    const map: Record<string, any> = {};
    initialPicks.forEach((p) => {
      map[`${p.category}-${p.slot_number}`] = { 
        roster_id: p.roster_id, 
        value: p.prediction_value 
      };
    });
    return map;
  });

  const [isSaving, setIsSaving] = useState(false);

  // --- HELPER: GET ALL "TAKEN" IDS ---
  const getTakenIds = () => {
    return Object.values(picks)
      .map((p) => p.roster_id)
      .filter((id) => typeof id === "number");
  };

  // --- NEW HELPER: CLEAR A SECTION ---
  const handleClearSection = (categories: string[]) => {
    if (!confirm("Are you sure you want to clear this section?")) return;

    const newPicks = { ...picks };
    // Loop through all current picks
    Object.keys(newPicks).forEach((key) => {
      // key format is "category-slot" (e.g. "ga_70-1")
      const [cat] = key.split("-");
      // If this pick belongs to one of the categories we are clearing, delete it
      if (categories.includes(cat)) {
        delete newPicks[key];
      }
    });
    setPicks(newPicks);
  };

  // Handle Person Picks
  const handleSelectPerson = (category: string, slot: number, id: number | null) => {
    const key = `${category}-${slot}`;
    const newPicks = { ...picks };
    if (id) newPicks[key] = { roster_id: id };
    else delete newPicks[key];
    setPicks(newPicks);
  };

  // Handle Tie Breaker Picks
  const handleSelectValue = (category: string, slot: number, val: string | number) => {
    const key = `${category}-${slot}`;
    const newPicks = { ...picks };
    if (val) newPicks[key] = { value: val.toString() };
    else delete newPicks[key];
    setPicks(newPicks);
  };

  // --- SORTING & FILTERING ---
  const rankPosition = (pos: string) => {
    if (pos.includes("President") || pos.includes("Presiding")) return 1;
    if (pos.includes("First")) return 2;
    if (pos.includes("Second")) return 3;
    return 4;
  };

  const getPeople = (org: string) => roster
    .filter((p) => p.organization === org)
    .sort((a, b) => rankPosition(a.position) - rankPosition(b.position));

  const getGAs = () => roster
    .filter((p) => !["Relief Society", "Young Women", "Young Men", "Primary", "Sunday School", "Presiding Bishopric"].includes(p.organization))
    .sort((a, b) => a.name.localeCompare(b.name));

  // --- SAVE LOGIC ---
  const handleSave = async () => {
    if (!user) return alert("Please sign in first!");
    setIsSaving(true);
    
    const payload = Object.entries(picks).map(([key, data]) => {
      const [category, slot] = key.split("-");
      return { 
        category, 
        slot_number: parseInt(slot), 
        roster_id: data.roster_id || null,      
        prediction_value: data.value || null    
      };
    });

    const result = await submitPicks(payload);
    setIsSaving(false);
    if (result.success) alert("✅ Roster Saved!");
    else alert("❌ Error: " + result.error);
  };

  const takenIds = getTakenIds();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* 1. ORGANIZATION PRESIDENCIES */}
      <section>
        <div className="flex justify-between items-end mb-4 border-b pb-2">
           <h2 className="text-2xl font-bold text-gray-800">Organization Presidencies</h2>
           <button 
             onClick={() => handleClearSection(["relief_society", "young_women", "young_men", "primary", "sunday_school", "bishopric"])}
             className="text-sm text-red-500 hover:text-red-700 hover:underline"
           >
             Clear Section
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PersonSlot 
            label="Relief Society" 
            options={getPeople("Relief Society")}
            selectedId={picks["relief_society-1"]?.roster_id || null}
            onSelect={(id) => handleSelectPerson("relief_society", 1, id)}
          />
          <PersonSlot 
            label="Young Women" 
            options={getPeople("Young Women")}
            selectedId={picks["young_women-1"]?.roster_id || null}
            onSelect={(id) => handleSelectPerson("young_women", 1, id)}
          />
          <PersonSlot 
            label="Young Men" 
            options={getPeople("Young Men")}
            selectedId={picks["young_men-1"]?.roster_id || null}
            onSelect={(id) => handleSelectPerson("young_men", 1, id)}
          />
          <PersonSlot 
            label="Primary" 
            options={getPeople("Primary")}
            selectedId={picks["primary-1"]?.roster_id || null}
            onSelect={(id) => handleSelectPerson("primary", 1, id)}
          />
          <PersonSlot 
            label="Sunday School" 
            options={getPeople("Sunday School")}
            selectedId={picks["sunday_school-1"]?.roster_id || null}
            onSelect={(id) => handleSelectPerson("sunday_school", 1, id)}
          />
          <PersonSlot 
            label="Presiding Bishopric" 
            options={getPeople("Presiding Bishopric")}
            selectedId={picks["bishopric-1"]?.roster_id || null}
            onSelect={(id) => handleSelectPerson("bishopric", 1, id)}
          />
        </div>
      </section>

      {/* 2. GENERAL AUTHORITY 70s */}
      <section>
        <div className="flex justify-between items-end mb-4 border-b pb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">General Authority Seventies</h2>
            <span className="text-sm text-gray-500">Pick up to 12</span>
          </div>
          <button 
             onClick={() => handleClearSection(["ga_70"])}
             className="text-sm text-red-500 hover:text-red-700 hover:underline"
           >
             Clear Section
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => {
            const slotNum = i + 1;
            const currentSelection = picks[`ga_70-${slotNum}`]?.roster_id;
            
            // SMART FILTERING
            const availableOptions = getGAs().filter(
              (p) => !takenIds.includes(p.id) || p.id === currentSelection
            );

            return (
              <PersonSlot 
                key={slotNum}
                label={`GA 70 - Slot #${slotNum}`} 
                options={availableOptions} 
                selectedId={currentSelection || null}
                onSelect={(id) => handleSelectPerson("ga_70", slotNum, id)}
              />
            );
          })}
        </div>
      </section>

      {/* 3. TIE BREAKERS */}
      <section>
        <div className="flex justify-between items-end mb-4 border-b pb-2">
          <h2 className="text-2xl font-bold text-gray-800">Tie Breakers</h2>
          <button 
             onClick={() => handleClearSection(["tie_color", "temples", "choir"])}
             className="text-sm text-red-500 hover:text-red-700 hover:underline"
           >
             Clear Section
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TieBreakerSlot 
            label="First Speaker Tie Color"
            type="text"
            options={["Red", "Blue", "Gold", "Purple", "Green", "Grey/Black", "Other"]}
            value={picks["tie_color-1"]?.value || null}
            onChange={(val) => handleSelectValue("tie_color", 1, val)}
          />
          <TieBreakerSlot 
            label="Total Temples Announced"
            type="number"
            value={picks["temples-1"]?.value || null}
            onChange={(val) => handleSelectValue("temples", 1, val)}
          />
           <TieBreakerSlot 
            label="Choir at Sat AM Session"
            type="text"
            options={["Tabernacle Choir", "BYU Choir", "International Choir", "Primary Choir", "Institute Choir"]}
            value={picks["choir-1"]?.value || null}
            onChange={(val) => handleSelectValue("choir", 1, val)}
          />
        </div>
      </section>

      {/* SUBMIT BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex justify-center shadow-lg z-50">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white font-bold py-3 px-12 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Final Roster"}
        </button>
      </div>
    </div>
  );
}