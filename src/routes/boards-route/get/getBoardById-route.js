const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const Board = require('../../../models/boards');
const express = require('express');

const GetBoardByIdRoute = express.Router();

GetBoardByIdRoute.get('/:id', (req, res) => {
	const errors = req.params.id;
	if (!errors) {
		return res.status(400).json({ message: 'Нет id ( GET /boards/:id )' });
	}
	const token = req.headers?.authorization.split(' ');
	if (token[0] !== 'Bearer') {
		return res.status(401).send({ message: 'Пользователь не авторизован' });
	}
	const verifyToken = jwt.verify(token[1], process.env.SECRET);
	if (!verifyToken) {
		return res.status(401).send({ message: 'Пользователь не авторизован' });
	}
	const { _id } = verifyToken;
	User.findById(_id)
		.then(user => {
			const FindQuery = user.boards.find(item => {
				return item == req.params?.id;
			});
			if (!FindQuery) {
				return res.status(400).json({ message: 'Доска не найдена' });
			}
			Board.findById(req.params?.id)
				.then(board => {
					if (!board) {
						return res
							.status(400)
							.json({ message: 'Доска не найдена' });
					}
					return res.status(200).json(board);
				})
				.catch(err => {
					console.log(err);
					return res.status(500).json({ message: 'Ошибка сервера' });
				});
		})
		.catch(err => {
			console.log(err);
			return res.status(500).json({ message: 'Ошибка сервера' });
		});
});

module.exports = { GetBoardByIdRoute };
