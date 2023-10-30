const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../../models/user');
const { registerValidator } = require('../../validator/register-validator');
const express = require('express');
const jwt = require('jsonwebtoken');

const registerRoute = express.Router();

module.exports = {
	registerRoute,
};

registerRoute.post('/register', registerValidator, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}
	try {
		const { email, password, userName } = req.body;
		const findUser = await User.findOne({ email });
		const findUserName = await User.findOne({ userName });
		if (!findUser && !findUserName) {
			const salt = await bcrypt.genSaltSync(17);
			const hashPassword = await bcrypt.hashSync(password, salt);
			const doc = new User({
				password: hashPassword,
				email,
				userName,
			});
			await doc.save();
			const token = jwt.sign(
				{
					email,
					userName,
					_id: doc._id,
				},
				process.env.SECRET ? process.env.SECRET : '',
				{ expiresIn: '20d' }
			);
			const { password: passwordForDb, __v, ...userData } = doc._doc;
			return res.status(201).send({ ...userData, token });
		}
		res.status(400).json({ message: 'Пользователь уже существует' });
	} catch (error) {
		res.status(500).send({ message: 'Ошибка при регистрации' });
	}
});
