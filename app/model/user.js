module.exports = app => {
    const mongoose = app.mongoose
    const UserSchema = new mongoose.Schema({
      mobile: { type: String, required: true },
      password: { type: String, required: true },
      // role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
      avatar: { type: String, default: 'https://github.com/zChanges/angular-demo/blob/master/src/assets/img/avatar.png?raw=true'},
      extra: { type: mongoose.Schema.Types.Mixed },
      userName: { type: String, unique: true, required: true },
      createdAt: { type: Date, default: Date.now }
    })
    return mongoose.model('User', UserSchema)
  }
  