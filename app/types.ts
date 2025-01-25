// app/types.ts

export type RacerScore = {
    athleteId: number;
    name: string;
    durationTime: string;
    falPointTotal: number;
    ftsPointTotal: number;
    finPoints: number;
    pointTotal: number;
    leaguePoints: number;
};
  
export type SegmentScore = {
    name: string;
    repeat: number;
    fal: { athleteId: number; name: string; points: number; eventTimeDisplay: string; falDiff: number }[];
    fts: { athleteId: number; name: string; points: number; eventTimeDisplay: string; ftsDiff: number; elapsed: number }[];
};

export type RaceData = {
    timestamp?: string;
    racerScores?: RacerScore[];
    segmentScores?: SegmentScore[];
};

export type RaceEvents = {
    [key: string]: string;
};

export type EventMap = Record<string, RaceEvents>;