import { useState } from "react";
import { useRouter } from "next/router";
import { addDoc, collection } from "@firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebase"; // Adjust the import path as needed

const AddProblem: React.FC = () => {
  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [outputDescription, setOutputDescription] = useState("");
  const [constraints, setConstraints] = useState("");
  const [examples, setExamples] = useState([
    { id: 1, inputText: "", outputText: "", explanation: "" }
  ]);
  const [actualTestCases, setActualTestCases] = useState([
    { id: 1, points: "", inputFile: null, outputFile: null }
  ]);
  const [difficulty, setDifficulty] = useState("");
  const router = useRouter();

  const handleAddExample = () => {
    setExamples([...examples, { id: examples.length + 1, inputText: "", outputText: "", explanation: "" }]);
  };

  const handleExampleChange = (index: number, field: string, value: string) => {
    const updatedExamples = examples.map((example, i) =>
      i === index ? { ...example, [field]: value } : example
    );
    setExamples(updatedExamples);
  };

  const handleAddTestCase = () => {
    setActualTestCases([...actualTestCases, { id: actualTestCases.length + 1, points: "", inputFile: null, outputFile: null }]);
  };

  const handleTestCaseChange = (index: number, field: string, value: string) => {
    const updatedTestCases = actualTestCases.map((testCase, i) =>
      i === index ? { ...testCase, [field]: value } : testCase
    );
    setActualTestCases(updatedTestCases);
  };

  const handleFileChange = (index: number, field: string, file: File | null) => {
    const updatedTestCases = actualTestCases.map((testCase, i) =>
      i === index ? { ...testCase, [field]: file } : testCase
    );
    setActualTestCases(updatedTestCases);
  };


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Prepare data for submission
    const newProblem = {
      title,
      problemStatement,
      inputDescription,
      outputDescription,
      constraints,
      examples,
      difficulty,
    };
  
    try {
      // Add problem to Firestore
      const problemRef = await addDoc(collection(firestore, "problems"), newProblem);
  
      // Handle actual test cases
      const testCasePromises = actualTestCases.map(async (testCase) => {
        if (testCase.inputFile && testCase.outputFile) {
          // Create references for input and output files
          const inputFileRef = ref(storage, `testCases/${problemRef.id}/${testCase.inputFile.name}`);
          const outputFileRef = ref(storage, `testCases/${problemRef.id}/${testCase.outputFile.name}`);
          
          await Promise.all([
            uploadBytes(inputFileRef, testCase.inputFile),
            uploadBytes(outputFileRef, testCase.outputFile),
          ]);
  
          // Add metadata to Firestore
          await addDoc(collection(firestore, "testCases"), {
            problemId: problemRef.id,
            points: testCase.points,
            inputFile: testCase.inputFile.name,
            outputFile: testCase.outputFile.name,
          });
        }
      });
  
      await Promise.all(testCasePromises);
  
      // Redirect to home or another page
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
          <label className="block text-sm font-medium">Input Description</label>
          <textarea
            value={inputDescription}
            onChange={(e) => setInputDescription(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Output Description</label>
          <textarea
            value={outputDescription}
            onChange={(e) => setOutputDescription(e.target.value)}
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

        <div className="mb-4">
          <label className="block text-sm font-medium">Actual Test Cases</label>
          {actualTestCases.map((testCase, index) => (
            <div key={index} className="mb-2 p-2 border border-gray-300 rounded-md">
              <label className="block text-sm font-medium">Test Case {index + 1}</label>
              <input
                type="number"
                placeholder="Points"
                value={testCase.points}
                onChange={(e) => handleTestCaseChange(index, "points", e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
              <input
                type="file"
                onChange={(e) => handleFileChange(index, "inputFile", e.target.files?.[0] || null)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                required
              />
              <input
                type="file"
                onChange={(e) => handleFileChange(index, "outputFile", e.target.files?.[0] || null)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTestCase}
            className="mt-2 p-2 bg-blue-500 text-white rounded-md"
          >
            Add Another Test Case
          </button>
        </div>

        <button type="submit" className="mt-2 p-2 bg-green-500 text-white rounded-md">
          Submit Problem
        </button>
      </form>
    </div>
  );
};

export default AddProblem;
