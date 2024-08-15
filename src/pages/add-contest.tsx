import Link from "next/link";
import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { Problem } from "@/utils/types/problem";
import { useRouter } from "next/router";

const AddContest: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProblems, setSelectedProblems] = useState<{ [key: string]: { points: number } }>({});
    const [contestTitle, setContestTitle] = useState<string>("");
    const [contestStartDateTime, setContestStartDateTime] = useState<string>("");
    const [contestEndDateTime, setContestEndDateTime] = useState<string>("");
    const router = useRouter();

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

    const handleSelectProblem = (problemId: string, points: number) => {
        setSelectedProblems((prevSelected) => ({
            ...prevSelected,
            [problemId]: { points },
        }));
    };

    const handleRemoveProblem = (problemId: string) => {
        const updatedSelection = { ...selectedProblems };
        delete updatedSelection[problemId];
        setSelectedProblems(updatedSelection);
    };

    const handleSaveContest = async (e: React.FormEvent) => {
        e.preventDefault();

        const newContest = {
            title: contestTitle,
            problems: selectedProblems,
            startDateTime: contestStartDateTime,
            endDateTime: contestEndDateTime,
        };

        try {
            // Save the contest to the database
            await addDoc(collection(firestore, "contests"), newContest);
            alert("Contest added successfully!");
            router.push("/all-contests"); // Redirect after successful save
        } catch (error) {
            console.error("Error adding contest: ", error);
        }
    };

    if (loading) return <div className="text-center text-white">Loading...</div>;

    return (
        <div className="container mx-auto p-4 bg-black text-white">
            <h1 className="text-2xl font-bold mb-4">Create New Contest</h1>
            <form onSubmit={handleSaveContest}>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Contest Title</label>
                    <input
                        type="text"
                        value={contestTitle}
                        onChange={(e) => setContestTitle(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Contest Start Date and Time</label>
                    <input
                        type="datetime-local"
                        value={contestStartDateTime}
                        onChange={(e) => setContestStartDateTime(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Contest End Date and Time</label>
                    <input
                        type="datetime-local"
                        value={contestEndDateTime}
                        onChange={(e) => setContestEndDateTime(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>

                <h2 className="text-xl font-semibold mb-2">Select Questions</h2>
                <div className="overflow-x-auto bg-dark-layer-2 p-4 rounded-lg shadow-md mb-4">
                    <table className="min-w-full text-sm text-left text-white">
                        <thead className="bg-gray-800 border-b text-xs uppercase font-medium">
                            <tr>
                                <th className="px-4 py-2">Title</th>
                                <th className="px-4 py-2">Difficulty</th>
                                <th className="px-4 py-2">Points</th>
                                <th className="px-4 py-2">Actions</th>
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
                                        {selectedProblems[problem.id] ? (
                                            <input
                                                type="number"
                                                value={selectedProblems[problem.id].points}
                                                onChange={(e) =>
                                                    handleSelectProblem(problem.id, Number(e.target.value))
                                                }
                                                className="mt-1 p-1 block w-20 border border-gray-300 rounded-md text-black"
                                                required
                                            />
                                        ) : (
                                            <input
                                                type="number"
                                                placeholder="Points"
                                                onChange={(e) =>
                                                    handleSelectProblem(problem.id, Number(e.target.value))
                                                }
                                                className="mt-1 p-1 block w-20 border border-gray-300 rounded-md text-black"
                                            />
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {selectedProblems[problem.id] ? (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProblem(problem.id)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSelectProblem(problem.id, 0)}
                                                className="text-green-500 hover:underline"
                                            >
                                                Add
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    type="submit"
                    className="mt-4 p-2 bg-green-500 text-white rounded-md"
                    disabled={Object.keys(selectedProblems).length === 0}
                >
                    Save Contest
                </button>
            </form>
        </div>
    );
};

export default AddContest;
