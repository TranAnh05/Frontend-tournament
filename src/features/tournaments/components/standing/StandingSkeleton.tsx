import React from 'react';

export const StandingSkeleton: React.FC = () => {
    // Tạo mảng ảo 4 dòng để map ra các hàng (rows) đang tải
    const fakeRows = Array.from({ length: 4 });
    // Tùy chọn render 2 khung bảng để mô phỏng lưới grid 2 cột
    const fakeTables = Array.from({ length: 2 });

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
            {fakeTables.map((_, tableIndex) => (
                <div key={tableIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    {/* Skeleton Header Bảng */}
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
                        <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
                    </div>

                    {/* Skeleton Cột Table */}
                    <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-4">
                        <div className="h-3 bg-gray-200 rounded w-6 shrink-0"></div>
                        <div className="h-3 bg-gray-200 rounded flex-1"></div>
                        <div className="flex gap-4 shrink-0 hidden sm:flex">
                            <div className="h-3 bg-gray-200 rounded w-6"></div>
                            <div className="h-3 bg-gray-200 rounded w-6"></div>
                            <div className="h-3 bg-gray-200 rounded w-6"></div>
                        </div>
                    </div>

                    {/* Skeleton Danh sách CLB */}
                    <div className="divide-y divide-gray-50">
                        {fakeRows.map((__, rowIndex) => (
                            <div key={rowIndex} className="px-5 py-4 flex items-center gap-4">
                                {/* Hạng */}
                                <div className="w-6 h-6 bg-gray-200 rounded-full shrink-0"></div>
                                
                                {/* Logo + Tên Đội */}
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full shrink-0"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4 sm:w-1/2"></div>
                                </div>
                                
                                {/* Các chỉ số */}
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="h-3 bg-gray-200 rounded w-5 hidden sm:block"></div>
                                    <div className="h-3 bg-gray-200 rounded w-5 hidden sm:block"></div>
                                    <div className="h-3 bg-gray-200 rounded w-5 hidden sm:block"></div>
                                    <div className="h-5 bg-blue-100 rounded-md w-8"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};