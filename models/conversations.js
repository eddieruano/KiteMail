var mongoose = require('mongoose');

//Scheme

var conversationsSchema = mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	last_active:{
		type: Date,
		default: Date.now
	}
});

var Conversations = module.exports = mongoose.model('Conversations', conversationsSchema);

// getters/setters

module.exports.getConversations = function(callback, limit){
	Conversations.find(callback).limit(limit);
}

