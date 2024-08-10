
import ProblemsTable from "@/components/ProblemsTable";
import Topbar from "@/components/Topbar/Topbar";
import { firestore } from "@/firebase/firebase";
import useHasMounted from "@/hooks/useHasMounted";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function Home() {
  const [loadingProblems, setLoadingProblems] = useState(true);
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  return (
    <>
      <main className="bg-dark-layer-2 min-h-screen">
        <Topbar />
        <h1 className="text-2xl text-center text-white font-medium uppercase mt-10 mb-5">
          &ldquo; PROBLEMS &rdquo;
        </h1>
        <div className="text-center mb-5">
          <span className="typing-animation text-white">
            {"eat. sleep. code. repeat. </>"}
          </span>
        </div>
        <div className="relative overflow-x-auto mx-auto px-6 pb-10">
          {loadingProblems && (
            <div className="max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse">
            </div>
          )}
          <table className="text-sm text-left text-white sm:w-7/12 w-full max-w-[1200px] mx-auto">
            {!loadingProblems && (
              <thead className="text-xs text-white uppercase dark:text-gray-400 border-b">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Difficulty
                  </th>
                </tr>
              </thead>
            )}
            <ProblemsTable />
          </table>

        </div>
      </main>
    </>
  );
}

