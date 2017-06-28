//test1 .js
//http://localhost:3001/test1/foo


module.exports = {

    foo: function() {

        this.response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Trailer': 'Content-MD5'
        });
        this.response.write("Hello foo");
        this.response.end();

    },
    bar: function() {

        this.response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Trailer': 'Content-MD5'
        });
        this.response.write("Hello bar");
        this.response.end();

    }

}