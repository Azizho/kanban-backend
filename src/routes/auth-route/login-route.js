const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../../models/user');
const { registerValidator } = require('../../validator/register-validator');
const express = require('express');
const jwt = require('jsonwebtoken');

const loginRoute = express.Router();

module.exports = {
	loginRoute,
};

loginRoute.post('/login', registerValidator, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}
	try {
		const { email, password, userName } = req.body;
		const findUser = await User.findOne({ email, userName });
		if (!findUser) {
			return res
				.status(400)
				.send({ message: 'Неверный логин или пароль' });
		}

		const comparePassword = await bcrypt.compare(
			password,
			findUser._doc.password
		);
		if (comparePassword) {
			const token = jwt.sign(
				{
					email,
					userName,
					_id: findUser._id,
				},
				process.env.SECRET ? process.env.SECRET : '',
				{ expiresIn: '20d' }
			);

			const { password: passwordForDb, __v, ...userData } = findUser._doc;
			return res.status(200).send({ ...userData, token });
		}

		res.status(400).send({ message: 'Неверный логин или пароль' });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Ошибка при авторизации' });
	}
});
