const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const http = require('http');
const { userRouter, movieRouter } = require('./router');

// main app
const app = express();
const server = http.createServer(app);

// apply middleware
app.use(cors());
app.use(bodyparser());

// end point
const response = (req, res) => res.status(200).send('<h1>REST API JCWM-15</h1>');
app.get('/', response);
app.use('/user', userRouter);
app.use('/movies', movieRouter);

// bind to local machine
// const PORT = process.env.PORT || 2000
const port = 2000;
server.listen(port, () => console.log(`API running on http://localhost:${port}`));
