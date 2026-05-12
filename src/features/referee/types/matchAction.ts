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

export interface TeamLineupDto {
    clubId: number;
    clubName: string;
    logoUrl: string | null;
    currentScore: number;
    startingPlayers: PlayerDto[];
    substitutePlayers: PlayerDto[];
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
