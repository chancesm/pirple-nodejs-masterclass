/*
 * This is my main entrypoint for my RESTful API
 */
const http = require('http');

//  The server should respond to requests with a string
const server = http.createServer((req, res) => {
  res.end('Hello World\n');
})

// Start the server and listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})