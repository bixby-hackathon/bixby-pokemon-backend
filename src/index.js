import http from 'http';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import middleware from './middleware';
import config from './config.json';
import path from 'path';
import pokemon from './api/pokemon';

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: config.corsHeaders,
  }),
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(middleware({ config }));
app.use(bodyParser.json());

// api router
app.use('/pokemon', pokemon({ config }));

app.server.listen(process.env.PORT || config.port, () => {
  console.log(`Started on port ${app.server.address().port}`);
});

export default app;
