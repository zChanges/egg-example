const Service = require('egg').Service;

class UserService extends Service {

    // index======================================================================================================>
    async index(payload) {
        const { userName, mobile, role, currentPage, pageSize } = payload
        let res = []
        let count = 0
        let skip = ((Number(currentPage)) - 1) * Number(pageSize || 10)

        let _filter = {
            $and: [  // 多字段同时匹配
                { userName: { $regex: userName, $options: '$i' } },
                { mobile: { $regex: mobile } }, //  $options: '$i' 忽略大小写
                // { role: { $regex: role } }
            ]
        }

        res = await this.ctx.model.User.find(_filter).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = res.length

        // res = await this.ctx.model.User.find().sort({ createdAt: -1 }).exec()
        let total = await this.ctx.model.User.count({}).exec()
        // 整理数据源 -> Ant Design Pro
        let data = res.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.key = i
            jsonObject.password = '******'
            jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt)
            return jsonObject
        })
        return { count: count,total:total, list: data, pageSize: Number(pageSize), currentPage: Number(currentPage) }
    }


    async create(payload) {
        const { ctx, service } = this
        payload.password = await this.ctx.genHash(payload.password)
        return ctx.model.User.create(payload)
    }


    async removes(payload) {
        return this.ctx.model.User.remove({ _id: { $in: payload } })
    }


    async update(_id, payload) {
        const { ctx, service } = this
        const user = await ctx.service.user.find(_id)
        if (!user) {
            ctx.throw(404, 'user not found')
        }
        return ctx.model.User.findByIdAndUpdate(_id, payload)
    }



    async find(id) {
        return this.ctx.model.User.findById(id)
    }

    async findUser(user) {
        return this.ctx.model.User.findOne({ userName: user })
    }

}

module.exports = UserService;
