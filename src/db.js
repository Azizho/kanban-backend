const mongoose = require('mongoose');

const dbConnect = async () => {
	const DB_URL = process.env.DB_URL || ' ';
	try {
		const connect = await mongoose.connect(DB_URL);
		console.log('Connected to DB');
	} catch (error) {
		console.log(error);
	}
};

module.exports = { dbConnect };
