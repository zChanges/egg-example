'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/news', controller.news.list);

  // router.get('/api/login', controller.user.v4logo)
  router.post('/api/login', controller.login.landing)

  // user

  // router.get('/api/user', controller.user.index)
  // router.post('/api/user', controller.user.create)  
  router.delete('/api/user', controller.user.removes)  
  // router.put('/api/user/:id', controller.user.update)
  router.resources('user', '/api/user', app.jwt, controller.user)


};
