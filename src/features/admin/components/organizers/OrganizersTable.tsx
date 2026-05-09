import React from 'react';
import { Eye, User, Phone, Calendar, SearchX } from 'lucide-react';
import { type OrganizerResponse } from '../../types/organizers';
import { cn } from '@/utils/classNames';

interface OrganizersTableProps {
  organizers: OrganizerResponse[];
  isLoading: boolean;
  onViewDetail: (organizer: OrganizerResponse) => void;
  onToggleStatus: (organizer: OrganizerResponse) => void;
}

export const OrganizersTable: React.FC<OrganizersTableProps> = ({
  organizers,
  isLoading,
  onViewDetail,
  onToggleStatus,
}) => {
  // Hàm định dạng ngày tháng: ISO String -> DD/MM/YYYY
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Trạng thái Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Trạng thái Trống 
  if (organizers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 text-gray-500 shadow-sm">
        <SearchX size={48} className="mb-4 text-gray-300" />
        <p className="text-lg font-medium text-gray-900">Không tìm thấy thành viên nào</p>
        <p className="text-sm">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Thành viên</th>
              <th className="px-6 py-4 font-semibold">Liên hệ</th>
              <th className="px-6 py-4 font-semibold">Ngày tham gia</th>
              <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {organizers.map((organizer) => (
              <tr key={organizer.id} className="hover:bg-gray-50/80 transition-colors group">
                {/*  AVATAR + HỌ TÊN + EMAIL */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center">
                      {organizer.avatarUrl ? (
                        <img
                          src={organizer.avatarUrl}
                          alt={organizer.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 truncate max-w-[180px]">
                        {organizer.fullName}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[180px]">
                        {organizer.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/*  SỐ ĐIỆN THOẠI */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone size={14} className="text-gray-400" />
                    {organizer.phoneNumber || '---'}
                  </div>
                </td>

                {/* CỘT NGÀY THAM GIA */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    {formatDate(organizer.createdAt)}
                  </div>
                </td>

                {/* CỘT TRẠNG THÁI */}
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onToggleStatus(organizer)}
                      className="focus:outline-none"
                      title={organizer.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                    >
                      <div
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                          organizer.status === 'ACTIVE' ? "bg-green-500" : "bg-gray-300"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 shadow-sm",
                            organizer.status === 'ACTIVE' ? "translate-x-6" : "translate-x-1"
                          )}
                        />
                      </div>
                    </button>
                  </div>
                </td>

                {/* XEM CHI TIẾT */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onViewDetail(organizer)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Xem chi tiết hồ sơ"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};