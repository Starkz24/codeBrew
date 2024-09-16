import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { Problem } from "../../utils/types/problem";
import { useEffect, useState } from "react";
import Coding from "@/components/Coding/Coding";

const ProblemPage = () => {
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const { pid } = router.query;

    useEffect(() => {
        if (pid) {
            const fetchProblem = async () => {
                const docRef = doc(firestore, "problems", pid as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProblem({ id: docSnap.id, ...docSnap.data() } as Problem);
                } else {
                    console.error("Problem not found");
                }
                setLoading(false);
            };

            fetchProblem();
        }
    }, [pid]);

    if (loading) return <div className="text-white">Loading...</div>;

    if (!problem) return <div className="text-white">Problem not found</div>;

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-500">
            <div className="container mx-auto p-4 text-white flex-grow">
                <h1 className="text-3xl font-bold mb-4 text-black">{problem.title}</h1>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2 text-white">Description</h2>
                    <p className="text-base text-white">{problem.problemStatement}</p>

                    <h2 className="text-xl font-semibold mt-4 mb-2 text-white">Constraints</h2>
                    <ul className="list-disc list-inside">
                        {problem.constraints.split('\n').map((constraint, index) => (
                            <li key={index} className="text-base text-white">{constraint}</li>
                        ))}
                    </ul>

                    <h2 className="text-xl font-semibold mt-4 mb-2 text-white">Test Cases</h2>

                    {problem.testcase1 && (
                        <div className="mb-4 p-4 bg-gray-600 rounded-lg">
                            <strong className="block text-base text-white">Test Case 1:</strong>
                            <p className="text-base text-white">{problem.testcase1}</p>
                            <strong className="block text-base mt-2 text-white">Output 1:</strong>
                            <p className="text-base text-white">{problem.output1}</p>
                        </div>
                    )}

                    {problem.testcase2 && (
                        <div className="mb-4 p-4 bg-gray-600 rounded-lg">
                            <strong className="block text-base text-white">Test Case 2:</strong>
                            <p className="text-base text-white">{problem.testcase2}</p>
                            <strong className="block text-base mt-2 text-white">Output 2:</strong>
                            <p className="text-base text-white">{problem.output2}</p>
                        </div>
                    )}

                    {problem.testcase3 && (
                        <div className="mb-4 p-4 bg-gray-600 rounded-lg">
                            <strong className="block text-base text-white">Test Case 3:</strong>
                            <p className="text-base text-white">{problem.testcase3}</p>
                            <strong className="block text-base mt-2 text-white">Output 3:</strong>
                            <p className="text-base text-white">{problem.output3}</p>
                        </div>
                    )}
                </div>
            </div>
            <Coding />
        </div>
    );
};

export default ProblemPage;
