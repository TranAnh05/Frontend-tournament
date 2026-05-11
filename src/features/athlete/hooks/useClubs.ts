import { useState, useEffect } from 'react';
import { athletePublicApi } from '../api/athletePublicApi';
import type { ClubPublicResponse } from '../types';

export function useClubs() {
  const [clubs, setClubs] = useState<ClubPublicResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    athletePublicApi.getAllClubs()
      .then(setClubs)
      .finally(() => setLoading(false));
  }, []);

  return { clubs, loading };
}