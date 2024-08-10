import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { code, input } = req.body;
        const codeFile = path.join(process.cwd(), 'user_code.cpp');
        const executable = path.join(process.cwd(), 'user_program');

        fs.writeFileSync(codeFile, code);

        exec(`g++ ${codeFile} -o ${executable}`, (compileError, stdout, stderr) => {
            if (compileError) {
                console.error('Compilation error:', stderr);
                fs.unlinkSync(codeFile);
                return res.json({
                    output: '',
                    errors: stderr,
                    time: 0
                });
            }

            console.log('Compilation successful.');
            
            const startTime = Date.now();

            const process = spawn(executable);

            let output = '';
            let errors = '';

            process.stdin.write(input);
            process.stdin.end();

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                errors += data.toString();
            });

            process.on('close', (code) => {
                const endTime = Date.now();
                const executionTime = (endTime - startTime) / 1000;

                fs.unlinkSync(codeFile);
                fs.unlinkSync(executable);

                res.json({
                    output: output,
                    errors: errors,
                    time: executionTime
                });
            });
        });
    } else {
        res.status(405).end(); 
    }
}