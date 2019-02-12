const host = 'http://localhost:8080';
let tempText = '';
let currentPath = [];
const createFileButton = document.querySelector('.create-file');
var xhr = new XMLHttpRequest();
xhr.open('GET', host);
xhr.send(); 

xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;
  
    if (xhr.status != 200) {
      alert(xhr.status + ': ' + xhr.statusText);
    } else if (xhr.responseText) {
      render(JSON.parse(xhr.responseText));
    }
  
  }

function render(data) {
    document.getElementById('files').innerHTML = '';
    if (Array.isArray(data)) {
      renderFolder(data);
    } else {
      document.querySelector('#files').appendChild(generateEditor(data.text, data.path));
    }
}

function renderFolder(data) {
  data.forEach(element => {
    document.getElementById('files').appendChild(generateItem(element.type, element.name));
  });
}

function addGetAction(el, path) {
  el.addEventListener('click', (event) => {
    currentPath.push(path);
    xhr.open('GET', host + '/' + path);
    xhr.send();
   });;
}

function addDeleteAction(el, path) {
  el.addEventListener('click', (event) => {
    xhr.open('DELETE', host + '/' + path);
    xhr.send();
   });;
}

function generateItem(type, text) {
  const div = document.createElement('div');
  div.setAttribute('class', 'alert alert-primary');

  const img = document.createElement('img'); 
  img.setAttribute('width', '50');
  img.setAttribute('height', '50');

  if(type === 'dir') {
    img.setAttribute('src', 'folder.png');
  } else {
    img.setAttribute('src', 'file.png');
  }

  const a = document.createElement('a'); 
  a.setAttribute('href', '#');
  a.innerText = text;

  const delA = document.createElement('a'); 
  delA.setAttribute('href', '#');
  delA.innerText = 'Удалить';

  addGetAction(a, text);
  addDeleteAction(delA, currentPath.join('/') + '/'+ text);
  
  div.appendChild(img);
  div.appendChild(a);
  div.appendChild(delA);

  return div;
}

createFileButton.addEventListener('click', () => {
  console.log(JSON.stringify({'path':  currentPath.join('/') + '/' + document.querySelector('.file-name').value}));
  xhr.open('POST', host);
  xhr.send(JSON.stringify({'path':  currentPath.join('/') + '/' + document.querySelector('.file-name').value}));
}) 

function generateEditor(text, path) {
  const div = document.createElement('div');
  div.setAttribute('class', 'form-group');
  const area = document.createElement('textarea');

  area.addEventListener('keydown', () => {
    tempText = area.value;
  });


  area.setAttribute('class', 'form-control text-area');
  area.innerText = text;
  tempText = text;
  const btn = document.createElement('button');
  btn.setAttribute('class', 'btn btn-primary');
  btn.innerText = 'Сохранить';

  btn.addEventListener('click', (event) => {
    xhr.open('POST', host + path);
    xhr.send(JSON.stringify({'text': tempText}))
  });

  div.appendChild(area);
  div.appendChild(btn);

  return div;
}