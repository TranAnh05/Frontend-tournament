import React from 'react';
import { BarChart } from 'lucide-react';

interface StandingEmptyStateProps {
    title?: string;
    message?: string;
}

export const StandingEmptyState: React.FC<StandingEmptyStateProps> = ({
    title = "Chưa có dữ liệu xếp hạng",
    message = "Vui lòng chọn một giải đấu từ danh sách phía trên hoặc đợi các trận đấu diễn ra để hệ thống tính toán điểm số."
}) => {
    return (
        <div className="bg-white rounded-3xl border border-gray-200 border-dashed p-12 flex flex-col items-center justify-center text-center min-h-[400px] animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
                <BarChart size={40} className="text-gray-300" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-xl font-black text-gray-800 mb-2">
                {title}
            </h3>
            
            <p className="text-sm font-medium text-gray-500 max-w-md mx-auto leading-relaxed">
                {message}
            </p>
        </div>
    );
};