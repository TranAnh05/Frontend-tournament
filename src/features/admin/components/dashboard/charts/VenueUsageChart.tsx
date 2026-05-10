/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Cell 
} from 'recharts';
import { type ChartDataProjection } from '../../../types/dashboard';

interface VenueUsageChartProps {
  data: ChartDataProjection[] | undefined;
  isLoading: boolean;
}

const BAR_COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 max-w-[200px]">
        <p className="font-bold text-gray-800 text-sm mb-1 leading-tight">{payload[0].payload.label}</p>
        <p className="text-purple-600 text-sm font-semibold">
          {payload[0].value} giải đấu
        </p>
      </div>
    );
  }
  return null;
};

export const VenueUsageChart: React.FC<VenueUsageChartProps> = ({ data, isLoading }) => {
  if (isLoading) return <div className="h-full w-full bg-gray-50 rounded-xl animate-pulse"></div>;
  if (!data || data.length === 0) return <div className="h-full w-full flex items-center justify-center text-gray-400 italic text-sm">Chưa có dữ liệu địa điểm</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-base font-bold text-gray-800 mb-4">Sân thi đấu sôi động nhất</h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            {/* Ẩn tick trục X vì tên địa điểm quá dài, chỉ hiển thị gạch ngắn */}
            <XAxis dataKey="label" axisLine={false} tick={false} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};