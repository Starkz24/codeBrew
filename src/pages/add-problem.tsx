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
  const [testResults, setTestResults] = useState([]);
  const [testSummary, setTestSummary] = useState('');

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

  const submitForAllTestCases = async (problem_id) => {
    try {
      // Fetch the test cases for the given problem_id
      const testCaseResponse = await axios.get(`/api/getTestCases/${problem_id}`);
      const { testcase1, output1, testcase2, output2, testcase3, output3 } = testCaseResponse.data;

      const testCases = [
        { input: testcase1, expectedOutput: output1 },
        { input: testcase2, expectedOutput: output2 },
        { input: testcase3, expectedOutput: output3 },
      ];

      let passed = 0;
      const results = [];

      for (let i = 0; i < testCases.length; i++) {
        const response = await axios.post('/api/execute', {
          code,
          input: testCases[i].input,
        });

        const { output } = response.data;

        if (output.trim() === testCases[i].expectedOutput.trim()) {
          passed++;
          results.push(`Test Case ${i + 1}: Passed`);
        } else {
          results.push(`Test Case ${i + 1}: Failed`);
        }
      }

      setTestResults(results);
      setTestSummary(`${passed} out of ${testCases.length} test cases passed`);

    } catch (error) {
      console.error('Error:', error);
      setTestSummary('Error occurred while running test cases.');
    }
  };
  

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
        <button className={styles.button} onClick={() => submitCode(true)}>Run For Custom Input</button>
        <button className={`${styles.button} ${styles.greenButton}`} onClick={() => submitCode(false)}>Run For Default Input</button>
        <button className={`${styles.button} ${styles.submitButton}`} onClick={() => submitForAllTestCases('problem_id')}>Submit</button>
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
        <p>{testSummary}</p>
        <ul>
          {testResults.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
