import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Trophy, Calendar, MapPin, Users, 
  Save, LayoutGrid, Info, Loader2 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { tournamentApi } from '../api/tournamentApi';
import { toast } from 'react-toastify';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  tournamentId: number | null; // Truyền ID của giải đấu cần sửa
}

const UpdateTournamentModal = ({ isOpen, onClose, onRefresh, tournamentId }: Props) => {
  const [sports, setSports] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // 1. Fetch danh mục (Sports, Venues) và Chi tiết giải đấu
  useEffect(() => {
    if (isOpen && tournamentId) {
      const fetchData = async () => {
        setIsDataLoading(true);
        try {
          // Fetch song song Sports, Venues và Tournament Detail
          const [sRes, vRes, tRes]: any = await Promise.all([
            tournamentApi.getSports(),
            tournamentApi.getVenues(),
            tournamentApi.getTournamentById(tournamentId)
          ]);

          setSports(sRes.result || []);
          setVenues(vRes.result || []);

          // 2. Prefill dữ liệu vào Form
          // Lưu ý: Chuyển đổi định dạng ngày yyyy-MM-dd để input[type="date"] hiểu được
          const detail = tRes.result;
          // Chèn đoạn này để kiểm tra
console.group("🔍 KIỂM TRA DỮ LIỆU TRƯỚC KHI ĐỔ VÀO FORM");
console.log("=== TOÀN BỘ RESPONSE TỪ API ===");
console.table(detail);
console.log("VĐV Tối thiểu (minAthletes):", detail.minAthletes);
console.log("VĐV Tối đa (maxAthletes):", detail.maxAthletes);
console.log("Tên các trường đang có trong object:", Object.keys(detail));
console.log("=== KIỂM TRA CÁC FIELD TƯƠNG TỰ ===");
console.log("maxNumber:", detail.maxNumber);
console.log("max_athletes:", detail.max_athletes);
console.log("maximumAthletes:", detail.maximumAthletes);
console.log("max:", detail.max);
console.groupEnd();
          
          const formData = {
            ...detail,
            sportId: detail.sportId || detail.sport?.id,
            venueId: detail.venueId || detail.venue?.id,
            startDate: detail.startDate?.split('T')[0],
            endDate: detail.endDate?.split('T')[0],
            lostPoints: detail.lostPoints ?? detail.lossPoints,
            maxAthletes: detail.maxAthletes,
            minAthletes: detail.minAthletes
          };
          
          
          reset(formData);
        } catch (e) {
          toast.error("Không thể tải thông tin giải đấu");
          onClose();
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, tournamentId, reset]);

  const onSubmit = async (data: any) => {
    if (!tournamentId) return;
    try {
      const payload = {
        ...data,
        sportId: Number(data.sportId),
        venueId: Number(data.venueId),
        minAthletes: Number(data.minAthletes),
        maxAthletes: Number(data.maxAthletes),
      };
      
      await tournamentApi.update(tournamentId, payload);
      toast.success("Cập nhật thông tin thành công!");
      onClose();
      onRefresh();
    } catch (e) {
      toast.error("Lỗi khi cập nhật giải đấu");
    }
  };

  // Variants giữ nguyên như Form Add để đồng bộ UX
  const modalVariants = {
    hidden: { y: "100vh", opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, opacity: 1, scale: 1,
      transition: { type: "spring"as  const, damping: 25, stiffness: 300 }
    },
    exit: { y: "100vh", opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div 
            variants={modalVariants} initial="hidden" animate="visible" exit="exit"
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="px-8 py-5 border-b flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                  <Save size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Cập nhật giải đấu</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            {isDataLoading ? (
              <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-500">
                <Loader2 className="animate-spin" size={40} />
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
                {/* Các trường Input tương tự như Form Add */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Info size={16} className="text-blue-500" /> Tên giải đấu *
                  </label>
                  <input 
                    {...register("name", { required: true })}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Trophy size={16} className="text-orange-500" /> Môn thể thao *</label>
                    <select {...register("sportId", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500">
                      {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><LayoutGrid size={16} className="text-purple-500" /> Định dạng *</label>
                    <select {...register("format", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="ROUND_ROBIN">Vòng tròn</option>
                      <option value="KNOCKOUT">Loại trực tiếp</option>
                      <option value="GROUP_STAGE">Chia bảng</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Calendar size={16} className="text-blue-500" /> Ngày bắt đầu *</label>
                    <input type="date" {...register("startDate", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Calendar size={16} className="text-red-500" /> Ngày kết thúc *</label>
                    <input type="date" {...register("endDate", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Users size={16} className="text-red-500" /> Vận động viên tối đa *</label>
                    <input type="number" {...register("maxAthletes", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Users size={16} className="text-blue-500" /> Vân Động Viên tối thiểu *</label>
                    <input type="number" {...register("minAthletes", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3" />
                  </div>
                  
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> Địa điểm *</label>
                  <select {...register("venueId", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500">
                    {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button type="button" onClick={onClose} className="py-3.5 rounded-2xl font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all">
                    Hủy
                  </button>
                  <button type="submit" className="py-3.5 rounded-2xl font-bold text-white bg-blue-600 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                    Cập nhật thông tin
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpdateTournamentModal;

