require('dotenv').config();
const { dbConnect } = require('./db');
const app = require('./app');

const port = process.env.PORT || 3600;
dbConnect();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
