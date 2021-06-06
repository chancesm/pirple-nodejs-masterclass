// IMPORTED MODULES ------------------------------------ //
const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const config = require('./config');

// HELPER FUNCTIONS ------------------------------------ //
// Function used to combine the request and body data and return it in a concise object
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

// SERVER HANDLER FUNCTION ----------------------------- //
const serverHandler = (serverType) => (req, res) => {

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

    // Choose request handler based on path (handles index route as well)
    const chosenHandler =
      !data.trimmedPath ?
        handlers.index :
        router[data.trimmedPath] ?
          router[data.trimmedPath] : 
          handlers.notFound;

    // Await chosen handler
    const {code = 200, payload = {}} = await chosenHandler(data);
    const payloadString = JSON.stringify(payload);

    // Log server, path, and response
    console.log(`${serverType} => ${data.trimmedPath ? data.trimmedPath : '/'}\n`, {code, payload})

    // Return Response
    res.setHeader('content-type', 'application/json');
    res.writeHead(code);
    res.end(payloadString);
  })
}

// SERVER IMPLEMENTATION ------------------------------- //
// Load https files
const options = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
}
// Create the servers
const server = http.createServer(serverHandler('HTTP'));
const secureServer = https.createServer(options, serverHandler('HTTPS'));

// START SERVER ---------------------------------------- //
const PORT = config.port || 3000;
const SECURE_PORT = config.securePort || 3001;
const ENV = config.environment.toUpperCase();
server.listen(PORT, () => {
  console.log(`${ENV} HTTP Server listening on port: ${PORT}`);
})
secureServer.listen(SECURE_PORT, () => {
  console.log(`${ENV} HTTPS Server listening on port: ${SECURE_PORT}`)
})

// DEFINED HANDLERS AND ROUTES ------------------------- //
const handlers = {};
const router = {
  'ping': handlers.ping,
  'hello': handlers.hello,
}

// Handler for '/ping'. Simple health check that utilizes the defined defaults
handlers.ping = async (data) => ({});

// Handler for '/hello'. Responds with a welcome message
handlers.hello = async (data) => (
  {
    code: 200,
    payload: {
      message: "Hello API!"
    }
  }
);

// UTILITY HANDLERS ------------------------------------ //
// Handler for index ('/') route
handlers.index = async (data) => ({
  code: 200,
  payload: {
    message: 'This is the index (\'/\') route.'
  }
})

// Not Found handler. Returns 404 code
handlers.notFound = async (data) => ({code: 404});
