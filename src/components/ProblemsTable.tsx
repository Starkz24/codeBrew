import Link from "next/link";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { Problem } from "@/utils/types/problem";

const ProblemsTable: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true);
            const q = query(collection(firestore, "problems"), orderBy("title", "asc"));
            const querySnapshot = await getDocs(q);
            const problemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Problem));
            setProblems(problemsList);
            setLoading(false);
        };

        fetchProblems();
    }, []);

    if (loading) return <div className="text-center text-white">Loading...</div>;

    return (
        <div className="overflow-x-auto bg-dark-layer-2 p-4 rounded-lg shadow-md">
            <table className="min-w-full text-sm text-left text-white">
                <thead className="bg-gray-800 border-b text-xs uppercase font-medium">
                    <tr>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Difficulty</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProblemsTable;
