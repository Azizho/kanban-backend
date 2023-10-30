const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
	title: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
	todos: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'DDT',
			default: [],
		},
	],
	doing: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'DDT',
			default: [],
		},
	],
	done: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'DDT',
			default: [],
		},
	],
	createdAt: {
		type: mongoose.Schema.Types.Date,
		default: Date.now(),
	},
	lastUpdate: {
		type: mongoose.Schema.Types.Date,
		default: Date.now(),
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
