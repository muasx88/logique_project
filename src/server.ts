import express, { Express, Request, Response } from 'express';
import { userRoute } from './routes';

const Server: Express = express();

Server.use(express.json());
Server.use(express.urlencoded({ extended: true }));

Server.get('/', (_, res: Response) => {
  console.log('akses root', process.env.NAME);
  res.send('Halo dunia');
});

Server.use('/users', userRoute);

export default Server;
