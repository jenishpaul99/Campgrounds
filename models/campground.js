mongoose = require("mongoose");
mongoose.connect('mongodb://jenishpaul99:<your password>@cluster0-shard-00-00-89oaw.mongodb.net:27017,cluster0-shard-00-01-89oaw.mongodb.net:27017,cluster0-shard-00-02-89oaw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price:String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String,
    },
});

Campground = mongoose.model("campground", campgroundSchema);
module.exports = Campground;
