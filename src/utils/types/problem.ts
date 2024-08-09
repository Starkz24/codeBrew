import { ReactNode } from "react";

export type Example = {
	id: number;
	inputText: string;
	outputText: string;
	explanation?: string;
	img?: string;
};

export type Problem = {
	id: string;
	title: string;
	problemStatement: string;
	examples: Example[];
	constraints: string;
	order: number;
	starterCode: string;
	handlerFunction: ((fn: any) => boolean) | string;
	starterFunctionName: string;
};

export type DBProblem = {
	starterCode: ReactNode;
	constraints: string;
	examples: any;
	problemStatement: string;
	id: string;
	title: string;
	category: string;
	difficulty: string;
	likes: number;
	dislikes: number;
	order: number;
	videoId?: string;
	link?: string;
};
