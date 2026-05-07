import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { SportsForm } from './SportsForm';
import { useMutateSport } from '../../hooks/sports/useMutateSport';
import { type SportCreateFormValues } from '../../schemas/sportsSchema';

interface SportsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // refresh lại bảng dữ liệu sau khi thêm thành công
}

export const SportsDrawer: React.FC<SportsDrawerProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createSport, isCreating } = useMutateSport();

  // Khóa cuộn trang nền khi Drawer đang mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (data: SportCreateFormValues) => {
    try {
      await createSport(data, () => {
        onSuccess();
        onClose();   
      });
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  return (
    <>
      {/* Nền mờ - Bấm vào nền này cũng sẽ đóng Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Khung trượt chính */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-gray-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header của Drawer */}
        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-200 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Thêm môn thể thao mới</h2>
            <p className="text-sm text-gray-500 mt-1">Thiết lập thông tin và bộ quy tắc thi đấu chuẩn.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Đóng cửa sổ"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body của Drawer: */}
        <div className="flex-1 overflow-hidden p-6">
          <SportsForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isCreating}
          />
        </div>
      </div>
    </>
  );
};