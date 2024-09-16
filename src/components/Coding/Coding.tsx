import { useState } from 'react';
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
  const [testResults, setTestResults] = useState<string[]>([]);

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
  
      // Check if error is an instance of Error
      if (error instanceof Error) {
        setErrors(`Error: ${error.message}`);
      } else {
        setErrors('Unknown error occurred');
      }
  
      setExecutionTime(0);
      setMemoryUsage(0);
    }
  };
  

  const submitForAllTestCases = async (pid: string | number) => {
    try {
      const testCaseResponse = await axios.get(`/api/getTestCases/${pid}`);
      const { testcase1, output1, testcase2, output2, testcase3, output3 } = testCaseResponse.data;
      const testCases = [
        { input: testcase1, expectedOutput: output1 },
        { input: testcase2, expectedOutput: output2 },
        { input: testcase3, expectedOutput: output3 },
      ];

      let passed = 0;
      const results = [];
      let time_t=0;
      let cnt=0;
      let memory_t=0;
      let err=''
      for (let i = 0; i < testCases.length; i++) {
        const response = await axios.post('/api/execute', {
          code,
          input: testCases[i].input,
        });

        const { output,errors, time , memory} = response.data;
        time_t = time_t+time;
        memory_t=memory_t+memory;
        if(errors) {
          results.push(`Test Case ${i + 1}: Failed`);
          err=errors;
          continue;
        }
        if (output.trim() == testCases[i].expectedOutput.trim()) {
          passed++;
          results.push(`Test Case ${i + 1}: Passed`);
          cnt++;
        } else {
          results.push(`Test Case ${i + 1}: Failed`);
        }
      }
      if(cnt==3) setOutput("All Test Cases Successfully Passed 🤗");
      else setOutput("OOPS there is some Error 🙄");
      setExecutionTime(time_t);
      setMemoryUsage(memory_t);
      setTestResults(results)
      setErrors(err)

    } catch (error) {
      console.error('Error:', error);
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
        rows={10}
        cols={50}
      />
      <input
        className={styles.input}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter custom input (e.g., 1 2)"
      />
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => submitCode()}>Run For Custom Input</button>
        <button className={`${styles.button} ${styles.submitButton}`} onClick={() => submitForAllTestCases(pid)}>Submit</button>
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
