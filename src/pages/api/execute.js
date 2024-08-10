import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { tmpdir } from 'os';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { code, input } = req.body;

        const uniqueId = uuidv4();
        const tempDir = path.join(tmpdir(), uniqueId);

        fs.mkdirSync(tempDir);

        const codeFile = path.join(tempDir, 'user_code.cpp');
        const executable = path.join(tempDir, 'user_program');

        fs.writeFileSync(codeFile, code);

        exec(`g++ ${codeFile} -o ${executable}`, (compileError, stdout, stderr) => {
            if (compileError) {
                console.error('Compilation error:', stderr);
                fs.rmSync(tempDir, { recursive: true, force: true });
                return res.json({
                    output: '',
                    errors: stderr,
                    time: 0,
                    memory: 0
                });
            }

            console.log('Compilation successful.');

            const startTime = Date.now();
            const timeoutDuration = 5000; 

            const process = spawn(executable);

            let output = '';
            let errors = '';
            let memoryUsage = 0;
            let timedOut = false;

            process.stdin.write(input);
            process.stdin.end();

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                errors += data.toString();
            });

            const memoryInterval = setInterval(() => {
                exec(`ps -o rss= -p ${process.pid}`, (err, stdout, stderr) => {
                    if (!err && stdout) {
                        const currentMemory = parseInt(stdout.trim(), 10); 
                        memoryUsage = Math.max(memoryUsage, currentMemory);
                    }
                });
            }, 100);

            const timeout = setTimeout(() => {
                timedOut = true;
                process.kill(); 
            }, timeoutDuration);

            process.on('close', () => {
                clearInterval(memoryInterval);
                clearTimeout(timeout); 

                if (timedOut) {
                    output = ''; 
                    errors = 'Execution timed out';
                }

                const endTime = Date.now();
                const executionTime = (endTime - startTime) / 1000; 

                fs.rmSync(tempDir, { recursive: true, force: true });

                res.json({
                    output: output,
                    errors: errors,
                    time: executionTime,
                    memory: memoryUsage 
                });
            });
        });
    } else {
        res.status(405).end(); 
    }
}
