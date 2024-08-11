import { useState } from "react";
import { useRouter } from "next/router";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";

const AddProblem: React.FC = () => {
  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [constraints, setConstraints] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [testcase1, setTestcase1] = useState("");
  const [output1, setOutput1] = useState("");
  const [testcase2, setTestcase2] = useState("");
  const [output2, setOutput2] = useState("");
  const [testcase3, setTestcase3] = useState("");
  const [output3, setOutput3] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProblem = {
      title,
      problemStatement,
      input,
      output,
      constraints,
      difficulty,
      testcase1,
      output1,
      testcase2,
      output2,
      testcase3,
      output3,
    };

    try {
      await addDoc(collection(firestore, "problems"), newProblem);
      router.push("/");
    } catch (error) {
      console.error("Error adding problem: ", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Problem</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Problem Statement</label>
          <textarea
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Output</label>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          >
            <option value="" disabled>Select difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Test Case 1</label>
          <input
            type="text"
            placeholder="Test Case 1"
            value={testcase1}
            onChange={(e) => setTestcase1(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Output 1"
            value={output1}
            onChange={(e) => setOutput1(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Test Case 2</label>
          <input
            type="text"
            placeholder="Test Case 2"
            value={testcase2}
            onChange={(e) => setTestcase2(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Output 2"
            value={output2}
            onChange={(e) => setOutput2(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Test Case 3</label>
          <input
            type="text"
            placeholder="Test Case 3"
            value={testcase3}
            onChange={(e) => setTestcase3(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Output 3"
            value={output3}
            onChange={(e) => setOutput3(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Constraints</label>
          <textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <button type="submit" className="mt-2 p-2 bg-green-500 text-white rounded-md">
          Submit Problem
        </button>
      </form>
    </div>
  );
};

export default AddProblem;
