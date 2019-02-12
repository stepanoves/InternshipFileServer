const http = require('http');
const url = require('url');
const path = require('path');
const {PromiseFSWorker} = require('./FileSystem/PromiseFSWorker');
const ps = new PromiseFSWorker();
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
    'Access-Control-Max-Age': 2592000,
    'Content-Type': 'application/json'
}

const server = http.createServer(function (req, res) {
    if (req.url === '/favicon.ico') {
        return;
    }

    res.writeHead(200, headers);

    const path = url.parse(req.url).pathname + '';
    const validPath = [...path].slice(1).join('');
    
    if (req.method === 'GET') {
        ps.defineType(validPath)
            .then(type => {
                if (type === 'dir') {
                    return ps.readDir(validPath);
                } else {
                    return ps.readFile(validPath);
                }
            })
            .then(data => {
                if (Array.isArray(data)) {
                    res.end(JSON.stringify({...data}));
                } else {
                    res.end(JSON.stringify({text: data}));
                }
            })
    }

    if (req.method === 'POST') {
        ps.createFile(validPath)
            .then(result => {
                res.statusCode = 201;
                res.statusMessage = result;
                res.end();
            });
    }

    if (req.method === 'PUT') {
        req.on('data', (data) => {
            const obj = JSON.parse(data);
            ps.updateFile(validPath, obj.text)
                .then(result => {
                    res.statusCode = 201;
                    res.statusMessage = result;
                    res.end();
                });            
        })
    }

    if (req.method === 'DELETE') {
        ps.deleteFile(validPath)
            .then(result => {
                res.statusCode = 201;
                res.statusMessage = result;
                res.end();
            });
    }

    if(req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
    }

});



server.listen(8080);