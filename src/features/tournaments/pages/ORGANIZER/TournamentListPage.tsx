import { Button, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useTournaments } from '../../hooks/useTournaments';
import TournamentTable from '../../components/TournamentTable';
import AddTournamentModal from '../../components/AddTournamentModal';
import UpdateTournamentModal from '../../components/UpdateTournamentModal';
import { useState } from 'react';

const TournamentListPage = () => {
 const { data, loading, total, queryParams, setQueryParams} = useTournaments();
 // Xử lý khi đổi trang hoặc đổi size
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isEditOpen, setIsEditOpen] = useState(false);
 const [selectedTourId, setSelectedTourId] = useState<number | null>(null);

// Khai báo state để lưu ID của giải đấu đang được chọn để sửa


  const handleTableChange = (pagination: any) => {
    setQueryParams(prev => ({
      ...prev,
      page: pagination.current - 1, // Antd dùng base 1, Spring dùng base 0
      size: pagination.pageSize
    }));
  };
  // Xử lý tìm kiếm (Debounce hoặc nhấn Enter)
 const handleSearch = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      search: value.trim(), // Lấy giá trị từ ô input
      page: 0, // Reset về trang đầu tiên khi tìm kiếm mới
    }));
  };
  const handleRefresh = () => {
    setQueryParams(prev => ({ ...prev })); 
  };
  return (
   <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý Giải đấu</h1>
        <Button type="primary" icon={<PlusOutlined />}
         size="large"
        onClick={() => setIsAddModalOpen(true)}>Tạo giải mới</Button>
      </div>

      <AddTournamentModal 
      isOpen={isAddModalOpen} 
      onClose={() => setIsAddModalOpen(false)} 
      onRefresh={handleRefresh} // Hàm gọi lại danh sách sau khi thêm thành công
    />

      <div className="bg-white p-4 rounded-t-xl border-b">
        <Input.Search
          placeholder="Tìm tên giải đấu..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          className="max-w-md"
        />
      </div>

      <div className="bg-white p-4 rounded-b-xl shadow-sm">
        <TournamentTable 
          data={data} 
          loading={loading} 
          onEdit={(id: number) => { // ✨ Thêm prop này
          setSelectedTourId(id);
         setIsEditOpen(true);
           }}
          pagination={{
            current: queryParams.page + 1,
            pageSize: queryParams.size,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showTotal: (total: number) => `Tổng cộng ${total} giải đấu`,
          }}
          onChange={handleTableChange}
        />
        {/* Modal Cập nhật */}
<UpdateTournamentModal 
        isOpen={isEditOpen}
        tournamentId={selectedTourId}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTourId(null);
        }}
        onRefresh={handleRefresh} // Truyền hàm load lại dữ liệu
      />
      </div>
    </div>
  );;
};

export default TournamentListPage;