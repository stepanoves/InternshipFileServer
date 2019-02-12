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

const server = http.createServer(async function (req, res) {
    if (req.url === '/favicon.ico') {
        return;
    }

    res.writeHead(200, headers);

    const path = url.parse(req.url).pathname + '';
    const validPath = [...path].slice(1).join('');
    console.log(req.method)
    
    if (req.method === 'GET') {
        const type = await ps.defineType(validPath);
        let data;

        if (type === 'dir') {
            data = await ps.readDir(validPath);
        } else {
            data = await ps.readFile(validPath);
        }
        
        if (Array.isArray(data)) {
            res.end(JSON.stringify({...data}));
        } else {
            res.end(JSON.stringify({text: data}));
        }       
    }

    if (req.method === 'POST') {
        const result = await ps.createFile(validPath);
        res.statusCode = 201;
        res.statusMessage = result;
        res.end();
    }

    if (req.method === 'PUT') {
        req.on('data', async(data) => {
            const obj = JSON.parse(data);
            console.log(data)
            const result = await ps.updateFile(validPath, obj.text)
            res.statusCode = 201;
            res.statusMessage = result;
            res.end();        
        })
    }

    if (req.method === 'DELETE') {
        const result = await ps.deleteFile(validPath)
        res.statusCode = 201;
        res.statusMessage = result;
        res.end();
    }

    if(req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
    }

});



server.listen(8080);