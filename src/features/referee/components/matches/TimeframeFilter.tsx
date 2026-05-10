import React from 'react';
import { cn } from '@/utils/classNames';

interface TimeframeFilterProps {
  activeTab: 'UPCOMING' | 'PAST';
  onChange: (tab: 'UPCOMING' | 'PAST') => void;
}

export const TimeframeFilter: React.FC<TimeframeFilterProps> = ({ activeTab, onChange }) => {
  return (
    <div className="bg-gray-100 p-1 rounded-xl flex w-full max-w-md mx-auto mb-6">
      <button
        onClick={() => onChange('UPCOMING')}
        className={cn(
          "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
          activeTab === 'UPCOMING' 
            ? "bg-white text-blue-600 shadow-sm" 
            : "text-gray-500 hover:text-gray-700"
        )}
      >
        Lịch sắp tới
      </button>
      <button
        onClick={() => onChange('PAST')}
        className={cn(
          "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
          activeTab === 'PAST' 
            ? "bg-white text-blue-600 shadow-sm" 
            : "text-gray-500 hover:text-gray-700"
        )}
      >
        Lịch sử / Đã bắt
      </button>
    </div>
  );
};