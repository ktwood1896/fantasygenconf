"use client";

import { useState } from "react";
import PersonSlot from "./PersonSlot";
import TieBreakerSlot from "./TieBreakerSlot";
import { saveAdminResult } from "@/app/actions";

export default function AdminConsole({ roster, currentResults }: { roster: any[], currentResults: any[] }) {
  const [results, setResults] = useState<Record<string, { roster_id?: number, value?: string }>>(() => {
    const map: Record<string, any> = {};
    currentResults.forEach((r) => {
      map[`${r.category}-${r.slot_number}`] = {
        roster_id: r.winning_roster_id,
        value: r.winning_value
      };
    });
    return map;
  });

  const [saving, setSaving] = useState(false);

  const handleSelectPerson = (category: string, slot: number, id: number | null) => {
    const key = `${category}-${slot}`;
    const newResults = { ...results };
    if (id) newResults[key] = { roster_id: id };
    else delete newResults[key];
    setResults(newResults);
  };

  const handleSelectValue = (category: string, slot: number, val: string | number) => {
    const key = `${category}-${slot}`;
    const newResults = { ...results };
    if (val) newResults[key] = { value: val.toString() };
    else delete newResults[key];
    setResults(newResults);
  };

  // Filters
  const getPeople = (org: string) => roster.filter((p) => p.organization === org);
  const getGAs = () => roster.filter((p) => p.organization === 'Seventy').sort((a, b) => a.name.localeCompare(b.name));

  const handlePublish = async () => {
    if (!confirm("Are you sure? This will update the Leaderboard for everyone.")) return;
    setSaving(true);

    const payload = Object.entries(results).map(([key, data]) => {
      const [category, slot] = key.split("-");
      return {
        category,
        slot_number: parseInt(slot),
        winning_roster_id: data.roster_id || null,
        winning_value: data.value || null
      };
    });
    
    const result = await saveAdminResult(payload);
    setSaving(false);

    if (result.error) {
      alert(`❌ Error: ${result.error}`);
    } else {
      alert("✅ Results Published!");
    }
  };

  return (
    <div className="space-y-8 pb-24">
      
      {/* 1. TIE BREAKERS */}
      <section className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Tie Breakers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TieBreakerSlot label="Tie Color" type="text" options={["Red", "Blue", "Gold", "Purple", "Green", "Grey/Black", "Other"]} value={results["tie_color-1"]?.value || null} onChange={(val) => handleSelectValue("tie_color", 1, val)} />
          <TieBreakerSlot label="Temples Announced" type="number" value={results["temples-1"]?.value || null} onChange={(val) => handleSelectValue("temples", 1, val)} />
          <TieBreakerSlot label="Choir" type="text" options={["Tabernacle Choir", "BYU Choir", "International Choir", "Primary Choir", "Institute Choir"]} value={results["choir-1"]?.value || null} onChange={(val) => handleSelectValue("choir", 1, val)} />
        </div>
      </section>

      {/* 2. AUXILIARIES */}
      <section className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Auxiliary Presidencies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Relief Society", "Young Women", "Young Men", "Primary", "Sunday School", "Presiding Bishopric"].map(org => {
             const catKey = org.toLowerCase().replace(" ", "_");
             const finalKey = org === "Presiding Bishopric" ? "bishopric" : catKey;
             
             return (
              <PersonSlot 
                key={org} 
                label={org} 
                options={getPeople(org)} 
                selectedId={results[`${finalKey}-1`]?.roster_id || null} 
                onSelect={(id) => handleSelectPerson(finalKey, 1, id)} 
              />
            )
          })}
        </div>
      </section>

      {/* 3. GA 70s */}
      <section className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">General Authority Seventies</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <PersonSlot 
              key={i} 
              label={`GA 70 - Slot #${i+1}`} 
              options={getGAs()} 
              selectedId={results[`ga_70-${i+1}`]?.roster_id || null} 
              onSelect={(id) => handleSelectPerson("ga_70", i+1, id)} 
            />
          ))}
        </div>
      </section>

      {/* THE PUBLISH BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950 border-t border-slate-800 flex justify-center shadow-2xl z-50">
        <button
          onClick={handlePublish}
          disabled={saving}
          className="bg-emerald-600 text-white font-bold py-3 px-12 rounded-full shadow-lg hover:bg-emerald-500 hover:scale-105 transition disabled:opacity-50 text-lg tracking-wide"
        >
          {saving ? "Publishing..." : "PUBLISH RESULTS"}
        </button>
      </div>
    </div>
  );
}