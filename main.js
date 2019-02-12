const http = require('http');
const url = require('url');
const path = require('path');
const {CallbackFSWorker} = require('./FileSystem/CallbackFSWorker');


const server = http.createServer(function (req, res) {
    if (req.url === '/favicon.ico') {
        return;
    }

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT',
        'Access-Control-Max-Age': 2592000,
        'Content-Type': 'application/json'
    } );

    const path = url.parse(req.url).pathname + '';

    const cw = new CallbackFSWorker();
    
 
    if (req.method === 'GET') {
        cw.read(path, (result) => {
            if (typeof result === 'object') {
                res.end(JSON.stringify(result));
            } else {
                res.end(JSON.stringify({path: path, 'text': result}));
            }
        });
    } 

    if (req.method === 'POST') {
        req.on('data', (data) => {
            const obj = JSON.parse(data);
            if (obj.text) {
                cw.updateFile(path, obj.text, () => {
                     res.end();
                });
            } 
            if (obj.path){
                cw.createFile(obj.path, () => {
                    res.end();
                });
            }            
        })

        
    }

    if (req.method === 'OPTIONS') {
        cw.deleteFile(path, () => {
            res.end();
        });
    }

    console.log(req.method);
});



server.listen(8080);

