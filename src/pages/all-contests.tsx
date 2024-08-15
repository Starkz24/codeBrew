import Link from "next/link";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { Contest } from "@/utils/types/contest";

const AllContests: React.FC = () => {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    useEffect(() => {
        const fetchContests = async () => {
            try {
                setLoading(true);
                const contestsCollection = collection(firestore, "contests");
                const q = query(contestsCollection);
                const querySnapshot = await getDocs(q);
    
                if (querySnapshot.empty) {
                    console.log("No contests found.");
                } else {
                    const contestsList = querySnapshot.docs.map(doc => {
                        const contestData = doc.data() as Contest;
                        console.log("Fetched contest:", contestData); // Log each contest
                        return { id: doc.id, ...contestData };
                    });
                    setContests(contestsList);
                    console.log("All contests set:", contestsList); // Log the full array
                }
            } catch (error) {
                console.error("Error fetching contests: ", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchContests();
    }, []);

    if (loading) return <div className="text-center text-white">Loading...</div>;

    const upcomingContests = contests.filter(contest => new Date(contest.startDateTime) > currentDate);
    const pastContests = contests.filter(contest => new Date(contest.startDateTime) <= currentDate);

    return (
        <div className="bg-black min-h-screen px-4 py-8 text-white">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">All Contests</h1>

                <div className="mb-6 text-center">
                    <Link href="/add-contest">
                        <button className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600">
                            Create Contest
                        </button>
                    </Link>
                </div>

                <h2 className="text-2xl font-semibold mb-4 text-center">Upcoming Contests</h2>
                {upcomingContests.length > 0 ? (
                    <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg shadow-md mx-auto max-w-4xl">
                        <table className="min-w-full text-sm text-left text-white">
                            <thead className="bg-gray-700 border-b text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-2">Title</th>
                                    <th className="px-4 py-2">Start Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingContests.map((contest) => (
                                    <tr
                                        key={contest.id}
                                        className="border-b bg-gray-700 hover:bg-gray-600"
                                    >
                                        <td className="px-4 py-2">
                                            <Link
                                                href={`/contests/${contest.id}`}
                                                className="text-blue-400 hover:underline"
                                            >
                                                {contest.title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2">{new Date(contest.startDateTime).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center">No upcoming contests.</p>
                )}

                <h2 className="text-2xl font-semibold mb-4 text-center">Past Contests</h2>
                {pastContests.length > 0 ? (
                    <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg shadow-md mx-auto max-w-4xl">
                        <table className="min-w-full text-sm text-left text-white">
                            <thead className="bg-gray-700 border-b text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-2">Title</th>
                                    <th className="px-4 py-2">Start Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastContests.map((contest) => (
                                    <tr
                                        key={contest.id}
                                        className="border-b bg-gray-700 hover:bg-gray-600"
                                    >
                                        <td className="px-4 py-2">
                                            <Link
                                                href={`/contests/${contest.id}`}
                                                className="text-blue-400 hover:underline"
                                            >
                                                {contest.title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2">{new Date(contest.startDateTime).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center">No past contests.</p>
                )}
            </div>
        </div>
    );
};

export default AllContests;
