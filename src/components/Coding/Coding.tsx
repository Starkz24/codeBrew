import { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/Home.module.css';

export default function Coding() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState('');
  const [executionTime, setExecutionTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);

  const submitCode = async (customInput = true) => {
    try {
      const response = await axios.post('/api/execute', {
        code,
        input: customInput ? input : '' // Use custom input or empty string for default input
      });

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

  return (
    <div className={styles.container}>
      <h1>C++ Code Playground</h1>
      <textarea
        className={styles.textarea}
        value={code}
        onChange={(e) => {
          console.log('Code:', e.target.value); // Debugging line
          setCode(e.target.value);
        }}
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
        <button className={styles.button} onClick={() => submitCode(true)}>Run For Custom Input</button>
        <button className={`${styles.button} ${styles.greenButton}`} onClick={() => submitCode(false)}>Submit Code</button>
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
    </div>
  );
}
