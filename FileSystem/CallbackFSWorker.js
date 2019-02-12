const fs = require('fs');

class CallbackFSWorker {

    getList(path, callback) {
        fs.readdir(path, (err, items) => {
            if(err) throw err;
            callback(items.map(item => item));
        })   
    }

    getType(path, callback) {
        fs.stat(path, (err, stats) => {
            if(err) throw err;
            if (stats.isDirectory()) {
                callback('dir')
            } else {
                callback('file')
            }
        });
    }
    read(path = '', callback) { 
        this.getType(`files${path}`, (result) => {
            if (result === 'file') {
                fs.readFile(`files${path}`, 'utf-8', (err, data) => {
                    callback(data);
                    return;
                })
            } else {
                this.getList(`files${path}`, (result) => {
                    const types = [];
                    if (result.length <= 0) {
                        callback(types);
                        return;
                    }
                    result.forEach(element => {
                            this.getType(`files/${element}`, (res) => {
                                types.push({name: element, type: res});
                                
                                if (types.length === result.length) {

                                    callback(types);
                                } 
                            });
                    });
                });
            }
            
        })
        
    }

    createFile(path, callback) {
        fs.writeFile(`files/${path}`, '', (err) => {
            if(err) throw err;
            callback(err);
        });
    }
    
    updateFile(path, data, callback) {
        fs.open(`files${path}`, 'w', (err, file) => {
            if(err) throw err;
            fs.write(file, data, (err) => {
                if(err) throw err;
                callback(err);
            });
        })
        
    }

    deleteFile(path, callback) {
        fs.unlink(`files${path}`, (err) => {
            if(err) throw err;
            callback(err);
        });
    }
}

exports.CallbackFSWorker = CallbackFSWorker;