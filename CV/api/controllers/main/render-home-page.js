module.exports = {


  friendlyName: 'Render home page',


  description: 'this would render the main page',





  exits: {
    success: {
      statusCode: 200,
      description: 'Requesting user is a guest, so show the public landing page.',
      viewTemplatePath: 'pages/CV'
    },
  },


  fn: async function () {
    sails.log.debug('new visitor with ip: ' + this.req.ip);
    // All done.
    return;

  }


};
