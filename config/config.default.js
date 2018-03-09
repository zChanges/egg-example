'use strict';



module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1518249922311_2381';

  // add your config here
  config.middleware = [];

  config.news = {
    pageSize: 5,
    serverUrl: 'https://hacker-news.firebaseio.com/v0',
  };

  
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/egg',
    options: {
      useMongoClient: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0,
    },
  }

  // 跨域
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://localhost:4200' ],
  }

  // 加密
  config.bcrypt = {
    saltRounds: 10 // default 10
  }

  config.jwt = {
    secret: 'zChange',
    enable: true, // default is false
    match: '/jwt', // optional
  }

  config.onerror = {
    all(err, ctx) {
      ctx.body = {
        code: -1,
        success:false,
        message: err.errors ? err.errors : err.message 
      };
      ctx.status = 200;
    }
  };

  // meiyongdao
  // config.bizerror = {
  //   breakDefault: false, // disable default error handler
  //   sendClientAllParams: false, // return error bizParams to user
  //   interceptAllError: false, // handle all excepy
  return config;
};

