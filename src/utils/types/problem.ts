import { ReactNode } from "react";

export type Problem = {
    output3: ReactNode;
    testcase3: JSX.Element;
    output2: ReactNode;
    testcase2: JSX.Element;
    output1: ReactNode;
    testcase1: ReactNode;
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

