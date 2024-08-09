import { useState } from "react";
import { firestore } from "@/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const ProblemSubmissionForm = () => {
  const [formState, setFormState] = useState({
    id: "",
    title: "",
    problemStatement: "",
    examples: [{ id: 1, inputText: "", outputText: "", explanation: "" }],
    constraints: "",
    starterCode: "",
    order: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleExampleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newExamples = formState.examples.map((example, i) => {
      if (i === index) {
        return { ...example, [e.target.name]: e.target.value };
      }
      return example;
    });
    setFormState({ ...formState, examples: newExamples });
  };

  const addExample = () => {
    setFormState({
      ...formState,
      examples: [...formState.examples, { id: formState.examples.length + 1, inputText: "", outputText: "", explanation: "" }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, "problems"), formState);
      alert("Problem submitted successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="id" placeholder="ID" onChange={handleChange} required />
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <textarea name="problemStatement" placeholder="Problem Statement" onChange={handleChange} required />
      <div>
        <h4>Examples</h4>
        {formState.examples.map((example, index) => (
          <div key={index}>
            <input type="text" name="inputText" placeholder="Input Text" onChange={(e) => handleExampleChange(index, e)} />
            <input type="text" name="outputText" placeholder="Output Text" onChange={(e) => handleExampleChange(index, e)} />
            <textarea name="explanation" placeholder="Explanation" onChange={(e) => handleExampleChange(index, e)} />
          </div>
        ))}
        <button type="button" onClick={addExample}>
          Add Example
        </button>
      </div>
      <textarea name="constraints" placeholder="Constraints" onChange={handleChange} />
      <textarea name="starterCode" placeholder="Starter Code" onChange={handleChange} />
      <input type="number" name="order" placeholder="Order" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProblemSubmissionForm;
