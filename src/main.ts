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
import express, {
  Request,
  Response,
  NextFunction,
  urlencoded,
  json,
} from "express";
import mongoose from "mongoose";
import cors from "cors";

const start = async () => {

  if (!process.env.MONGO_URI) throw new Error("MONGO_URI UNDEFINED");

  try {
    mongoose.connect(process.env.MONGO_URI);

  } catch (err) {
    throw new Error("databse error");
  }
};

const app = express();
start()

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(newPostRouter);
app.use(deletePostRouter);
app.use(updatePostRouter);
app.use(showPostRouter);

app.use(newCommentRouter);
app.use(deleteCommentRouter);

declare global {
  interface CustomError extends Error {
    status?: number;
  }
}

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error("not Found") as CustomError;
  error.status = 404;
  next(error);
});

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    res.status(500).json({ message: "Something is wrong" });
  }
);



app.listen(8080, () => console.log("up and running on 8080"));
