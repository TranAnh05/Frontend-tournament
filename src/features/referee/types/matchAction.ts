export interface PlayerDto {
    lineupId: number;
    athleteId: number;
    fullName: string;
    identityNumber: string;
    portraitUrl: string | null;
    jerseyNumber: number | null;
    position: string | null;
    isConfirmed: boolean;
}

// 🌟 THÊM MỚI: Ghi nhận lịch sử điểm số của từng Hiệp / Set
export interface PeriodScoreDto {
    periodName: string;   // VD: "Set 1", "Hiệp 1"
    homeScore: number;    // Điểm đội nhà trong Set này
    awayScore: number;    // Điểm đội khách trong Set này
    isFinished: boolean;  // True: Set đã kết thúc | False: Set đang diễn ra
}

export interface TeamLineupDto {
    setsWon: number;
    clubId: number;
    clubName: string;
    logoUrl: string | null;
    
    // 🌟 CẬP NHẬT TỪ BACKEND
    // Với Bóng đá: Là tổng bàn thắng
    // Với Cầu lông/Bóng bàn/Tennis: Là Tỷ số Set (Ví dụ: 1 hoặc 2)
    matchScore: number; 

    // 🌟 THÊM MỚI: Điểm của hiệp/set đang diễn ra (Tự động reset về 0 khi sang Set mới)
    currentPeriodScore: number; 

    startingPlayers: PlayerDto[];
    substitutePlayers: PlayerDto[];
    sentOffPlayers?: PlayerDto[];
}

export interface MatchDetailResponse {
    matchId: number;
    tournamentName: string;
    sportName: string;
    scheduledTime: string;
    location: string;
    status:
        | "SCHEDULED"
        | "IN_PROGRESS"
        | "PAUSED"
        | "FINISHED"
        | "CANCELED"
        | "FINALIZED";
    sportRules: Record<string, string>;
    
    // 🌟 THÊM MỚI: Mảng chứa lịch sử các Set đã/đang đấu
    periodScores: PeriodScoreDto[]; 
    
    homeTeam: TeamLineupDto;
    awayTeam: TeamLineupDto;
    timeline: MatchEventDto[];
}

export interface MatchEventDto {
    id: number;
    eventType: string;
    eventTime: string;
    description: string;
    createdAt: string;
    primaryAthleteName?: string;
    primaryAthleteNumber?: number;
    secondaryAthleteName?: string;
    secondaryAthleteNumber?: number;
    clubId?: number;
}

export interface ConfirmLineupRequest {
    lineupIds: number[];
}

export interface ChangeMatchStatusRequest {
    targetStatus: "IN_PROGRESS" | "PAUSED" | "FINISHED" | "CANCELED";
    note?: string;
    eventTime?: string;
}

export interface CreateMatchEventRequest {
    eventType: string;
    eventTime: string;
    clubId?: number | null;
    primaryAthleteId?: number | null;
    secondaryAthleteId?: number | null;
    description?: string;
}

export interface FinalizeMatchRequest {
    note?: string;
}