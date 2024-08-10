import { ReactNode } from "react";

export type Problem = {
    type: ReactNode;
    id: string;
    title: string;
    problemStatement: string;
    examples: Array<{
        id: string;
        inputText: string;
        outputText: string;
        explanation?: string;
        img?: string;
    }>;
    constraints: string;
    difficulty: string;
};

export type DBProblem = Omit<Problem, 'id'>;

