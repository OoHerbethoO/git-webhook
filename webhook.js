const secret = "your_secret_here";
const repo = "~/your_repo_path_here/";

const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;

http.createServer(function (req, res) {
    req.on('data', function(chunk) {
        let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

        if (req.headers['x-hub-signature'] == sig) {
            const child = spawn('git pull', {
                shell: true,
                cwd: repo
            });

            child.stdout.on('data', (data) => {
                console.log(`${data}`);
            });

            child.stderr.on('data', (data) => {
                console.error(`stderr filho:\n${data}`);
            });
        }
    });

    res.end();
}).listen(8080);