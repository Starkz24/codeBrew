import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';

export default function Coding() {
  const router = useRouter();
  const { pid } = router.query;
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState('');
  const [executionTime, setExecutionTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const savedCode = localStorage.getItem(`code_${pid}`);
    const savedInput = localStorage.getItem(`input_${pid}`);
    if (savedCode) setCode(savedCode);
    if (savedInput) setInput(savedInput);
  }, [pid]);

  useEffect(() => {
    localStorage.setItem(`code_${pid}`, code);
    localStorage.setItem(`input_${pid}`, input);
  }, [code, input, pid]);

  const submitCode = async () => {
    try {
      const response = await axios.post('/api/execute', {
        code,
        input 
      });

      setErrors('');
      const { output, errors, time, memory } = response.data;
      setOutput(output);
      setErrors(errors);
      setExecutionTime(time);
      setMemoryUsage(memory);

    } catch (error) {
      console.error('Error:', error);
      setOutput('');
      setErrors(`Error: ${error.message}`);
      setExecutionTime(0);
      setMemoryUsage(0);
    }
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem(`code_${pid}`);
      localStorage.removeItem(`input_${pid}`);
    };
  }, [pid]);

  return (
    <div className={styles.container}>
      <h1>C++ Code Playground</h1>
      <textarea
        className={styles.textarea}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your C++ code here..."
        rows="10"
        cols="50"
      />
      <input
        className={styles.input}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter custom input (e.g., 1 2)"
      />
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={submitCode}>Run For Custom Input</button>
      </div>
      <div className={styles.output}>
        <h2>Output:</h2>
        <pre>{output}</pre>
      </div>
      <div className={styles.errors}>
        <h2>Errors:</h2>
        <pre>{errors}</pre>
      </div>
      <div className={styles.metrics}>
        <h2>Execution Metrics:</h2>
        <p>Execution Time: {executionTime} seconds</p>
        <p>Memory Usage: {memoryUsage} KB</p>
      </div>
      <div className={styles.testResults}>
        <h2>Test Case Results:</h2>
        <ul>
          {testResults.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
