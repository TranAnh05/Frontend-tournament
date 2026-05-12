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

  // Đang chờ duyệt → hiện warning + disable nút
  const hasPendingApplication = applications.some(
    a => a.joinStatus === 'PENDING'
  );

  // Đã là thành viên CLB → chỉ disable nút, không hiện warning
  const isApprovedMember = applications.some(
    a => a.joinStatus === 'APPROVED'
  );

  // Disable nút ứng tuyển khi đang PENDING hoặc đã APPROVED
  const hasActiveApplication = hasPendingApplication || isApprovedMember;

  return {
    applications,
    loading,
    applying,
    applyToClub,
    hasActiveApplication,
    hasPendingApplication,
    isApprovedMember,
  };
}