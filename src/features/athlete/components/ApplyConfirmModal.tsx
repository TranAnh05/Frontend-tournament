import { useState, useEffect } from 'react';
import { athletePublicApi } from '../api/athletePublicApi';
import type { AthleteProfileResponse, UpdateAthleteProfileRequest } from '../types';
import { toast } from 'react-toastify';

// Vị trí thi đấu theo từng môn thể thao
const POSITIONS_BY_SPORT: Record<string, string[]> = {
  'Bóng đá sân 7': [
    'Thủ môn', 'Trung vệ', 'Hậu vệ cánh',
    'Tiền vệ phòng ngự', 'Tiền vệ trung tâm', 'Tiền vệ công',
    'Tiền vệ cánh', 'Tiền đạo cánh', 'Tiền đạo cắm', 'Trung phong',
  ],
  'Bóng rổ 5x5': [
    'Point Guard (Hậu vệ tổ chức)',
    'Shooting Guard (Hậu vệ ghi điểm)',
    'Small Forward (Tiền phong nhỏ)',
    'Power Forward (Tiền phong lớn)',
    'Center (Trung phong)',
  ],
  'Cầu lông': [
    'Đơn nam', 'Đơn nữ',
    'Đôi nam', 'Đôi nữ', 'Đôi hỗn hợp',
  ],
};

const ALL_SPORTS = Object.keys(POSITIONS_BY_SPORT);

interface Props {
  clubId: number;
  clubName: string;
  applying: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ApplyConfirmModal({ clubId: _clubId, clubName, applying, onConfirm, onClose }: Props) {
  const [profile, setProfile] = useState<AthleteProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    identityNumber: '',
    dateOfBirth: '',
    preferredNumber: '',
    preferredSport: '',
    preferredPosition: '',
  });

  useEffect(() => {
    athletePublicApi.getMyProfile()
      .then(p => {
        setProfile(p);
        setForm({
          fullName: p.fullName ?? '',
          phoneNumber: p.phoneNumber ?? '',
          identityNumber: p.identityNumber ?? '',
          dateOfBirth: p.dateOfBirth ?? '',
          preferredNumber: p.preferredNumber?.toString() ?? '',
          preferredSport: '',
          preferredPosition: p.preferredPosition ?? '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Vị trí theo môn đang chọn
  const positions = form.preferredSport
    ? (POSITIONS_BY_SPORT[form.preferredSport] ?? [])
    : [];

  const setField = (field: string, value: string) => {
    if (field === 'preferredSport') {
      setForm(f => ({ ...f, preferredSport: value, preferredPosition: '' }));
    } else {
      setForm(f => ({ ...f, [field]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data: UpdateAthleteProfileRequest = {
        fullName: form.fullName || undefined,
        phoneNumber: form.phoneNumber || undefined,
        identityNumber: form.identityNumber || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        preferredNumber: form.preferredNumber ? Number(form.preferredNumber) : undefined,
        preferredPosition: form.preferredPosition || undefined,
      };
      const updated = await athletePublicApi.updateMyProfile(data);
      setProfile(updated);
      setEditing(false);
      toast.success('Cập nhật hồ sơ thành công!');
    } catch {
      toast.error('Cập nhật thất bại, thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-base">📋 Xác nhận ứng tuyển</h2>
            <p className="text-blue-200 text-xs mt-0.5">CLB: <strong>{clubName}</strong></p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none cursor-pointer">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading && (
            <div className="text-center py-10 text-gray-400">⏳ Đang tải thông tin...</div>
          )}

          {!loading && profile && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-gray-700">👤 Thông tin hồ sơ của bạn</p>
                {!editing ? (
                  <button onClick={() => setEditing(true)}
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer">
                    ✏️ Chỉnh sửa
                  </button>
                ) : (
                  <button onClick={() => setEditing(false)}
                    className="text-xs text-gray-500 hover:underline cursor-pointer">
                    Hủy sửa
                  </button>
                )}
              </div>

              {/* View mode */}
              {!editing && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Họ và tên', value: profile.fullName },
                    { label: 'Email', value: profile.email },
                    { label: 'Số điện thoại', value: profile.phoneNumber ?? '—' },
                    { label: 'CCCD/Hộ chiếu', value: profile.identityNumber },
                    { label: 'Ngày sinh', value: profile.dateOfBirth },
                    { label: 'Số áo yêu thích', value: profile.preferredNumber?.toString() ?? '—' },
                    { label: 'Vị trí sở trường', value: profile.preferredPosition ?? '—' },
                    { label: 'Thể trạng', value: profile.healthStatus === 'FIT' ? '✅ Khỏe mạnh' : '🤕 Chấn thương' },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-50 rounded-xl px-4 py-3">
                      <div className="text-xs text-gray-400">{item.label}</div>
                      <div className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Edit mode */}
              {editing && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Họ và tên</label>
                      <input type="text" value={form.fullName}
                        onChange={e => setField('fullName', e.target.value)}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại</label>
                      <input type="text" value={form.phoneNumber}
                        onChange={e => setField('phoneNumber', e.target.value)}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">CCCD/Hộ chiếu</label>
                      <input type="text" value={form.identityNumber}
                        onChange={e => setField('identityNumber', e.target.value)}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày sinh</label>
                      <input type="date" value={form.dateOfBirth}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={e => setField('dateOfBirth', e.target.value)}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Số áo yêu thích</label>
                      <input type="number" min={1} max={99} value={form.preferredNumber}
                        onChange={e => setField('preferredNumber', e.target.value)}
                        className={inputClass} placeholder="VD: 10" />
                    </div>

                    {/* Môn thể thao — chiếm full width */}
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Môn thể thao sở trường</label>
                      <select value={form.preferredSport}
                        onChange={e => setField('preferredSport', e.target.value)}
                        className={inputClass}>
                        <option value="">-- Chọn môn thể thao --</option>
                        {ALL_SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* Vị trí — chiếm full width, disable nếu chưa chọn môn */}
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Vị trí sở trường</label>
                      <select
                        value={form.preferredPosition}
                        onChange={e => setField('preferredPosition', e.target.value)}
                        disabled={!form.preferredSport}
                        className={`${inputClass} ${!form.preferredSport ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">
                          {form.preferredSport ? '-- Chọn vị trí --' : '-- Chọn môn thể thao trước --'}
                        </option>
                        {positions.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  <button onClick={handleSave} disabled={saving}
                    className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-60">
                    {saving ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                  </button>
                </div>
              )}

              <div className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl">
                ⚠️ Bạn chỉ được ứng tuyển một CLB tại một thời điểm. Sau khi nộp đơn, hãy chờ CLB phê duyệt.
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer">
            Hủy
          </button>
          <button onClick={onConfirm} disabled={applying || loading || editing}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
            {applying ? '⏳ Đang nộp...' : '✅ Xác nhận ứng tuyển'}
          </button>
        </div>
      </div>
    </div>
  );
}