const mongoose =  require('mongoose');              /* It enable us to interact  with MongoDB like Sending registratin to it */
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    dateOfBirth: Date
});

const User = mongoose.model('User', UserSchema);
// mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true});

module.exports = User;
