import { saveProfile } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch existing name to pre-fill the form
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Edit Profile ✏️</h1>
        </div>

        <form action={saveProfile} className="space-y-6">
          <div>
            <label 
              htmlFor="displayName" 
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              id="displayName"
              defaultValue={profile?.display_name || ""}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            />
          </div>

          <div className="flex gap-4">
             <Link
              href="/"
              className="w-1/3 flex justify-center items-center text-slate-600 font-bold py-3 px-4 rounded-lg hover:bg-slate-100 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="w-2/3 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}