import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { readdirSync } from 'fs';
import * as p from 'path';
import { exec, ExecException } from 'child_process';
const cgroup = require('@adobe/cgroup-metrics');
const { Worker } = require('worker_threads');
const top = require('process-top')();

const app = express();
const port = process.env.PORT || 3000;
app.use(
    fileUpload({
        createParentPath: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/ui', express.static('ui'));
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
    res.sendFile(p.join(__dirname, '/ui/index.html'));
});

app.get('/name', (req, res) => {
    res.send(process.env.LAB_NAME || 'DEFAULT');
});

app.get('/cpu-usage', async (req, res) => {
    try {
        /*
         * {"time":3222298.3,"percent":0.006083546020553094,"system":17753,"user":1850}
         */
        const cpu = top.cpu();
        res.send(`${cpu.percent * 100}`);
    } catch (e) {
        res.status(500).send(e);
    }
});

let _lastCpuAcctUsage: any = null;
app.get('/cpu-usage-cgroup', async (req, res) => {
    try {
        const cpu = cgroup.cpu;
        const currentCpuacctUsage = await cpu.usage();
    
        if (_lastCpuAcctUsage) {
            const calculateUsage = await cpu.calculateUsage(
                _lastCpuAcctUsage,
                currentCpuacctUsage
            );
            _lastCpuAcctUsage = currentCpuacctUsage;
            res.send(`${calculateUsage}`);
        } else {
            _lastCpuAcctUsage = currentCpuacctUsage;
            res.send(`0`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

app.post('/cpu-load', (req, res) => {
    const workerScriptFilePath = require.resolve('./worker-script.js');
    const worker = new Worker(workerScriptFilePath);
    worker.on('message', (output: any) => console.log(output));
    worker.on('error', (error: any) => console.error(error));
    worker.on('exit', (code: number) => {
        if (code !== 0)
            throw new Error(`Worker stopped with exit code ${code}`);
    });
    res.status(202).send();
});

app.get('/env', (req, res) => {
    res.send(process.env);
});

app.post('/files', (req, res) => {
    try {
        if (!req.files) {
            res.status(400).send('No file uploaded');
        } else {
            let fileUpload = req.files.fileUpload as UploadedFile;
            fileUpload.mv('./uploads/' + fileUpload.name);
            res.status(200).send('File uploaded');
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get('/files', (req, res) => {
    const path = req.query.path;
    if (path) {
        const file = `${__dirname}/uploads/${path}`;
        res.download(file);
    } else {
        const dir = readdirSync('uploads');
        res.send(dir);
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}.`)
});
