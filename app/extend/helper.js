const moment = require('moment')
// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD hh:mm:ss')
// 处理成功响应
exports.success = ({ ctx, res = null, success = true, message = '请求成功' }) => {
  ctx.body = {
    code: 0,
    success,
    result: res,
    message
  }
  ctx.status = 200
}

// 处理失败响应
exports.fail = ({ ctx, result = null, success = false, code = -1 }) => {
  ctx.body = {
    code: code,
    success,
    message: result
  }
  ctx.status = 200
}