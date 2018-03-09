'use strict';

// had enabled by egg
// exports.static = true;

// 验证
exports.validate = {
  enable: true,
  package: 'egg-validate',
}

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
}

// 跨域
exports.cors = {
  enable: true,
  package: 'egg-cors',
}

// 加密
exports.bcrypt = {
  enable: true,
  package: 'egg-bcrypt'
}

exports.jwt = {
  enable: true,
  package: 'egg-jwt',
}

exports.bizerror = {
  enable: true,
  package: 'egg-bizerror',
};
