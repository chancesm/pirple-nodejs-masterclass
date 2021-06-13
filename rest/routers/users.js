const handlers = {};
handlers.user = async (data) => ({
  code: 200,
  payload: {
    message: 'This is the users (\'/users\') route.'
  }
})



const router = {
  'users': handlers.user,
}

module.exports = {
  handlers,
  router,
}