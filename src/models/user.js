const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		minLength: 8,
		required: true,
	},
	userName: {
		type: String,
		minLength: 3,
		maxLength: 32,
		required: true,
		unique: true,
	},
	createdAt: {
		type: mongoose.Schema.Types.Date,
		default: Date.now(),
	},
	lastUpdate: {
		type: mongoose.Schema.Types.Date,
		default: Date.now(),
	},
	boards: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Board',
			required: true,
		},
	],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
