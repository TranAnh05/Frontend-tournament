import React from "react";
// Import thêm CheckSquare và Square để làm Checkbox
import { CheckCircle2, UserCircle, CheckSquare, Square } from "lucide-react";
import { type PlayerDto } from "../../types/matchAction";
import { cn } from "@/utils/classNames";

interface PlayerVerificationCardProps {
    player: PlayerDto;
    isSelected: boolean;
    onToggle: (lineupId: number) => void;
}

export const PlayerVerificationCard: React.FC<PlayerVerificationCardProps> = ({
    player,
    isSelected,
    onToggle,
}) => {
    const isConfirmed = player.isConfirmed;

    return (
        <div
            onClick={() => !isConfirmed && onToggle(player.lineupId)}
            className={cn(
                "rounded-2xl p-4 border flex items-center gap-4 transition-all duration-200",
                isConfirmed
                    ? "border-green-200 bg-green-50/50 cursor-default opacity-80" 
                    : isSelected
                      ? "border-blue-500 bg-blue-50 cursor-pointer shadow-sm" 
                      : "border-gray-200 bg-white cursor-pointer hover:border-blue-300", 
            )}
        >
            {/* Cột 1: Ảnh chân dung */}
            <div className="w-14 h-14 shrink-0 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 shadow-inner">
                {player.portraitUrl ? (
                    <img
                        src={player.portraitUrl}
                        alt={player.fullName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <UserCircle size={32} className="text-gray-400" />
                )}
            </div>

            {/* Cột 2: Thông tin VĐV */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">
                    {player.fullName}
                </h4>
                <p className="text-xs text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-[11px] text-gray-600 bg-gray-100 px-1 rounded">
                        ID: {player.identityNumber}
                    </span>
                    {player.jerseyNumber && (
                        <span className="bg-gray-100 text-gray-700 text-xs font-black px-1.5 py-0.5 rounded border border-gray-200">
                            Số {player.jerseyNumber}
                        </span>
                    )}
                </p>
            </div>

            {/* Cột 3: Trạng thái / Checkbox */}
            <div className="shrink-0 flex items-center justify-center w-8">
                {isConfirmed ? (
                    <CheckCircle2 size={24} className="text-green-500" />
                ) : isSelected ? (
                    <CheckSquare size={24} className="text-blue-600" />
                ) : (
                    <Square size={24} className="text-gray-300" />
                )}
            </div>
        </div>
    );
};
