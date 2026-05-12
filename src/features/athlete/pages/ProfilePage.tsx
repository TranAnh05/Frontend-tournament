import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import type { UpdateAthleteProfileRequest } from '../types';

const POSITIONS = ['Tiền đạo', 'Tiền vệ', 'Hậu vệ', 'Thủ môn', 'Chưa xác định'];

export default function ProfilePage() {
  const { profile, loading, saving, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UpdateAthleteProfileRequest>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const startEdit = () => {
    if (!profile) return;
    setForm({
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber ?? '',
      identityNumber: profile.identityNumber,
      dateOfBirth: profile.dateOfBirth,
      preferredPosition: profile.preferredPosition ?? '',
      preferredNumber: profile.preferredNumber ?? undefined,
    });
    setErrors({});
    setEditing(true);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (form.fullName !== undefined && form.fullName.trim() === '')
      e.fullName = 'Họ tên không được để trống';
    if (form.identityNumber !== undefined) {
      const id = form.identityNumber.trim();
      if (!/^\d{9,12}$/.test(id))
        e.identityNumber = 'CCCD phải từ 9–12 chữ số';
    }
    if (form.dateOfBirth !== undefined) {
      const dob = new Date(form.dateOfBirth);
      if (isNaN(dob.getTime()) || dob >= new Date())
        e.dateOfBirth = 'Ngày sinh phải là ngày trong quá khứ';
    }
    if (form.preferredNumber !== undefined) {
      const n = Number(form.preferredNumber);
      if (n < 1 || n > 99)
        e.preferredNumber = 'Số áo phải từ 1 đến 99';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const ok = await updateProfile(form);
    if (ok) setEditing(false);
  };

  const set = (key: keyof UpdateAthleteProfileRequest, value: string | number | undefined) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => { const copy = { ...prev }; delete copy[key]; return copy; });
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400">
      <span className="text-2xl mr-2">⏳</span> Đang tải hồ sơ...
    </div>
  );

  if (!profile) return (
    <div className="py-20 text-center text-red-500">Không thể tải hồ sơ</div>
  );

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">👤 Hồ sơ cá nhân</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Quản lý thông tin vận động viên của bạn</p>
        </div>
        {!editing && (
          <button
            onClick={startEdit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
          >
            ✏️ Chỉnh sửa hồ sơ
          </button>
        )}
      </div>

      {/* CLB hiện tại */}
      <div className={`rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2 ${
        profile.currentClubName
          ? 'bg-green-50 border border-green-200 text-green-700'
          : 'bg-gray-50 border border-gray-200 text-gray-500'
      }`}>
        <span>{profile.currentClubName ? '🏟️' : '🏃'}</span>
        {profile.currentClubName
          ? <>Đang khoác áo <strong className="ml-1">{profile.currentClubName}</strong></>
          : 'Chưa thuộc CLB nào'}
      </div>

      {/* Form / View */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Thông tin cơ bản */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Thông tin cơ bản</div>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Họ và tên" error={errors.fullName}>
              {editing
                ? <Input value={form.fullName ?? ''} onChange={v => set('fullName', v)} placeholder="Nguyễn Văn A" />
                : <Value>{profile.fullName}</Value>}
            </Field>
            <Field label="Email">
              <Value muted>{profile.email}</Value>
            </Field>
            <Field label="Số điện thoại">
              {editing
                ? <Input value={form.phoneNumber ?? ''} onChange={v => set('phoneNumber', v)} placeholder="0901234567" />
                : <Value>{profile.phoneNumber ?? '—'}</Value>}
            </Field>
          </div>
        </div>

        {/* Thông tin định danh */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Thông tin định danh</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Số CCCD" error={errors.identityNumber}>
              {editing
                ? <Input value={form.identityNumber ?? ''} onChange={v => set('identityNumber', v)} placeholder="001234567890" maxLength={12} />
                : <Value>{profile.identityNumber}</Value>}
            </Field>
            <Field label="Ngày sinh" error={errors.dateOfBirth}>
              {editing
                ? (
                  <input
                    type="date"
                    value={form.dateOfBirth ?? ''}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={e => set('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                )
                : <Value>{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('vi-VN') : '—'}</Value>}
            </Field>
          </div>
        </div>

        {/* Thông tin thi đấu */}
        <div className="px-5 py-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Thông tin thi đấu</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Vị trí thi đấu">
              {editing
                ? (
                  <select
                    value={form.preferredPosition ?? ''}
                    onChange={e => set('preferredPosition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    <option value="">— Chọn vị trí —</option>
                    {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                )
                : <Value>{profile.preferredPosition ?? '—'}</Value>}
            </Field>
            <Field label="Số áo" error={errors.preferredNumber}>
              {editing
                ? (
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={form.preferredNumber ?? ''}
                    onChange={e => set('preferredNumber', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="1–99"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                )
                : <Value>{profile.preferredNumber ?? '—'}</Value>}
            </Field>
            <Field label="Tình trạng sức khỏe">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                profile.healthStatus === 'FIT'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              }`}>
                {profile.healthStatus === 'FIT' ? '✅ Sẵn sàng' : '🤕 Chấn thương'}
              </span>
            </Field>
          </div>
        </div>
      </div>

      {/* Action buttons khi đang edit */}
      {editing && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setEditing(false)}
            className="px-5 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Helper components ─────────────────────────────────────────────────────────
function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Value({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div className={`text-sm font-medium ${muted ? 'text-gray-400' : 'text-gray-800'} py-1.5`}>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, maxLength }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}