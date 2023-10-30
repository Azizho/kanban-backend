const { header, body } = require('express-validator');

module.exports = {
	addtodoValidator: [
		header('Authorization', 'Поле Authorization обязательно!').isString(),
		body('title', 'Поле title обязательно!').isString(),
		body('boardId', 'Поле boardId обязательно!').isString(),
	],
};
