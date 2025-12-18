import { createClient } from "@/utils/supabase/server";
import DraftBoard from "@/components/DraftBoard";
import Link from "next/link";
import { signOut } from "@/app/actions";

export default async function Home() {
  const supabase = await createClient();

  // 1. Get the Roster
  const { data: speakers } = await supabase.from('master_roster').select('*').order('name');

  // 2. Get the User
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Get Profile (Display Name)
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  // 4. Get Existing Picks
  let existingPicks: any[] = [];
  if (user) {
    const { data } = await supabase
      .from('picks')
      .select('category, slot_number, roster_id, prediction_value')
      .eq('user_id', user.id);
    existingPicks = data || [];
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-32 font-sans">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* --- HEADER --- */}
        <header className="mb-10 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          {/* Title Section */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
              Fantasy <span className="text-emerald-500">GenConf</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Predict the speakers. Build your roster.
            </p>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            
            {/* Leaderboard Button (Green Box) */}
            <Link 
              href="/leaderboard" 
              className="w-full sm:w-auto text-center bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-lg transition transform hover:-translate-y-0.5 border border-emerald-600"
            >
              🏆 Leaderboard
            </Link>

            {user ? (
              <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end bg-slate-900 sm:bg-transparent p-3 sm:p-0 rounded-lg border border-slate-800 sm:border-none">
                
                {/* User Greeting */}
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Welcome</p>
                  <p className="font-bold text-white text-sm">
                    {profile?.display_name || user.email?.split('@')[0]}
                  </p>
                  <Link 
                    href="/profile" 
                    className="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-wide"
                  >
                    Edit Profile
                  </Link>
                </div>

                {/* Sign Out Button */}
                <form action={signOut}>
                  <button 
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-lg border border-slate-700 transition text-sm whitespace-nowrap"
                    type="submit"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              // Sign In Button (Visible only when logged out)
              <Link
                href="/login"
                className="w-full sm:w-auto text-center bg-white text-slate-900 font-bold py-2.5 px-6 rounded-lg hover:bg-slate-200 transition shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* --- GAME BOARD WRAPPER --- */}
        {/* Encapsulating the board in a dark card style */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-1 md:p-6 overflow-hidden">
           <DraftBoard 
              roster={speakers || []} 
              initialPicks={existingPicks}
              user={user} 
           />
        </div>

      </div>
    </main>
  );
}