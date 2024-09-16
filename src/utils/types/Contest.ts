export interface Contest {
    startDateTime: string | number | Date;
    id: string;
    title: string;
    date: string;
    time: string;
    problems: { [key: string]: { points: number } };
}
