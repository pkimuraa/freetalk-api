import * as dotenv from "dotenv";
dotenv.config();

import {
  newPostRouter,
  deletePostRouter,
  updatePostRouter,
  showPostRouter,
  newCommentRouter,
  deleteCommentRouter,
} from "./routers";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

const app = express();

express.urlencoded({ extended: false });
express.json();

declare global {
  interface CustomError extends Error {
    status?: number;
  }
}


app.use(newPostRouter);
app.use(deletePostRouter)
app.use(updatePostRouter);
app.use(showPostRouter);

app.use(newCommentRouter);
app.use(deleteCommentRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const error = new Error('not Found') as CustomError;
  error.status = 404;
  next(error);
})

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    res.status(500).json({ message: "Something is wrong" });
  }
);

const start = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI UNDEFINED");

  try {
    mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    throw new Error("databse error");
  }
};

app.listen(8080, () => console.log("up and running on 8080"));
