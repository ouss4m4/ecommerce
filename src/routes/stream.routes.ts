import { Request, Response, Router } from 'express';
import { StreamController } from '../controllers/stream.controller';

const streamRouter = Router();

streamRouter.get('/broadcast', (req: Request, res: Response) => {
  StreamController.broadcast(req, res);
});

streamRouter.get('/listen', (req: Request, res: Response) => {
  StreamController.listen(req, res);
});

export { streamRouter };
