import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

/* GET home page. */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Welcome to the WoowUp Email Service API" });
});

export default router;
