import { useState, useEffect, useCallback } from "react";
import { athleteApi } from "../api/athleteApi";
import type { ClubMemberResponse, UpdateAthleteRequest } from "../api/athleteApi";
import { useUiStore } from "../store/uiStore";

type JoinStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'LEFT' | 'REMOVED';

export function useMembers(status: JoinStatus = "APPROVED") {
  const [members, setMembers] = useState<ClubMemberResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const showToast = useUiStore(s => s.showToast);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMembers(await athleteApi.getMembers(status));
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { load(); }, [load]);

  const approve = async (memberId: number) => {
    await athleteApi.approveMember(memberId, true);
    showToast("Phê duyệt VĐV thành công!");
    await load();
  };

  const reject = async (memberId: number, reason: string) => {
    await athleteApi.approveMember(memberId, false, reason);
    showToast("Đã từ chối hồ sơ.", "error");
    await load();
  };

  const updateAthlete = async (memberId: number, data: UpdateAthleteRequest) => {
    await athleteApi.updateAthlete(memberId, data);
    showToast("Cập nhật VĐV thành công!");
    await load();
  };

  const remove = async (memberId: number) => {
    await athleteApi.removeMember(memberId);
    showToast("Đã xóa VĐV khỏi CLB.");
    await load();
  };

  const assignRole = async (memberId: number, clubRole: 'MEMBER' | 'CAPTAIN' | 'HEAD_COACH') => {
    await athleteApi.assignRole(memberId, clubRole);
    showToast("Phân công vai trò thành công!");
    await load();
  };

  return { members, loading, approve, reject, updateAthlete, remove, assignRole };
}