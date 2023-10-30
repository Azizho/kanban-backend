const { getboardsValidator } = require('../../../validator/getboards-validator');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const Board = require('../../../models/boards');

const GetBoardsRoute = addboardRoute => {
	addboardRoute.get('/', getboardsValidator, (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}
		const token = req.headers?.authorization.split(' ');
		if (token[0] !== 'Bearer') {
			return res
				.status(401)
				.send({ message: 'Пользователь не авторизован' });
		}
		const verifyToken = jwt.verify(token[1], process.env.SECRET);
		if (!verifyToken) {
			return res
				.status(401)
				.send({ message: 'Пользователь не авторизован' });
		}
		const { _id } = verifyToken;
		User.findById(_id)
			.then(async user => {
				const boards = await Promise.all(
					user?.boards.map(board =>
						Board.findById(board)
							.then(board => {
								return board;
							})
							.catch(err => {
								return res
									.status(500)
									.json({ message: 'Ошибка сервера' });
							})
					)
				);
				res.status(200).json(boards);
			})
			.catch(err => {
				console.log(err);
				return res.status(500).json({ message: 'Ошибка сервера' });
			});
	});
};

module.exports = GetBoardsRoute;
