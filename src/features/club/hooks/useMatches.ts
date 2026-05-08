import { useState, useEffect } from "react";
import { matchApi } from "../api/matchApi";
import type { MatchResponse } from "../api/matchApi";

export function useMatches() {
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    matchApi.getMyMatches()
      .then(setMatches)
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, []);

  const submitLineup = async (
    matchId: number,
    lineup: { athleteId: number; lineupType: string; jerseyNumber: number; position: string }[]
  ) => {
    await matchApi.submitLineup(matchId, lineup);
  };

  return { matches, loading, submitLineup };
}