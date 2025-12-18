import { saveProfile } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Security: Kick them out if they aren't logged in
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome! 👋</h1>
          <p className="text-slate-600">
            Let's set up your profile for the leaderboard.
          </p>
        </div>

        <form action={saveProfile} className="space-y-6">
          <div>
            <label 
              htmlFor="displayName" 
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Choose a Display Name
            </label>
            <input
              type="text"
              name="displayName"
              id="displayName"
              placeholder="e.g. Sister Smith, Bishop Bob, CoolGuy99"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            />
            <p className="text-xs text-slate-500 mt-2">
              This will be visible to everyone on the leaderboard.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Start Playing →
          </button>
        </form>
      </div>
    </div>
  );
}