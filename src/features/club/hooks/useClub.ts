import { useState, useEffect } from "react";
import { clubApi } from "../api/clubApi";
import type { ClubResponse, CreateClubRequest, UpdateClubRequest } from "../api/clubApi";
import { useUiStore } from "../store/uiStore";

export function useClub() {
  const [club, setClub] = useState<ClubResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const showToast = useUiStore(s => s.showToast);

  const load = async () => {
  setLoading(true);
  try {
    const data = await clubApi.getMyClub();
    setClub(data);
    setNotFound(false);
  } catch (err: any) {
    if (err.response?.status === 404) {
      setNotFound(true);
    } else {
      // lỗi khác: 500, 401, network... vẫn set notFound = false
      // nhưng club = null → trang không render gì
      // nên cần set một state error riêng, hoặc đơn giản nhất:
      setNotFound(false);
      setClub(null);
      // log ra để debug
      console.error("useClub error:", err.response?.status, err.response?.data);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { load(); }, []);

  const createClub = async (data: CreateClubRequest) => {
    const created = await clubApi.createClub(data);
    setClub(created);
    setNotFound(false);
    showToast("Tạo hồ sơ CLB thành công!");
    return created;
  };

  const updateClub = async (data: UpdateClubRequest) => {
    const updated = await clubApi.updateClub(data);
    setClub(updated);
    showToast("Cập nhật hồ sơ CLB thành công!");
    return updated;
  };

  return { club, loading, notFound, createClub, updateClub };
}