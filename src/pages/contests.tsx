import Link from "next/link";
import React, { useEffect, useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { Contest } from "@/utils/types/contest";
import { Problem } from "@/utils/types/problem";

const ContestPage: React.FC = () => {
    const [contest, setContest] = useState<Contest | null>(null);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const contestId = "SPECIFY_CONTEST_ID_HERE"; // Dynamically get the contest ID from the URL or context

    useEffect(() => {
        const fetchContestData = async () => {
            try {
                setLoading(true);

                // Fetch contest details
                const contestDoc = doc(firestore, "contests", contestId);
                const contestSnapshot = await getDoc(contestDoc);
                if (contestSnapshot.exists()) {
                    const contestData = contestSnapshot.data() as Contest;
                    setContest({ id: contestId, ...contestData });

                    // Fetch related problems
                    const problemsIds = Object.keys(contestData.problems);
                    const problemsCollection = collection(firestore, "problems");
                    const problemsList = await Promise.all(
                        problemsIds.map(async (problemId) => {
                            const problemDoc = doc(problemsCollection, problemId);
                            const problemSnapshot = await getDoc(problemDoc);
                            if (problemSnapshot.exists()) {
                                return { id: problemId, ...problemSnapshot.data() } as Problem;
                            }
                            return null;
                        })
                    );

                    setProblems(problemsList.filter((problem): problem is Problem => problem !== null));
                } else {
                    console.log("No such contest!");
                }
            } catch (error) {
                console.error("Error fetching contest data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContestData();
    }, [contestId]);

    if (loading) return <div className="text-center text-white">Loading...</div>;

    return (
        <div className="container mx-auto p-4 bg-black text-white">
            {contest && (
                <>
                    <h1 className="text-2xl font-bold mb-4">{contest.title}</h1>
                    <h2 className="text-xl font-semibold mb-2">Questions</h2>
                    {problems.length > 0 ? (
                        <div className="overflow-x-auto bg-dark-layer-2 p-4 rounded-lg shadow-md mb-4">
                            <table className="min-w-full text-sm text-left text-white">
                                <thead className="bg-gray-800 border-b text-xs uppercase font-medium">
                                    <tr>
                                        <th className="px-4 py-2">Title</th>
                                        <th className="px-4 py-2">Difficulty</th>
                                        <th className="px-4 py-2">Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {problems.map((problem) => (
                                        <tr
                                            key={problem.id}
                                            className="border-b bg-dark-layer-1 hover:bg-dark-layer-2"
                                        >
                                            <td className="px-4 py-2">
                                                <Link
                                                    href={`/problems/${problem.id}`}
                                                    className="text-blue-400 hover:underline"
                                                >
                                                    {problem.title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2">{problem.difficulty}</td>
                                            <td className="px-4 py-2">
                                                {contest.problems[problem.id]?.points || 0}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No questions available for this contest.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default ContestPage;
