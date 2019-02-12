const fs = require('fs');
const {Observable} = require('rxjs');
class RxJSFSWorker {

  defineType(path) {
    return Observable.create((observer) => {
        fs.stat(path, (error, stat) => {
            if (error) {
                observer.error(error);
            } else {
                if (stat.isDirectory()) {
                    observer.next('dir');
                    observer.complete()
                } else {
                    observer.next('file');
                    observer.complete()
                }
            }
        })
    });
  }
  
  readDir(path) {
        return Observable.create((observer) => {
            fs.readdir(path, (error, result) => {
                if (error) {
                  observer.error(error);
                } else {
                  observer.next(result);
                  observer.complete()
                }
            })
        });
    }

  readFile(path) {
    return Observable.create((observer) => {
        fs.readFile(path, 'utf-8', (error, result) => {
            if (error) {
              observer.error(error);
            } else {
              observer.next(result);
              observer.complete()
            }
        })
    });
  }

  createFile(path) {
    return Observable.create((observer) => {
        fs.open(path, 'w', (error) => {
            if (error) {
                observer.error(error);
            } else {
                observer.next('Created');
                observer.complete()
            }
       })
    });
  }

  updateFile(path, data) {
    return Observable.create((observer) => {
        fs.writeFile(path, data, (error) => {
            if (error) {
                observer.error(error);
            } else {
                observer.next('Updated');
                observer.complete()
            }
        })
    });
  }

  deleteFile(path) {
    return Observable.create((observer) => {
        fs.unlink(path, function (error) {
            if (error) {
                observer.error(error);
            } else {
                observer.next('Deleted');
                observer.complete()
            }
        }); 
    });
  }
}

exports.RxJSFSWorker = RxJSFSWorker;