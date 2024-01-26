import { Request, Response, NextFunction, Router } from "express";
import Post from "../../models/post";

const router = Router();

router.post(
  "/api/psot/update/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { content, title } = req.body;

    if (!id) {
      const error = new Error("Post ID is requiured") as CustomError;
      error.status = 400;
      next();
    }

    let updatedPost;

    try {
      updatedPost = await Post.findOneAndUpdate(
        { _id: id },
        { $set: { content, title } },
        { new: true }
      );
    } catch (err) {
      const error = new Error("Post cannot be edited") as CustomError;
      error.status = 400;
      next(error);
    }
    //@ts-ignore
    req.status(201).send(updatedPost);
  }
);

export { router as updatePostRouter };
