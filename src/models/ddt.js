const mongoose = require('mongoose');

const ddtSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		default: ' ',
	},
	subtasks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			default: [],
		},
	],
	data: {
		type: mongoose.Schema.Types.Date,
		default: Date.now(),
	},
	DDtype: {
		type: String,
		enum: ['todo', 'doing', 'done'],
		required: true,
	},
});

const DDT = mongoose.model('DDT', ddtSchema);

module.exports = DDT;
