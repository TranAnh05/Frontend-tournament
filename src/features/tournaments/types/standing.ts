// Định nghĩa chi tiết một dòng trong bảng xếp hạng của CLB
export interface ClubStandingDto {
    rank: number;
    clubId: number;
    clubName: string;
    shortName: string;
    logoUrl: string | null;
    matchesPlayed: number;
    won: number;
    drawn: number;
    lost: number;
    scoresFor: number; // Bàn thắng
    scoresAgainst: number; // Bàn thua
    scoreDifference: number; // Hiệu số
    totalPoints: number; // Tổng điểm
}

// Định nghĩa một Bảng đấu (Ví dụ: Bảng A, Bảng B...)
export interface GroupStandingDto {
    groupId: number;
    groupName: string;
    standings: ClubStandingDto[];
}

// Payload tổng trả về từ API
export interface TournamentStandingResponse {
    tournamentId: number;
    tournamentName: string;
    groups: GroupStandingDto[];
}

export interface TournamentLookupResponse {
    id: number;
    name: string;
    status: string;
    sportName: string; // Dùng để hiển thị Icon (Bóng đá, Cầu lông...)
}

export interface ClubOverallStandingDto {
    overallRank: number;     // Thứ hạng tổng thể toàn giải
    clubName: string;
    logoUrl: string | null;
    highestStageName: string; // Vòng đấu cao nhất đạt tới
    totalMatches: number;
    totalWon: number;
    totalDrawn: number;
    totalLost: number;
    totalGoalsScored: number;   
    totalGoalsAgainst: number;  
    totalDifference: number;    
    totalPoints: number;        
}

export interface OverallStandingResponse {
    tournamentId: number;
    tournamentName: string;
    rankings: ClubOverallStandingDto[];
}