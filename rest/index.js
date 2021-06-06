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
  const queryParams = parsedURL.searchParams;

  // Get HTTP Method
  const method = req.method.toUpperCase();

  // Get HTTP Headers
  const headers = req.headers;

  // Get Payload if exists
  const decoder = new StringDecoder('utf-8');
  let body = '';
  // add to buffer as data comes in
  req.on('data', (data) => {
    body += decoder.write(data);
  })

  // Handle the request once all data is received
  req.on('end', async () => {
    body += decoder.end();

    // Choose request handler based on path
    const chosenHandler = handlers[trimmedPath] ? handlers[trimmedPath] : handlers.notFound;
    // create data object for handler
    const data = {
      trimmedPath,
      queryParams,
      method,
      headers,
      body
    }

    const {code = 200, payload = {}} = await chosenHandler(data);
    const payloadString = JSON.stringify(payload);
    // Log the requested path
    console.log({code, payload})

    // Return Response
    res.writeHead(code);
    res.end(payloadString);
  })
})

// Start the server and listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})



// Define Handlers
const handlers = {};

handlers.sample = (data) => {
  // Callback (resolve?) HTTP status and a payload object
  return Promise.resolve({code: 200, payload: {name: 'sample handler'}})
}

handlers.notFound = (data) => {
  return Promise.resolve({code: 404});
}

// Define a router
const router = {
  'sample': handlers.sample
}