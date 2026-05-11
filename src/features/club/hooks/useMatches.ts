import { useState, useEffect } from "react";
import { matchApi } from "../api/matchApi";
import type { MatchResponse } from "../api/matchApi";

export function useMatches() {
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await matchApi.getMyMatches();
      setMatches(data);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submitLineup = async (
    matchId: number,
    lineup: { athleteId: number; lineupType: string; jerseyNumber: number; position: string }[]
  ) => {
    await matchApi.submitLineup(matchId, lineup);
    // Reload để cập nhật hasLineup trên UI
    await load();
  };

  return { matches, loading, submitLineup };
}