"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveAdminResult(results: any[]) {
  const supabase = await createClient();

  // 1. Double Check Security (Server Side is the only one that matters)
  const { data: { user } } = await supabase.auth.getUser();
  const ADMIN_EMAIL = "ktwood1896@gmail.com";
  if (!user || user.email !== ADMIN_EMAIL) {
    return { error: "Unauthorized" };
  }

  // 2. Wipe old results and save new ones (Clean slate approach)
  // Note: We use "upsert" logic usually, but deleting all and re-inserting is safer for simple apps
  await supabase.from("results").delete().neq("category", "placeholder"); 
  
  const { error } = await supabase.from("results").insert(results);

  if (error) {
    console.error(error);
    return { error: "Failed to save results" };
  }

  // 3. Update the Leaderboard immediately
  revalidatePath("/leaderboard");
  revalidatePath("/admin");
  return { success: true };
}

// --- AUTH ACTIONS ---

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?error=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return redirect("/login?error=" + error.message);
  }

  revalidatePath("/", "layout");
  redirect("/onboarding");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
}

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const displayName = formData.get("displayName") as string;

  // We use "upsert" so it works whether the row exists or not
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, display_name: displayName });

  if (error) {
    console.error("Profile Save Error:", error);
    return { error: "Could not save profile." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// --- GAME ACTIONS ---

export async function submitPicks(picks: any[]) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

 // 1. Prepare data for insertion
  const records = picks.map((p) => ({
    user_id: user.id,
    category: p.category,
    slot_number: p.slot_number,
    roster_id: p.roster_id,     // Maps the Person ID
    prediction_value: p.prediction_value // <--- MAKE SURE THIS LINE IS HERE!
  }));

  // 2. Delete OLD picks (Simple "Wipe and Replace" strategy)
  // In a real app, you might want to be more careful, but this works for now.
  await supabase.from("picks").delete().eq("user_id", user.id);

  // 3. Insert NEW picks
  const { error } = await supabase.from("picks").insert(records);

  if (error) {
    console.error("Save Error:", error);
    return { error: "Failed to save. Check the console." };
  }

  revalidatePath("/");
  return { success: true };
}