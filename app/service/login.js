'use strict';

const Service = require('egg').Service;

class LoginService extends Service {
    async login(payload) {
        const { ctx, service } = this
        const user = await service.user.findUser(payload.userName)
        if (!user) {
            ctx.throw(404, 'user not found')
            // this.ctx.throwBizError('USER_NOT_FOUND', 'user not found', {bizError: true})
            // return user
        }
      
        let verifyPsw = await ctx.compare(payload.password, user.password)
        if (!verifyPsw) {
            ctx.throw(404, 'user password is error')
            // return verifyPsw
        }
        // 生成Token令牌
        return { token: await service.token.getToken(user._id) }
    }
}

module.exports = LoginService;
