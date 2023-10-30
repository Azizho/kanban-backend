const { body } = require('express-validator');

const registerValidator = [
	body('email', 'Поле email не валидно').isEmail(),
	body('password', 'Поле password не валидно').isLength({ min: 8 }),
	body('userName', 'Поле userName не валидно').isLength({ min: 3, max: 32 }),
];

module.exports = { registerValidator };
