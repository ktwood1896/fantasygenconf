import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminConsole from "@/components/AdminConsole";

export default async function AdminPage() {
  const supabase = await createClient();
  
  // 1. Check who is knocking
  const { data: { user } } = await supabase.auth.getUser();

  // 2. SECURITY CHECK: Replace this with your REAL email!
  const MY_EMAIL = "ktwood1896@gmail.com"; 

  if (!user || user.email !== MY_EMAIL) {
    // If they aren't you, kick them back home
    redirect("/");
  }

  // 3. Fetch Data
  const { data: roster } = await supabase.from('master_roster').select('*').order('name');
  const { data: results } = await supabase.from('results').select('*');

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Commissioner Dashboard</h1>
            <p className="text-slate-400">Live Control Center</p>
          </div>
          <div className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
            Live Mode
          </div>
        </header>

        {/* The Control Panel */}
        <AdminConsole roster={roster || []} currentResults={results || []} />
      </div>
    </div>
  );
}