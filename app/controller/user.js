const Controller = require('egg').Controller;

class UserController extends Controller {
    constructor(ctx) {
        super(ctx)

        this.UserCreateTransfer = {
            mobile: { type: 'string', required: true, allowEmpty: false, format: /^[0-9]{11}$/ },
            password: { type: 'password', required: true, allowEmpty: false, min: 6 },
            userName: { type: 'string', required: true, allowEmpty: false }
        }

        this.UserUpdateTransfer = {
            mobile: { type: 'string', required: true, allowEmpty: false },
            userName: { type: 'string', required: true, allowEmpty: false }
        }
    }


    // 获取所有用户(分页/模糊)
    async index() {
        const { ctx, service } = this
        // 组装参数
        const payload = ctx.query
        // 调用 Service 进行业务处理
        const res = await service.user.index(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 创建用户
    async create() {
        const { ctx, service } = this
        // 校验参数
        ctx.validate(this.UserCreateTransfer,ctx.request.body)
        // 组装参数
        const payload = ctx.request.body || {}
        // 调用 Service 进行业务处理
        const res = await service.user.create(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }

    // 删除所选用户(条件id[])
    async removes() {
        const { ctx, service } = this
        // 组装参数
        // const payload = ctx.queries.id
        // const { id } = ctx.request.body
        const { id } = ctx.query
        const payload = id.split(',') || []
        // 调用 Service 进行业务处理
        const result = await service.user.removes(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx })
    }


    // 修改用户
    async update() {
        const { ctx, service } = this
        // 校验参数
        ctx.validate(this.UserUpdateTransfer)
        // 组装参数
        const { id } = ctx.params
        const payload = ctx.request.body || {}
        // 调用 Service 进行业务处理
        await service.user.update(id, payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx })
    }


    // 删除单个用户
    async destroy() {
        const { ctx, service } = this
        // 校验参数
        const { id } = ctx.params
        // 调用 Service 进行业务处理
        await service.user.destroy(id)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx })
    }


    // 测试v4接口代码
    async v4logo() {
        const ctx = this.ctx;
        const result = await ctx.curl('http://v4.faqrobot.net/login/login');
        ctx.status = result.status;
        ctx.set(result.headers);
        const data = result.data
        // ctx.helper.success({ data })
        ctx.body = result.data;
    }



}

module.exports = UserController;
