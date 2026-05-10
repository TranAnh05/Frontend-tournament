export interface DashboardFilterParams {
    startDate?: string;
    endDate?: string;
    sportId?: number;
}

export interface KpiMetric {
    value: number;
    trend: number;
}

export interface DashboardKpiResponse {
    totalTournaments: KpiMetric;
    totalUsers: KpiMetric;
    totalClubs: KpiMetric;
    totalMatchesPlayed: KpiMetric;
}

export interface ChartDataProjection {
    label: string;
    value: number;
}

export interface ActivityTrendProjection {
    timeLabel: string;
    newTournaments: number;
}

export interface DashboardChartsResponse {
    tournamentsBySport: ChartDataProjection[];
    venueUsage: ChartDataProjection[];
    activityTrends: ActivityTrendProjection[];
}

export interface TeamDto {
    id: number;
    name: string;
    logoUrl: string | null;
    score: number;
}

export interface LiveMatchResponse {
    matchId: number;
    tournamentName: string;
    sportName: string;
    startTime: string;
    venueName: string;
    status: string;
    liveMinute: number;
    homeTeam: TeamDto;
    awayTeam: TeamDto;
}

export interface ActivityLogResponse {
    type: string;
    message: string;
    createdAt: string;
}
