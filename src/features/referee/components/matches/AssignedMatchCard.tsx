import React from 'react';
import { Calendar, MapPin, ChevronRight, Shield } from 'lucide-react';
import { type RefereeAssignedMatchResponse } from '../../types/matches';
import { cn } from '@/utils/classNames';
import { Link } from 'react-router-dom';

interface AssignedMatchCardProps {
  match: RefereeAssignedMatchResponse;
}

export const AssignedMatchCard: React.FC<AssignedMatchCardProps> = ({ match }) => {
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'MAIN': return { text: 'Trọng tài chính', color: 'bg-red-100 text-red-700 border-red-200' };
      case 'ASSISTANT': return { text: 'Trọng tài biên', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'FOURTH': return { text: 'Trọng tài bàn', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      default: return { text: 'Giám sát', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const roleStyle = getRoleDisplay(match.refereeRole);
  const matchDate = new Date(match.scheduledTime);

  return (
    <Link 
      to={`/referee/${match.matchId}`}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
    >
      {/* Top: Thời gian & Vai trò */}
      <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
        <div>
          <div className="flex items-center text-sm font-bold text-gray-900 mb-1">
            <Calendar size={16} className="mr-1.5 text-blue-600" />
            {matchDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            {matchDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className={cn("px-2.5 py-1 text-xs font-bold border rounded-lg", roleStyle.color)}>
          {roleStyle.text}
        </div>
      </div>

      {/* Middle: Đội bóng */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col items-center w-2/5">
          <div className="w-12 h-12 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden mb-1.5">
            {match.homeTeam.logoUrl ? (
               <img src={match.homeTeam.logoUrl} alt={match.homeTeam.shortName} className="w-full h-full object-cover" />
            ) : <Shield size={20} className="text-gray-300" />}
          </div>
          <span className="text-sm font-bold text-gray-800 text-center line-clamp-2 leading-tight">
            {match.homeTeam.name}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center w-1/5">
          {match.matchStatus === 'FINISHED' ? (
             <div className="text-xl font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
               {match.homeTeam.score} - {match.awayTeam.score}
             </div>
          ) : (
            <div className="text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">VS</div>
          )}
        </div>

        <div className="flex flex-col items-center w-2/5">
          <div className="w-12 h-12 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden mb-1.5">
            {match.awayTeam.logoUrl ? (
               <img src={match.awayTeam.logoUrl} alt={match.awayTeam.shortName} className="w-full h-full object-cover" />
            ) : <Shield size={20} className="text-gray-300" />}
          </div>
          <span className="text-sm font-bold text-gray-800 text-center line-clamp-2 leading-tight">
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Bottom: Địa điểm & Giải đấu */}
      <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
        <div className="flex-1 pr-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5 line-clamp-1">
            {match.tournamentName}
          </p>
          <p className="text-xs text-gray-600 flex items-center mt-1">
            <MapPin size={12} className="mr-1 shrink-0 text-gray-400" />
            <span className="line-clamp-1">{match.location}</span>
          </p>
        </div>
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </div>
    </Link>
  );
};