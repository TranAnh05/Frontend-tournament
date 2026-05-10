/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { type ActivityTrendProjection } from "../../../types/dashboard";

interface ActivityTrendChartProps {
    data: ActivityTrendProjection[] | undefined;
    isLoading: boolean;
}

export const ActivityTrendChart: React.FC<ActivityTrendChartProps> = ({
    data,
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className="h-full w-full bg-gray-50 rounded-xl animate-pulse"></div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-gray-400 italic text-sm">
                Chưa có dữ liệu xu hướng
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-base font-bold text-gray-800 mb-4">
                Xu hướng tạo giải đấu
            </h3>
            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorTournaments"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f3f4f6"
                        />
                        <XAxis
                            dataKey="timeLabel"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            formatter={(value: any) => [
                                `${value} giải đấu`,
                                "Số lượng",
                            ]}
                            labelStyle={{
                                fontWeight: "bold",
                                color: "#374151",
                                marginBottom: "4px",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="newTournaments"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTournaments)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
