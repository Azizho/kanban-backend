const express = require('express');
const { loginRoute } = require('./routes/auth-route/login-route');
const { registerRoute } = require('./routes/auth-route/register-route');
const cors = require('cors');
const { addboardRoute } = require('./routes/boards-route');
const {
	GetBoardByIdRoute,
} = require('./routes/boards-route/get/getBoardById-route');

const app = express();
app.use(
	cors({
		origin: 'http://localhost:3000',
		optionsSuccessStatus: 200,
	})
);
app.use(express.json());
app.use('/', loginRoute);
app.use('/', registerRoute);
app.use('/boards', addboardRoute);
app.use('/boards', GetBoardByIdRoute);

module.exports = app;
