import React, { useEffect } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/classNames';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  type?: 'danger' | 'info' | 'warning';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy bỏ',
  onConfirm,
  onCancel,
  isLoading = false,
  type = 'info',
}) => {
  // Khóa cuộn trang khi Modal mở
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

  if (!isOpen) return null;

  // Cấu hình màu sắc theo Type
  const themes = {
    danger: {
      icon: <AlertTriangle className="text-red-600" size={24} />,
      bgIcon: 'bg-red-100',
      buttonVariant: 'danger' as const,
    },
    warning: {
      icon: <AlertTriangle className="text-amber-600" size={24} />,
      bgIcon: 'bg-amber-100',
      buttonVariant: 'primary' as const,
    },
    info: {
      icon: <Info className="text-blue-600" size={24} />,
      bgIcon: 'bg-blue-100',
      buttonVariant: 'primary' as const,
    },
  };

  const currentTheme = themes[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop (Lớp nền mờ) */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onCancel : undefined}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon đại diện cho mức độ */}
            <div className={cn("p-3 rounded-full shrink-0", currentTheme.bgIcon)}>
              {currentTheme.icon}
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 leading-6">
                {title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {message}
              </p>
            </div>

            <button 
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={currentTheme.buttonVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};