import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Trophy, Calendar, MapPin, Users, 
  PlusCircle, Save, LayoutGrid, Info 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import  {  tournamentApi } from '../api/tournamentApi';
import { toast } from 'react-toastify';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const AddTournamentModal = ({ isOpen, onClose, onRefresh }: Props) => {
  const [sports, setSports] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Load danh mục Sport & Venue
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [sRes, vRes]: any = await Promise.all([
            tournamentApi.getSports(),
            tournamentApi.getVenues()
          ]);
        console.log("Dữ liệu Sport:", sRes.result);
        console.log("Dữ liệu Venue:", vRes.result);
         const sportData = sRes?.result || (Array.isArray(sRes) ? sRes : []);
         setSports(sportData);
          setVenues(vRes.result || []);
        } catch (e) {
          setSports([]); // Nếu lỗi cũng phải về mảng rỗng
            setVenues([]);
        }
      };
      fetchData();
    } 
  }, [isOpen] );

  const onSubmit = async (data: any) => {
    try {
      // Backend yêu cầu kiểu dữ liệu số cho ID và Athletes
      const payload = {
        ...data,
        sportId: Number(data.sportId),
        venueId: Number(data.venueId),
        minAthletes: Number(data.minAthletes),
        maxAthletes: Number(data.maxAthletes),
      };
      await tournamentApi.create(payload);
      toast.success("Tạo giải đấu bản nháp thành công!");
      reset();
      onClose();
      onRefresh();
    } catch (e) {
      toast.error("Lỗi khi tạo giải đấu");
    }
  };

  // ✨ Animation Variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { y: "100vh", opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, opacity: 1, scale: 1,
      transition: { type: "spring" as const , damping: 25, stiffness: 300 }
    },
    exit: { y: "100vh", opacity: 0, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* ✨ Backdrop fade in/out */}
          <motion.div 
            variants={backdropVariants}
            initial="hidden" animate="visible" exit="hidden"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* ✨ Modal slide up & scale */}
          <motion.div 
            variants={modalVariants}
            initial="hidden" animate="visible" exit="exit"
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="px-8 py-5 border-b flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                  <PlusCircle size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Tạo giải đấu mới</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Form với ✨ Stagger animation */}
            <motion.form 
              onSubmit={handleSubmit(onSubmit)}
              className="p-8 space-y-5 max-h-[80vh] overflow-y-auto"
              initial="hidden" animate="visible"
              transition={{ staggerChildren: 0.08 }}
            >
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Info size={16} className="text-blue-500" /> Tên giải đấu *
                </label>
                <input 
                  {...register("name", { required: true })}
                  className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="VD: National Football Championship 2026" 
                />
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Trophy size={16} className="text-orange-500" /> Môn thể thao *</label>
                  <select {...register("sportId", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500">
                 <option value="">-- Chọn môn --</option>
                  {/* Dùng Optional Chaining để an toàn */}
                  {sports?.map((s: any) => (
                   <option key={s.id} value={s.id}>
                  {s.name} 
                 </option>
  ))}
                  </select>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><LayoutGrid size={16} className="text-purple-500" /> Định dạng *</label>
                  <select {...register("format", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Chọn định dạng --</option>
                    <option value="ROUND_ROBIN">Vòng tròn (Round Robin)</option>
                    <option value="KNOCKOUT">Loại trực tiếp</option>
                    <option value="GROUP_STAGE">chia bảng</option>
                  </select>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Calendar size={16} className="text-blue-500" /> Ngày bắt đầu *</label>
                  <input type="date" {...register("startDate", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3" />
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Calendar size={16} className="text-red-500" /> Ngày kết thúc *</label>
                  <input type="date" {...register("endDate", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3" />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> Địa điểm tổ chức *</label>
                <select {...register("venueId", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Chọn địa điểm --</option>
                  {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Users size={16} /> VĐV tối thiểu *</label>
                  <input type="number" {...register("minAthletes", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3" placeholder="VD: 8" />
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Users size={16} /> VĐV tối đa *</label>
                  <input type="number" {...register("maxAthletes", { required: true })} className="w-full bg-slate-50 border-none rounded-xl p-3" placeholder="VD: 32" />
                </motion.div>
              </div>

              {/* ✨ Buttons hover/tap */}
              <div className="flex gap-4 pt-6">
                <motion.button 
                  type="button" onClick={onClose}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-slate-500 border border-slate-200"
                >
                  Hủy
                </motion.button>
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                  className="flex-[2] py-3.5 rounded-2xl font-bold text-white bg-blue-600 shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                >
                  <Save size={20} /> Tạo giải đấu
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddTournamentModal;