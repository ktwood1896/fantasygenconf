import { createClient } from "@/utils/supabase/server";
import DraftBoard from "@/components/DraftBoard"; // 1. CHANGE IMPORT
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  // 1. Get the Roster
  const { data: speakers } = await supabase.from('master_roster').select('*').order('name'); // Added sort by name

  // 2. Get the User
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Get Existing Picks (UPDATED LOGIC)
  // We need to fetch the category and slot_number now, not just the ID.
  let existingPicks: any[] = [];
  if (user) {
    const { data } = await supabase
      .from('picks')
      .select('category, slot_number, roster_id, prediction_value') // Select specific columns
      .eq('user_id', user.id);
    
    existingPicks = data || [];
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50 pb-32">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-end border-b pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Fantasy General Conference
            </h1>
            <p className="text-gray-600">Predict the speakers. Build your roster.</p>
          </div>
          <div className="flex gap-4 items-center">
           <Link href="/leaderboard" className="text-gray-600 hover:text-blue-600 font-medium">
             Leaderboard
            </Link>
           {/* ... existing User/Login stuff ... */}
          </div>
          <div className="mb-2">
            {user ? (
              <div className="text-right">
                <p className="text-sm text-gray-500">Playing as</p>
                <p className="font-bold text-blue-600">{user.email}</p>
                {/* We'll add the Logout button here later! */}
              </div>
            ) : (
              <Link 
                href="/login"
                className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
              >
                Sign In to Play
              </Link>
            )}
          </div>
        </header>
      
        {/* 4. SWAP COMPONENT (GameBoard -> DraftBoard) */}
        <DraftBoard 
          roster={speakers || []} 
          initialPicks={existingPicks} 
          user={user} 
        />
      </div>
    </main>
  );
}