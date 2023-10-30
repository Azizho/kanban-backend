const { addboardValidator } = require('../../../validator/addboard-validator');
const { validationResult } = require('express-validator');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const Board = require('../../../models/boards');

const addBoard = addboardRoute => {
	addboardRoute.post('/', addboardValidator, async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		try {
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
			const { title, todos, doing, done } = req.body;
			const { _id } = verifyToken;
			const user = await User.findById(_id).exec();
			if (user) {
				const UserBoards = await Promise.all(
					user.boards.map(item => {
						const boardFindById = Board.findById(item)
							.then(board => board)
							.catch(e => e);
						return boardFindById;
					})
				);
				const isBoardInUser = UserBoards.find(
					item => item?.title === title
				);
				if (isBoardInUser) {
					return res.status(400).json({
						message: 'Доска с таким названием уже существует',
					});
				}
				const board = await new Board({
					title: req.body.title,
					todos,
					doing,
					done,
					owner: _id,
				});
				await board.save();
				user.boards.push(board._id);
				user.lastUpdate = Date.now();
				await user.save();
				const { __v, owner, ...boardDoc } = board._doc;
				return res.status(201).json({
					message: 'Доска успешно создана',
					board: boardDoc,
				});
			}
			return res.status(400).json({
				message: 'Пользователь не найден',
			});
		} catch (e) {
			console.log(e);
			return res.status(500).json({
				message: 'Ошибка при добавлении доски',
			});
		}
	});
};

module.exports = addBoard;
