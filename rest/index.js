/*
 * This is my main entrypoint for my RESTful API
 */
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// HELPER FUNCTION ------------------------------------- //
const getReqData = (req, body) => {
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

  return {
    trimmedPath,
    queryParams,
    method,
    headers,
    body
  }
}

// SERVER IMPLEMENTATION ------------------------------- //
const server = http.createServer((req, res) => {

  // Create String Decoder
  const decoder = new StringDecoder('utf-8');

  // Decode Payload as it comes in.
  let body = '';
  req.on('data', (data) => {
    body += decoder.write(data);
  })

  // Handle the request once all data is received
  req.on('end', async () => {
    body += decoder.end();

    // create data object for handler from request and body
    const data = getReqData(req, body);

    // Choose request handler based on path
    const chosenHandler = (data.trimmedPath && handlers[data.trimmedPath]) ? handlers[data.trimmedPath] : handlers.notFound;

    // Await chosen handler
    const {code = 200, payload = {}} = await chosenHandler(data);
    const payloadString = JSON.stringify(payload);

    // Log the requested path
    console.log({code, payload})

    // Return Response
    res.setHeader('content-type', 'application/json');
    res.writeHead(code);
    res.end(payloadString);
  })
})

// START SERVER ---------------------------------------- //
const PORT = config.port || 3000;
const ENV = config.environment.toUpperCase();
server.listen(PORT, () => {
  console.log(`${ENV} Server listening on port: ${PORT}`);
})

// DEFINE HANDLERS ------------------------------------- //
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