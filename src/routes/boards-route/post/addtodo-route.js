const express = require('express');
const { addtodoValidator } = require('../../../validator/addtodo-validator');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../../../models/user');
const DDT = require('../../../models/ddt');
const Board = require('../../../models/boards');

module.exports = addboardRoute => {
	addboardRoute.post('/todos', addtodoValidator, (req, res) => {
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
		const isAuthorizate = jwt.verify(
			token[1],
			process.env.SECRET,
			(err, decoded) => (err ? false : decoded)
		);

		if (!isAuthorizate) {
			return res
				.status(401)
				.json({ message: 'Пользователь не авторизован' });
		}

		const { _id } = isAuthorizate;
		const { title, boardId, description, subtasks } = req.body;
		User.findById(_id)
			.then(async user => {
				const IsBoard = await Promise.all(
					user._doc.boards.map(board => {
						const boardFindById = Board.findById(board)
							.then(board => board)
							.catch(e => e);
						return boardFindById;
					})
				);
				const IsTodoInBoard = IsBoard?.todos?.find(
					item => item?.title === title
				);
				if (IsBoard) {
					if (IsTodoInBoard) {
						return res.status(400).json({
							message: 'Задача с таким названием уже существует',
						});
					}
					const todoDDT = new DDT({
						title,
						description,
						subtasks,
						DDtype: 'todo',
					});
					todoDDT.save();
					Board.findById(boardId).then(board => {
						board.todos.push(todoDDT._id);
						console.log(board);
						board.save();
						res.status(200).json({ ...board.todos });
					});
					return;
				}
				return res.status(400).json({ message: 'Доска не найдена' });
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({ message: 'Ошибка сервера' });
			});
	});
};
