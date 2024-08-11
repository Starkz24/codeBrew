import { useState } from "react";
import { useRouter } from "next/router";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";

const AddProblem: React.FC = () => {
  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [examples, setExamples] = useState([
    { id: 1, inputText: "", outputText: "", explanation: "", img: "" },
  ]);
  const [constraints, setConstraints] = useState("");
  const [difficulty, setDifficulty] = useState(""); 
  const [testCases, setTestCases] = useState({
    testCase1: "",
    testCase2: "",
    testCase3: "",
    output1: "",
    output2: "",
    output3: "",
  });
  const router = useRouter();

  const handleAddExample = () => {
    setExamples([...examples, { id: examples.length + 1, inputText: "", outputText: "", explanation: "", img: "" }]);
  };

  const handleExampleChange = (index: number, field: string, value: string) => {
    const updatedExamples = examples.map((example, i) =>
      i === index ? { ...example, [field]: value } : example
    );
    setExamples(updatedExamples);
  };

  const handleTestCaseChange = (field: string, value: string) => {
    setTestCases({ ...testCases, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProblem = {
      title,
      problemStatement,
      input,
      output,
      examples,
      constraints,
      difficulty,
      testCases,
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
          <label className="block text-sm font-medium">Test Cases</label>
          <input
            type="text"
            placeholder="Test Case 1"
            value={testCases.testCase1}
            onChange={(e) => handleTestCaseChange("testCase1", e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Test Case 2"
            value={testCases.testCase2}
            onChange={(e) => handleTestCaseChange("testCase2", e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Test Case 3"
            value={testCases.testCase3}
            onChange={(e) => handleTestCaseChange("testCase3", e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Output 1"
            value={testCases.output1}
            onChange={(e) => handleTestCaseChange("output1", e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Output 2"
            value={testCases.output2}
            onChange={(e) => handleTestCaseChange("output2", e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Output 3"
            value={testCases.output3}
            onChange={(e) => handleTestCaseChange("output3", e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Examples</label>
          {examples.map((example, index) => (
            <div key={index} className="mb-2 p-2 border border-gray-300 rounded-md">
              <label className="block text-sm font-medium">Example {index + 1}</label>
              <input
                type="text"
                placeholder="Input Text"
                value={example.inputText}
                onChange={(e) => handleExampleChange(index, "inputText", e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Output Text"
                value={example.outputText}
                onChange={(e) => handleExampleChange(index, "outputText", e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Explanation"
                value={example.explanation}
                onChange={(e) => handleExampleChange(index, "explanation", e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={example.img}
                onChange={(e) => handleExampleChange(index, "img", e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddExample}
            className="mt-2 p-2 bg-blue-500 text-white rounded-md"
          >
            Add Another Example
          </button>
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
