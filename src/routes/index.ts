import express, { Request, Response } from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the WoowUp Email Service API' });
});

export default router;
