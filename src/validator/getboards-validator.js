const { header } = require('express-validator');

const getboardsValidator = [
	header('Authorization', 'Поле Authorization обязательно!').isString(),
];

module.exports = { getboardsValidator };
