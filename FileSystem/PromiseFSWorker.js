const fs = require('fs');

class PromiseFSWorker {

    defineType(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (error, stat) => {
                if (error) {
                    reject(error);
                } else {
                    if (stat.isDirectory()) {
                        resolve('dir');
                    } else {
                        resolve('file')
                    }
                }
            })
        });
    }

    readDir(path) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            });
        });
    }

    readFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8', (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
            })
        });
    }

    createFile(path) {
       return new Promise((resolve, reject) => {
           fs.open(path, 'w', (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('Created');
                }
           })
       })
    }
    
    updateFile(path, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('Updated');
                }
            })
        });
    }

    deleteFile(path) {
        return new Promise((resolve, reject) => {
            fs.unlink(path, function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve('Deleted')
                }
            }); 
        })
    }
}

exports.PromiseFSWorker = PromiseFSWorker;