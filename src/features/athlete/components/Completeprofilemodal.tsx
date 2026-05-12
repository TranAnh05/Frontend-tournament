import { useState } from 'react';
import { toast } from 'react-toastify';
import { athletePublicApi } from '../api/athletePublicApi';
import type { UpdateAthleteProfileRequest } from '../types';

interface CompleteProfileModalProps {
  onCompleted: () => void;
}

export default function CompleteProfileModal({ onCompleted }: CompleteProfileModalProps) {
  const [form, setForm] = useState({
    identityNumber: '',
    dateOfBirth: '',
    preferredNumber: '',
    preferredPosition: '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const POSITIONS = [
    'Thủ môn', 'Trung vệ', 'Hậu vệ cánh', 'Tiền vệ phòng ngự',
    'Tiền vệ trung tâm', 'Tiền vệ công', 'Tiền vệ cánh',
    'Tiền đạo cánh', 'Tiền đạo cắm', 'Trung phong',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.identityNumber.trim()) {
      errs.identityNumber = 'Vui lòng nhập số CCCD/Hộ chiếu';
    } else if (!/^\d{9,12}$/.test(form.identityNumber.trim())) {
      errs.identityNumber = 'Số CCCD phải có 9–12 chữ số';
    }

    if (!form.dateOfBirth) {
      errs.dateOfBirth = 'Vui lòng chọn ngày sinh';
    } else {
      const age = (Date.now() - new Date(form.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 10 || age > 100) errs.dateOfBirth = 'Ngày sinh không hợp lệ';
    }

    if (form.preferredNumber) {
      const n = Number(form.preferredNumber);
      if (!Number.isInteger(n) || n < 1 || n > 99) {
        errs.preferredNumber = 'Số áo từ 1 đến 99';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const setField = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const data: UpdateAthleteProfileRequest = {
        identityNumber: form.identityNumber.trim(),
        dateOfBirth: form.dateOfBirth,
        ...(form.preferredNumber ? { preferredNumber: Number(form.preferredNumber) } : {}),
        ...(form.preferredPosition ? { preferredPosition: form.preferredPosition } : {}),
      };
      await athletePublicApi.updateMyProfile(data);
      toast.success('Hồ sơ đã được cập nhật!');
      onCompleted();
    } catch {
      toast.error('Cập nhật thất bại, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all
    ${errors[field]
      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
      : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              📋
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Hoàn thiện hồ sơ</h2>
              <p className="text-blue-200 text-xs mt-0.5">Bắt buộc để sử dụng đầy đủ tính năng</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          <p className="text-gray-500 text-sm mb-5">
            Vui lòng điền đầy đủ thông tin cá nhân để hoàn tất hồ sơ vận động viên.
          </p>

          {/* CCCD - bắt buộc */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Số CCCD / Hộ chiếu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: 079200012345"
              value={form.identityNumber}
              onChange={e => setField('identityNumber', e.target.value)}
              className={inputClass('identityNumber')}
            />
            {errors.identityNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.identityNumber}</p>
            )}
          </div>

          {/* Ngày sinh - bắt buộc */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.dateOfBirth}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setField('dateOfBirth', e.target.value)}
              className={inputClass('dateOfBirth')}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Số áo - tuỳ chọn */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Số áo yêu thích
              <span className="text-gray-400 font-normal text-xs ml-1">(tuỳ chọn)</span>
            </label>
            <input
              type="number"
              placeholder="VD: 10"
              min={1}
              max={99}
              value={form.preferredNumber}
              onChange={e => setField('preferredNumber', e.target.value)}
              className={inputClass('preferredNumber')}
            />
            {errors.preferredNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.preferredNumber}</p>
            )}
          </div>

          {/* Vị trí - tuỳ chọn */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Vị trí thi đấu sở trường
              <span className="text-gray-400 font-normal text-xs ml-1">(tuỳ chọn)</span>
            </label>
            <select
              value={form.preferredPosition}
              onChange={e => setField('preferredPosition', e.target.value)}
              className={inputClass('preferredPosition')}
            >
              <option value="">-- Chọn vị trí --</option>
              {POSITIONS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60
              text-white font-bold text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {saving ? 'Đang lưu...' : 'Xác nhận & Tiếp tục'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-3">
            Thông tin này được bảo mật và chỉ dùng cho mục đích thi đấu
          </p>
        </div>
      </div>
    </div>
  );
}