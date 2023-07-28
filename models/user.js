const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
email: {
type: String,
required: true,
unique: true
},
password: {
type: String,
required: true,
},
firstname: {
type: String,
required: true,
},
lastname: {
type: String,
required: true,
},
role: {
type: String,
enum: ["user", "admin"],
default: "user"
},

},
{
timestamps: true,
},
)
userSchema.pre('save', async function(next) {
if (!this.isModified('password')) return next()
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(this.password, salt)
this.password = hashedPassword
next()
})
module.exports = mongoose.model('User', userSchema)