import React from 'react';
import { LayoutGrid, Trophy } from 'lucide-react';
import { cn } from '@/utils/classNames';

// Export type này ra ngoài để StandingsPage tái sử dụng, tránh lỗi gõ sai chính tả (Magic strings)
export type StandingViewMode = 'GROUP' | 'OVERALL';

interface StandingViewSwitcherProps {
    viewMode: StandingViewMode;
    onChange: (mode: StandingViewMode) => void;
}

export const StandingViewSwitcher: React.FC<StandingViewSwitcherProps> = ({ 
    viewMode, 
    onChange 
}) => {
    return (
        <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit border border-gray-200 shadow-inner mb-8">
            <button 
                onClick={() => onChange('GROUP')}
                className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                    viewMode === 'GROUP' 
                        ? "bg-white text-blue-700 shadow-sm transform scale-[1.02]" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                )}
            >
                <LayoutGrid size={18} className={viewMode === 'GROUP' ? "text-blue-600" : "text-gray-400"} />
                Xếp hạng theo bảng
            </button>
            
            <button 
                onClick={() => onChange('OVERALL')}
                className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                    viewMode === 'OVERALL' 
                        ? "bg-white text-blue-700 shadow-sm transform scale-[1.02]" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                )}
            >
                <Trophy size={18} className={viewMode === 'OVERALL' ? "text-blue-600" : "text-gray-400"} />
                Bảng tổng sắp toàn giải
            </button>
        </div>
    );
};