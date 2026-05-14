import { useState, useEffect, useMemo } from "react";
import { type MatchDetailResponse } from "../../types/matchAction";

const formatSecondsToMMSS = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
};

export const useMatchTimer = (match: MatchDetailResponse | undefined) => {
    const [displayTime, setDisplayTime] = useState<string>("00:00");
    const [currentPeriod, setCurrentPeriod] = useState<number>(1);
    const [matchState, setMatchState] = useState<
        "WAITING_START" | "PLAYING" | "HALFTIME" | "FULL_TIME" | "ENDED"
    >("WAITING_START");

    // XỬ LÝ THUẬT NGỮ (HIỆP HAY SET)
    const periodName = useMemo(() => {
        if (!match?.sportName) return "Hiệp";
        const name = match.sportName.toLowerCase();
        if (
            name.includes("cầu lông") ||
            name.includes("bóng bàn") ||
            name.includes("tennis") ||
            name.includes("quần vợt")
        ) {
            return "Set";
        }
        return "Hiệp";
    }, [match?.sportName]);

    // Lấy loại đồng hồ từ luật
    const clockType = match?.sportRules?.CLOCK_TYPE || "COUNT_UP";

    // 🌟 TẠO TIỀN TỐ CHUẨN: Ví dụ "Set 1" hoặc "Hiệp 2"
    const periodPrefix = `${periodName} ${currentPeriod}`;

    useEffect(() => {
        if (!match || !match.timeline) return;

        const startEvents = match.timeline.filter(
            (e) => e.eventType === "START_PERIOD",
        );
        const endEvents = match.timeline.filter(
            (e) => e.eventType === "END_PERIOD",
        );

        const startCount = startEvents.length;
        const endCount = endEvents.length;
        const maxPeriods = parseInt(match.sportRules?.PERIODS || "2", 10);

        let activePeriod = 1;

        if (match.status === "FINISHED" || match.status === "CANCELED") {
            activePeriod = startCount > 0 ? startCount : 1;
        } else if (startCount === 0) {
            activePeriod = 1;
        } else if (startCount > endCount) {
            activePeriod = startCount;
        } else {
            if (startCount >= maxPeriods) {
                activePeriod = startCount;
            } else {
                activePeriod = startCount + 1;
            }
        }

        setCurrentPeriod(activePeriod);

        if (match.status === "FINISHED" || match.status === "CANCELED") {
            setMatchState("ENDED");
            setDisplayTime("KẾT THÚC");
            return;
        }

        if (startCount === 0) {
            setMatchState("WAITING_START");
            setDisplayTime("00:00");
            return;
        }

        const clockType = match.sportRules?.CLOCK_TYPE || "COUNT_UP";
        if (clockType === "SET_BASED") {
            // Đếm số Set cần để thắng (Ví dụ Best of 3 thì cần 2, Best of 5 thì cần 3)
            const requiredWins = Math.ceil(maxPeriods / 2);

            // Kiểm tra xem có đội nào đã đạt đủ số Set thắng chưa
            const homeMatchScore = match.homeTeam?.matchScore || 0;
            const awayMatchScore = match.awayTeam?.matchScore || 0;

            if (
                homeMatchScore >= requiredWins ||
                awayMatchScore >= requiredWins
            ) {
                setMatchState("FULL_TIME");
                setDisplayTime("KẾT THÚC");
                return; // Nếu đã có người thắng chung cuộc thì báo Kết thúc luôn, không sang Set 3.
            }
        }

        // 🌟 Logic đếm hiệp cũ (vẫn áp dụng hoàn hảo cho Bóng đá)
        if (startCount === endCount && startCount > 0) {
            if (startCount >= maxPeriods) {
                setMatchState("FULL_TIME");
                setDisplayTime("Hết giờ");
                return;
            } else {
                setMatchState("HALFTIME");
                setDisplayTime("Nghỉ giữa giờ");
                return;
            }
        }

        setMatchState("PLAYING");

        // 🌟 XỬ LÝ DÀNH RIÊNG CHO MÔN ĐÁNH SET (CẦU LÔNG)
        if (clockType === "SET_BASED") {
            // Thay vì gán là "Set 1" (gây lỗi chuỗi "Set 1 - Set 1"), ta gán là "Đang diễn ra"
            setDisplayTime("Đang diễn ra");
            return;
        }

        const lastStartEvent = startEvents[startEvents.length - 1];
        const startTimeMs = new Date(lastStartEvent.createdAt).getTime();

        const currentEvents = match.timeline.filter(
            (e) => new Date(e.createdAt).getTime() >= startTimeMs,
        );
        currentEvents.sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
        );

        let totalPausedMs = 0;
        let lastPauseMs: number | null = null;

        currentEvents.forEach((e) => {
            if (e.eventType === "PAUSE_MATCH") {
                lastPauseMs = new Date(e.createdAt).getTime();
            } else if (e.eventType === "RESUME_MATCH" && lastPauseMs) {
                totalPausedMs += new Date(e.createdAt).getTime() - lastPauseMs;
                lastPauseMs = null;
            }
        });

        const durationMinutes = parseInt(
            match.sportRules?.PERIOD_DURATION || "0",
            10,
        );
        const totalDurationSeconds = durationMinutes * 60;

        const updateDisplayTime = () => {
            let nowMs = new Date().getTime();

            // Đóng băng đồng hồ khi Tạm dừng
            if (match.status === "PAUSED" && lastPauseMs) {
                nowMs = lastPauseMs;
            }

            const elapsedSeconds = Math.max(
                0,
                Math.floor((nowMs - startTimeMs - totalPausedMs) / 1000),
            );

            if (clockType === "COUNT_UP") {
                setDisplayTime(formatSecondsToMMSS(elapsedSeconds));
            } else if (clockType === "COUNT_DOWN") {
                let remainingSeconds = totalDurationSeconds - elapsedSeconds;
                if (remainingSeconds <= 0) remainingSeconds = 0;
                setDisplayTime(formatSecondsToMMSS(remainingSeconds));
            }
        };

        updateDisplayTime();

        if (match.status === "PAUSED") {
            return;
        }

        const intervalId = setInterval(updateDisplayTime, 1000);
        return () => clearInterval(intervalId);
    }, [match, periodName, clockType]); // Đã bổ sung clockType vào mảng dependency

    return {
        periodName,
        currentPeriod,
        periodPrefix, // 🌟 Export tiền tố "Set 1" ra ngoài cho các nút bấm sử dụng
        matchState,
        displayTime,
        // 🌟 Kết quả chuỗi ghép cuối cùng: "Set 1 - Đang diễn ra" hoặc "Hiệp 1 - 45:12"
        currentFormattedTime: `${periodPrefix} - ${displayTime}`,
    };
};
