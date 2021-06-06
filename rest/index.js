/*
 * This is my main entrypoint for my RESTful API
 */
const http = require('http');
const url = require('url');

//  The server should respond to requests with a string
const server = http.createServer((req, res) => {

  // Get URL and parse it
  // USE the URL contructor as url.parse is deprecated
  // src: https://stackoverflow.com/questions/59375013/node-legacy-url-parse-deprecated-what-to-use-instead
  const baseURL = req.protocol + '://' + req.headers.host + '/';
  const parsedURL = new URL(req.url, baseURL);

  // Get Path from URL
  const path = parsedURL.pathname;

  // Clean pathname (remove leading and trailing '/')
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get HTTP Method
  const method = req.method.toUpperCase();


  // Send Response
  res.end('Hello World\n');

  // Log the requested path
  console.log(`${method} Request received on path: ${trimmedPath}`)

})

// Start the server and listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})