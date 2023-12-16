const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
app.use(cors());
const userRouter = require('./routes/user');
const reportRouter = require('./routes/report');
const assetsRouter = require('./routes/assets');
const migrateRouter = require('./routes/migrate');
const errorlogger = require('./utils/errorLogger');

const port = process.env.PORT || 2222;

app.use(express.json());
app.use(userRouter);
app.use(reportRouter);
app.use(assetsRouter);
app.use(migrateRouter);
app.use(errorlogger);
app.listen(port, () => {
  console.log('server running at port', port);
});
