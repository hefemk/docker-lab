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

app.get('/stress/:load', (req, res) => {
    const load = req.params.load;
    exec(`stress-ng -c 0 -l ${load} --timeout 30s`, (error: ExecException | null, stdout: string, stderr: string) => {
        res.send(stderr);
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
