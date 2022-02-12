import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { readdirSync } from 'fs';
import * as os from 'os-utils';
import * as p from 'path';
import { exec, ExecException } from 'child_process';

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

app.get('/', (req, res) => {
    res.sendFile(p.join(__dirname, '/ui/index.html'));
});

app.get('/name', (req, res) => {
    res.send(process.env.LAB_NAME || 'DEFAULT');
});

app.get('/cpu-usage', async (req, res) => {
    os.cpuUsage(function (v) {
        res.send('CPU Usage (%): ' + v * 100);
    });
});

app.post('/stress', (req, res) => {
    const body = req.body;
    const cpu = body['cpu'];
    const load = body['load'];
    const timeout = body['timeout'];
    exec(`stress-ng -c ${cpu} -l ${load} --timeout ${timeout}`, (error: ExecException | null, stdout: string, stderr: string) => {
        if (error) {
            console.error(error);
            res.status(500).send(stderr);
        } else {
            console.log(stdout);
            res.status(202).send();
        }
    });
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
