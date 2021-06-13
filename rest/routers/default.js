const handlers = {}
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


const router = {
  'ping': handlers.ping,
  'hello': handlers.hello,
}

module.exports = {
  handlers,
  router,
}