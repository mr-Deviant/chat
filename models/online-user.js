var mongoose = require('mongoose');

var onlineUserSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		unique: true,
		required: true,
		ref: 'User'
	}
});

onlineUserSchema.statics.addUser = function (userIdObj, callback) {
	var onlineUserObj = new OnlineUser({userId: userIdObj});

	onlineUserObj.save(function(err) {
		if (err) {
			console.error('Could not add online user: ' + err);
			return callback(err);
		}

		return callback(null, 1);
	});
};

onlineUserSchema.statics.getUsers = function (callback) {
	OnlineUser.find({}, function(err, docs) {
		if (err) {
			console.error('Could not get online users: ' + err);
			return callback(err);
		}
		
		return callback(null, docs);
	});
};

onlineUserSchema.statics.removeUser = function (userIdObj, callback) {
	OnlineUser.findOneAndRemove({userId: userIdObj}, function(err) {
		if (err) {
			console.error('Could not remove online user: ' + err);
			return callback(err);
		}
		
		return callback(null, 1);
	});
};

var OnlineUser = mongoose.model('OnlineUser', onlineUserSchema);
module.exports = OnlineUser;