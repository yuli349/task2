interface DaysOfWeek {
    sun: number[];
    mon: number[];
    tue: number[];
    wed: number[];
    thu: number[];
    fri: number[];
    sat: number[];
}

type DayOfWeek = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export function getDayOfWeek(dayNumber: number): DayOfWeek {
    const days: Array<DayOfWeek> = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[dayNumber];
}

export function initializeCommitsByDayOfWeek(): DaysOfWeek {
    return {
        mon: Array(24).fill(0),
        tue: Array(24).fill(0),
        wed: Array(24).fill(0),
        thu: Array(24).fill(0),
        fri: Array(24).fill(0),
        sat: Array(24).fill(0),
        sun: Array(24).fill(0),
    };
}
