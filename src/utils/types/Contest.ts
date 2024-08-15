export interface Contest {
    id: string;
    title: string;
    date: string;
    time: string;
    problems: { [key: string]: { points: number } };
}
