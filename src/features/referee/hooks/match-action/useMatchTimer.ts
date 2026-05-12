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

    // XỬ LÝ (HIỆP HAY SET)
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

        const activePeriod =
            startCount === 0
                ? 1
                : startCount > endCount
                  ? startCount
                  : startCount + 1;
        setCurrentPeriod(activePeriod);

        const maxPeriods = parseInt(match.sportRules?.PERIODS || "2", 10);

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

        const clockType = match.sportRules?.CLOCK_TYPE || "COUNT_UP";

        if (clockType === "SET_BASED") {
            setDisplayTime(`${periodName} ${activePeriod}`);
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
                lastPauseMs = null; // Reset bộ đếm khi đã được tiếp tục
            }
        });

        const durationMinutes = parseInt(
            match.sportRules?.PERIOD_DURATION || "0",
            10,
        );
        const totalDurationSeconds = durationMinutes * 60;

        // RENDER ĐỒNG HỒ
        const updateDisplayTime = () => {
            let nowMs = new Date().getTime();

            // Nếu trận đấu đang TẠM DỪNG, đóng băng kim đồng hồ tại đúng cái mốc PAUSE cuối cùng
            if (match.status === "PAUSED" && lastPauseMs) {
                nowMs = lastPauseMs;
            }

            // Thời gian thực tế = (Lúc này) - (Lúc thổi còi) - (Thời gian đã Pause)
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
    }, [match, periodName]);

    return {
        periodName,
        currentPeriod,
        matchState,
        displayTime,
        currentFormattedTime: `${periodName} ${currentPeriod} - ${displayTime}`,
    };
};
