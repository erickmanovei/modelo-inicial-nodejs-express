import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();
    this.cors();
    this.middlewares();
    this.routes();
  }

  cors() {
    // const whitelist = ['http://localhost:3333'];
    // const corsOptions = {
    //   origin(origin, callback) {
    //     if (whitelist.indexOf(origin) !== -1) {
    //       callback(null, true);
    //     } else {
    //       callback(new Error('Não permitido pelos CORS'));
    //     }
    //   },
    // };
    this.server.use(cors());
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(helmet());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
