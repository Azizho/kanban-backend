const express = require('express');
const addBoard = require('./post/addboard-route');
const addTodo = require('./post/addtodo-route');
const getBoardsRoute = require('./get/getboards-route');

const addboardRoute = express.Router();

addBoard(addboardRoute);
addTodo(addboardRoute);
getBoardsRoute(addboardRoute);

module.exports = {
	addboardRoute,
};
