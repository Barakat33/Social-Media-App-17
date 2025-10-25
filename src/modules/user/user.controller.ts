import { Router } from "express";
import userService from "./user.service";
import { isAuthenticated } from "../../middleware/auth.middleware";
import { isvalid } from "../../middleware/validation.middleware";

const router = Router();

// ✅ delete profile pic (fixed path)
router.delete(
  "/profile-pic",
  isAuthenticated,
  isvalid,
  userService.deleteProfilePic
);

// ✅ get profile
router.get("/:id", isAuthenticated(), userService.getProfile);

// ✅ send friend request
router.post("/send-request/:friendId", isAuthenticated, userService.sendFriendRequest);

// ✅ delete friend request
router.delete("/delete-request/:friendId", isAuthenticated, userService.deleteFriendRequest);

// ✅ unfriend
router.delete("/unfriend/:friendId", isAuthenticated, userService.unFriend);

// ✅ block user
router.delete("/block/:userId", isAuthenticated, userService.blockUser);

export default router;
