import { useState, useEffect, useCallback } from 'react';
import { athletePublicApi } from '../api/athletePublicApi';
import type { AthleteApplicationResponse, ApplyToClubRequest } from '../types';

export function useApplications() {
  const [applications, setApplications] = useState<AthleteApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const fetch = useCallback(() => {
    athletePublicApi.getMyApplications()
      .then(setApplications)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const applyToClub = async (data: ApplyToClubRequest): Promise<boolean> => {
    try {
      setApplying(true);
      await athletePublicApi.applyToClub(data);
      fetch(); // refresh
      return true;
    } catch {
      return false;
    } finally {
      setApplying(false);
    }
  };

  // VĐV đang PENDING hoặc APPROVED ở CLB nào đó chưa
  const hasActiveApplication = applications.some(
    a => a.joinStatus === 'PENDING' || a.joinStatus === 'APPROVED'
  );

  return { applications, loading, applying, applyToClub, hasActiveApplication };
}