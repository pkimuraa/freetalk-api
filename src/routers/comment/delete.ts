import { Router, Request, Response, NextFunction } from "express";
import Comment from "../../models/comment";
import Post from "../../models/post";

const router = Router();

router.delete(
  "/api/comment/:commentId/delete/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;

    if (!commentId || !postId) {
      const error = new Error(
        "PostID and Comment ID are both required"
      ) as CustomError;
      error.status = 400;
      return next(error);
    }

    try {
      await Comment.findOneAndDelete({ _id: commentId });
    } catch (err) {
      next(new Error("Comment cannot be changed"));
    }

    await Post.findByIdAndUpdate(
      { _id: postId },
      { $pull: { comments: commentId } }
    );

    res.status(200).json({ success: true });
  }
);

export { router as deleteCommentRouter };
