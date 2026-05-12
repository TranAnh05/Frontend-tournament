import { useState, useEffect, useCallback } from 'react';
import { athletePublicApi } from '../api/athletePublicApi';
import type { AthleteProfileResponse, UpdateAthleteProfileRequest } from '../types';

export function useProfile() {
  const [profile, setProfile] = useState<AthleteProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(() => {
    setLoading(true);
    athletePublicApi.getMyProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const updateProfile = async (data: UpdateAthleteProfileRequest): Promise<boolean> => {
    try {
      setSaving(true);
      const updated = await athletePublicApi.updateMyProfile(data);
      setProfile(updated);
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, saving, updateProfile, refetch: fetchProfile };
}