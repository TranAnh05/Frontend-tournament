/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";
import { type ChartDataProjection } from "../../../types/dashboard";

// Bảng màu đẹp mắt mang phong cách Tailwind
const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
];

interface SportDistributionChartProps {
    data: ChartDataProjection[] | undefined;
    isLoading: boolean;
}

export const SportDistributionChart: React.FC<SportDistributionChartProps> = ({
    data,
    isLoading,
}) => {
    if (isLoading)
        return (
            <div className="h-full w-full bg-gray-50 rounded-xl animate-pulse"></div>
        );
    if (!data || data.length === 0)
        return (
            <div className="h-full w-full flex items-center justify-center text-gray-400 italic text-sm">
                Chưa có dữ liệu môn thể thao
            </div>
        );

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-base font-bold text-gray-800 mb-2">
                Tỷ trọng Môn thi đấu
            </h3>
            <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="label"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            formatter={(value: any) => [
                                `${value} giải`,
                                "Số lượng",
                            ]}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: "12px" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
