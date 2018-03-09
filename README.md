# egg-example

## 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```


## Controller
>**Context**
 所有`controller`都继承框架内置的`Controller`;
`ctx = Context` 请求对象(用户请求的信息)
**如:**
`query`:查询条件、
`ctx.request.body`:请求的body的数据、
`ctx.throw(404,'message')`抛出错误

>**helper**
`helper`用来提供一些实用的公用方法函数,`ctx.helper.{xxx}`在`ctx`上就能获取到`helper`的方法
```javascript
const Controller = require('egg').Controller;
class UserController extends Controller {
    constructor(ctx) {
        super(ctx)
    }
    async index() {
        const { ctx, service } = this
        // 获取查询条件
        const payload = ctx.query
        // 调用 Service 进行业务处理，传入条件
        const res = await service.user.index(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ ctx, res })
    }  

    // controller直接调用外部接口
    async logon() {
        const ctx = this.ctx;
        const result = await ctx.curl('http://xxxx/api/login');
        ctx.status = result.status;
        ctx.set(result.headers);
        const data = result.data
        ctx.body = result.data;
    }
}
```

## Service
> 接受到`controller`传入的参数，从数据库中获取数据，组合后`return`

```javascript
const Service = require('egg').Service;

class UserService extends Service {
    async index(payload) {
        const { search, currentPage, pageSize } = payload
        let res = []
        res = await this.ctx.model.User.find(search).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = res.length
        let total = await this.ctx.model.User.count({}).exec()
        return { count: count,total:total, list: res, pageSize: Number(pageSize), currentPage: Number(currentPage) }
    }
}
```
## Router
> RESTful 的方式来定义路由 `router.resources()`

```javascript
module.exports = app => {
  const { router, controller } = app;
  // router.get('/api/user', controller.user.index)
  // router.post('/api/user', controller.user.create)  
  // router.put('/api/user/:id', controller.user.update)
  router.delete('/api/user', controller.user.removes)  
  router.resources('user', '/api/user', app.jwt, controller.user)
};

```

## 插件
> `config/config.default.js` 配置文件
 `config/plugin.js` 配置需要加载的插件

 ### validate验证
 [参数文档]https://github.com/node-modules/parameter
 查看[taskInterceptor.service.ts][10]
 - `required` 是否必填
 - `type` 类型
 - `allowEmpty`允许空字符串，默认为false
 - `format`检查字符串格式 正则匹配
 - `max` 最大长度
 - `min` 最小长度
 - `compare` 检查两处密码是否相等
 ```javascript
 // config/plugin.js
exports.validate = {
  enable: true,
  package: 'egg-validate',
}

// controller/user.js
class UserController extends Controller {
    constructor(ctx) {
        this.UserCreateTransfer = {
            mobile: { type: 'string', required: true, allowEmpty: false, format: /^[0-9]{11}$/ },
            password: { type: 'password', required: true,compare: 'verifyPassWord',allowEmpty: false, min: 6 },
            userName: { type: 'string', required: true, allowEmpty: false }
        }
    }
    async update() {
        const { ctx, service } = this
        ctx.validate(this.UserUpdateTransfer)
        const { id } = ctx.params
        const payload = ctx.request.body || {}
        await service.user.update(id, payload)
        ctx.helper.success({ ctx })
    }
}
 ```

 ### cors 跨域

```javascript
// config/plugin.js
exports.cors = {
  enable: true,
  package: 'egg-cors',
}

// 跨域
// config/config.default.js
config.security = {
    csrf: {
        enable: false,
    },
    domainWhiteList: [ 'http://localhost:4200' ] //设置白名单
}
```


### bcrypt 加密
```javascript
// config/plugin.js
exports.bcrypt = {
  enable: true,
  package: 'egg-bcrypt'
}

// config/config.default.js
config.bcrypt = {
    saltRounds: 10 // default 10
}

// genHash 加密 
await this.ctx.genHash(payload.password)
// compare 解密
await ctx.compare(payload.password, user.password)
```



### JWT
```javascript
// config/plugin.js
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
}

// config/config.default.js
config.jwt = {
    secret: 'zChange',
    enable: true, // default is false
    match: '/jwt', // optional
}

// service/token.js

const Service = require('egg').Service;
class TokenService extends Service {
  async getToken(_id) {
    const {ctx} = this;
    return ctx.app.jwt.sign({
        data:{_id:_id},
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
    },ctx.app.config.jwt.secret)
  }
}

module.exports = TokenService;

// /service/login.js
class LoginService extends Service {
    async login(payload) {
        const { ctx, service } = this
        const user = await service.user.findUser(payload.userName)
      
        let verifyPsw = await ctx.compare(payload.password, user.password)
        if (!verifyPsw) {
            ctx.throw(404, 'user password is error')
        }
        return { token: await service.token.getToken(user._id) }
    }
}

// app/router.js
router.resources('user', '/api/user', app.jwt, controller.user)
```



### onerror  错误处理
**egg自带的错误处理`onerror`库**
- `all` 拦截所有错误（定义后其他错误处理将不生效）
- `html` 自定义html错误处理程序
- `text` 自定义文本错误处理程序
```javascript
// config/config.default.js
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
```

### mongoose 
mongoose API: http://mongoosejs.com/docs/connections.html
```javascript
// config/plugin.js
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
}

// config/config.default.js
config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/egg',
    options: {
      useMongoClient: true,
      autoReconnect: true,// 自动连接
      reconnectTries: Number.MAX_VALUE,// 尝试重试连接:js最大值
      bufferMaxEntries: 0,
    },
}

// model/user.js
module.exports = app => {
    const mongoose = app.mongoose
    const UserSchema = new mongoose.Schema({
      mobile: { type: String, required: true },
      password: { type: String, required: true },
      verifyPassWord: { type: String, required: true },
      avatar: { type: String, default: 'https://github.com/zChanges/angular-demo/blob/master/src/assets/img/avatar.png?raw=true'},
      extra: { type: mongoose.Schema.Types.Mixed },
      userName: { type: String, unique: true, required: true },
      createdAt: { type: Date, default: Date.now }
    })
    return mongoose.model('User', UserSchema)
  }
  
}

// service/user.js
const Service = require('egg').Service;
class UserService extends Service {
    async index(payload) {
        const { userName, mobile, role, currentPage, pageSize } = payload
        let res = []
        let count = 0
        let skip = ((Number(currentPage)) - 1) * Number(pageSize || 10)

        let _filter = {
            $and: [  // 多字段同时匹配
                { userName: { $regex: userName, $options: '$i' } },
                { mobile: { $regex: mobile } }, 
                //  $options: '$i' 忽略大小写
            ]
        }
        res = await this.ctx.model.User.find(_filter).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = res.length
        let total = await this.ctx.model.User.count({}).exec()
  
        return { count: count,total:total, list: res, pageSize: Number(pageSize), currentPage: Number(currentPage) }
    }
}
  
```


## Middleware 中间件