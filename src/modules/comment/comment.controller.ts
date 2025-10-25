import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import CommentService from "./comment.service";

const router = Router({ mergeParams: true, caseSensitive: true });

// ✅ create a new comment (without parent)
router.post("/", isAuthenticated(), CommentService.create);

// ✅ create a reply for another comment
router.post("/:id", isAuthenticated(), CommentService.create);

// ✅ get comment by id
router.get("/:id", isAuthenticated(), CommentService.getCommentById);

// ✅ update comment
router.patch("/:id", isAuthenticated(), CommentService.updateComment);

// ✅ delete (soft delete)
router.delete("/:id", isAuthenticated(), CommentService.deletcomment);

// ✅ freeze comment
router.patch("/:id/freeze", isAuthenticated(), CommentService.freezeComment);

// ✅ hard delete
router.delete("/:id/hard", isAuthenticated(), CommentService.hardDeleteComment);

// ✅ add reaction
router.patch("/:id/react", isAuthenticated(), CommentService.addReaction);

export default router;
