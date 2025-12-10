import { createClient } from "@/utils/supabase/server";

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // 1. Fetch EVERYTHING
  const { data: profiles } = await supabase.from("profiles").select("*");
  const { data: allPicks } = await supabase.from("picks").select("*");
  const { data: results } = await supabase.from("results").select("*");

  // 2. The "Answer Key"
  // We organize results for easier checking. 
  // For GA 70s, we just make a list of ALL correct IDs since order doesn't matter.
  const correctGAs = results
    ?.filter((r) => r.category === "ga_70")
    .map((r) => r.winning_roster_id) || [];
  
  // 3. Calculate Scores per User
  const leaderboard = profiles?.map((user) => {
    let score = 0;
    const userPicks = allPicks?.filter((p) => p.user_id === user.id) || [];

    userPicks.forEach((pick) => {
      // Find the result for this specific category/slot
      const result = results?.find(
        (r) => r.category === pick.category && r.slot_number === pick.slot_number
      );

      // SCORING LOGIC:
      if (pick.category === "ga_70") {
        // Rule: If your pick exists ANYWHERE in the correct GA list, +5 points
        if (pick.roster_id && correctGAs.includes(pick.roster_id)) {
          score += 5;
        }
      } else {
        // Rule: Exact Match required (Person ID or Tie Breaker Value)
        if (result) {
          const isCorrectPerson = pick.roster_id && pick.roster_id === result.winning_roster_id;
          const isCorrectValue = 
            pick.prediction_value &&
            result.winning_value && 
            pick.prediction_value.toString() === result.winning_value.toString();
          
          if (isCorrectPerson) score += 10;
          if (isCorrectValue) score += 5;
        }
      }
    });

    return {
      name: user.display_name || "Anonymous",
      score,
      id: user.id
    };
  }).sort((a, b) => b.score - a.score); // Sort High to Low

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          🏆 Leaderboard
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 font-semibold text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b">Rank</th>
                <th className="p-4 border-b">Player</th>
                <th className="p-4 border-b text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaderboard?.map((player, index) => (
                <tr key={player.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-gray-500">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    {player.name}
                  </td>
                  <td className="p-4 text-right font-bold text-blue-600 text-lg">
                    {player.score}
                  </td>
                </tr>
              ))}
              {leaderboard?.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No players yet. Be the first!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}