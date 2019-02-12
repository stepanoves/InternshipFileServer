describe("file server testing", function() {

    it("create file test", async function() {  
        const result = await fetch('http://localhost:8080/files/file.txt',  {
            method: 'POST',
        })

        assert.equal(result.status, 200);
    });

    it("update file test positive", async function() {  
        const result1 = await fetch('http://localhost:8080/files/file.txt',  {
            method: 'GET',
        }).then(res => res.json())

        fetch('http://localhost:8080/files/file.txt', {
            method: 'PUT',
            body: JSON.stringify({text: 'qwertyui'}),
        })

        const result2 = await fetch('http://localhost:8080/files/file.txt',  {
            method: 'GET',
        }).then(res => res.json())

        assert.equal(result1.text + 'qwertyui', result2.text);
    });

    it("update file test negative", async function() {  
        const result1 = await fetch('http://localhost:8080/files/file.txt',  {
            method: 'GET',
        }).then(res => res.json())

        fetch('http://localhost:8080/files/file.txt', {
            method: 'PUT',
            body: JSON.stringify({text: 'qwertyui'}),
        })

        const result2 = await fetch('http://localhost:8080/files/file.txt',  {
            method: 'GET',
        }).then(res => res.json())

        assert.notEqual(result1.text + 'qwertyui1', result2.text);
    });

    it("read folder test positve", async function() {  
        const result = await fetch('http://localhost:8080/files/',  {
            method: 'GET',
        }).then(res => res.json())


        assert.isTrue(_.isEqual(result, {0: 'a.txt', 1: 'file.txt'}));
    });

    it("read folder test negative", async function() {  
        const result = await fetch('http://localhost:8080/files/',  {
            method: 'GET',
        }).then(res => res.json())


        assert.isFalse(_.isEqual(result, {0: 'a.txt', 1: 'file2.txt'}));
    });
    

});