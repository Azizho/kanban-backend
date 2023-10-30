const { body, header } = require('express-validator');

const addboardValidator = [
	header('Authorization', 'Поле Authorization обязательно!').isString(),
	body('title', 'Поле title обязательно!')
		.isString()
		.isLength({ min: 3, max: 15 }),
];

module.exports = { addboardValidator };
