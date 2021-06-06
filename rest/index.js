/*
 * This is my main entrypoint for my RESTful API
 */
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

//  The server should respond to requests with a string
const server = http.createServer((req, res) => {

  // Get URL and parse it
  // USE the URL contructor as url.parse is deprecated
  // src: https://stackoverflow.com/questions/59375013/node-legacy-url-parse-deprecated-what-to-use-instead
  const baseURL = req.protocol + '://' + req.headers.host + '/';
  const parsedURL = new url.URL(req.url, baseURL);

  // Get Path from URL
  const path = parsedURL.pathname;

  // Clean pathname (remove leading and trailing '/')
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get query string as object
  // NOTE: url.query is deprecated. Use URLSearchParams class instead
  // Reference: https://nodejs.org/docs/latest-v14.x/api/url.html#url_class_urlsearchparams
  const queryStringObject = parsedURL.searchParams;

  // Get HTTP Method
  const method = req.method.toUpperCase();

  // Get Payload if exists
  const decoder = new StringDecoder('utf-8');
  let body = '';
  // add to buffer as data comes in
  req.on('data', (data) => {
    body += decoder.write(data);
  })
  req.on('end', () => {
    body += decoder.end();

    // Log the requested path
    console.log({method, trimmedPath, headers, body})
  })

  // Get HTTP Headers
  const headers = req.headers;

  // Send Response
  res.end('Hello World\n');

  
})

// Start the server and listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})