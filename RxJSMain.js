const http = require('http');
const url = require('url');
const path = require('path');
const {switchMap} = require('rxjs/operators');
const {RxJSFSWorker} = require('./FileSystem/RxJSFSWorker');
const rxw = new RxJSFSWorker();
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
        rxw.defineType(validPath)
            .pipe(
                switchMap((type) => type === 'dir'
                 ? rxw.readDir(validPath)
                 : rxw.readFile(validPath), (type, data) => ({type, data})),
            )
            .subscribe(({type, data}) => {
                const serializedData = type === 'dir' ? {...data} : {text: data};

                res.end(JSON.stringify(serializedData));
            })
    }

    if (req.method === 'POST') {
        rxw.createFile(validPath)
            .subscribe(result => {
                res.statusCode = 201;
                res.statusMessage = result;
                res.end();
            });
    }

    if (req.method === 'PUT') {
        req.on('data', (data) => {
            const obj = JSON.parse(data);
            rxw.updateFile(validPath, obj.text)
                .subscribe(result => {
                    res.statusCode = 200;
                    res.statusMessage = result;
                    res.end();
                });            
        })
    }

    if (req.method === 'DELETE') {
        rxw.deleteFile(validPath)
            .subscribe(result => {
                res.statusCode = 200;
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