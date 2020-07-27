mongoose = require("mongoose");
passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect('mongodb://jenishpaul99:Jenish%401999@cluster0-shard-00-00-89oaw.mongodb.net:27017,cluster0-shard-00-01-89oaw.mongodb.net:27017,cluster0-shard-00-02-89oaw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
