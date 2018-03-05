'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
    constructor(ctx) {
        super(ctx)

        this.UserLoginTransfer = {
            userName: { type: 'string', required: true, allowEmpty: false },
            password: { type: 'string', required: true, allowEmpty: false }
        }
    }

    async landing() {
        const { ctx, service } = this
        // 校验参数
        ctx.validate(this.UserLoginTransfer)
        // 组装参数
        const payload = ctx.request.body || {}
        // 调用 Service 进行业务处理
        const res = await service.login.login(payload)
        // 设置响应内容和响应状态码
        if (res) {
            ctx.helper.success({ ctx, res })
            return
        }
        ctx.helper.fail({ctx,res:'用户名或密码错误'})

    }
}

module.exports = LoginController;
