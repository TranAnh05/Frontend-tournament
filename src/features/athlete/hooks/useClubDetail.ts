import { useState, useEffect } from 'react';
import { athletePublicApi } from '../api/athletePublicApi';
import type { ClubPublicDetailResponse } from '../types';

export function useClubDetail(clubId: number | null) {
  const [club, setClub] = useState<ClubPublicDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clubId) return;
    setLoading(true);
    athletePublicApi.getClubDetail(clubId)
      .then(setClub)
      .finally(() => setLoading(false));
  }, [clubId]);

  return { club, loading };
}