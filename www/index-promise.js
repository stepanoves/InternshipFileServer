(function(){
    const host = 'http://localhost:8080/files/';
    const structure = document.querySelector('.structure');
    const createFileButton = document.querySelector('.create-file');
    const fileNameFld = document.querySelector('.file-name');
    const currentPath = [];
    const temp = [];

    console.log(`${host}${currentPath.join('/')}`)
    
    fetchData(`${host}${currentPath.join('/')}`);
    
    
    function fetchData(path) {
        structure.innerHTML = '';
        fetch(path, {
            method: 'GET'
        })
            .then(data => data.json())
            .then(data => {
                if (data.hasOwnProperty('text')) {
                    return generateEditor(path);
                } else {
                    const items = [];
                    for(el in data) {
                        items.push(generateItem(data[el]));                
                    }
                    console.log(items);
                    return items;
                }
            })
            .then(data => {
                if (Array.isArray(data)) {
                    data.forEach(item => structure.appendChild(item));
                } else {
                    structure.appendChild(data);
                }
                
            })
    }

    createFileButton.addEventListener('click', () => {
        console.log(`${host}${currentPath.join('/')}${fileNameFld.value}`)
        fetch(`${host}${currentPath.join('/')}${fileNameFld.value}`,  {
            method: 'POST',
        })
    });

    function addEvent(element) {
        element.addEventListener('click', () => {
            fetchData(`${host}${currentPath.join('/')}${element.innerText}`)
        });
    }

    function deleteEvent(element, path) {
        element.addEventListener('click', () => {
            fetch(path, {
                method: 'DELETE',
            })
        });
    }

    function generateItem(text) {
        const div = document.createElement('div');
        div.setAttribute('class', 'alert alert-primary');
      
        const a = document.createElement('a'); 
        a.setAttribute('href', '#');
        a.innerText = text;
        addEvent(a);

        const delA = document.createElement('a'); 
        delA.setAttribute('href', '#');
        delA.innerText = 'Удалить';
        deleteEvent(delA, `${host}${currentPath.join('/')}${text}`);

        div.appendChild(a);
        div.appendChild(delA);
      
        return div;
    }

    function generateEditor(path) {

        const div = document.createElement('div');
        div.setAttribute('class', 'form-group');

        const area = document.createElement('textarea');
        // area.addEventListener('keyup', (event) => {
        //     temp.push(String.fromCharCode(event.keyCode));
        // })
        const btn = document.createElement('button');
        btn.setAttribute('class', 'btn btn-primary');
        btn.innerText = 'Сохранить';

        fetch(path, {
            method: 'GET'
        })
            .then(data => data.json())
            .then(data => area.value = data.text);

        btn.addEventListener('click', (event) => {
            fetch(path, {
                method: 'PUT',
                body: JSON.stringify({text: area.value}),
            })
        });

        div.appendChild(area);
        div.appendChild(btn);
      
        return div;
    }
})()