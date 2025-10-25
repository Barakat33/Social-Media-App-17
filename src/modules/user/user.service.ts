import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB/model/user/UserRepository";
import { NotFoundException, NotAuthorizedException, BadRequestException } from "../../utlis";

class UserService {
  private readonly userRepository = new UserRepository();

  // ✅ Get user profile
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.userRepository.getOne({ _id: req.params.id });
    return res.status(200).json({
      message: "User profile retrieved successfully",
      success: true,
      data: { user },
    });
  };

  // ✅ Delete profile picture (placeholder)
  deleteProfilePic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({
        message: "Profile picture deleted successfully",
        success: true,
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  };

  // ✅ Send friend request
  sendFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { friendId } = req.params;
    const user = req.user;

    // Check friend exists
    const friend = await this.userRepository.getOne({ _id: friendId });
    if (!friend) throw new NotFoundException("User not found");

    // Can't send to self
    if (friendId === user._id.toString()) throw new BadRequestException("You can't send a friend request to yourself");

    // Check if already friends
    if (user.friends?.map((id: any) => id.toString()).includes(friendId))
      throw new BadRequestException("You are already friends");

    // Check if already sent
    if (friend.friendRequests?.map((id: any) => id.toString()).includes(user._id.toString()))
      throw new BadRequestException("Friend request already sent");

    // Add request to friend's list
    await this.userRepository.update(
      { _id: friendId },
      { $push: { friendRequests: user._id } }
    );

    return res.status(200).json({
      message: "Friend request sent successfully",
      success: true,
    });
  };

  // ✅ Delete friend request
  deleteFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { friendId } = req.params;
    const user = req.user;

    // Check friend exists
    const friend = await this.userRepository.getOne({ _id: friendId });
    if (!friend) throw new NotFoundException("User not found");

    // Remove the request (if it exists)
    await this.userRepository.update(
      { _id: friendId },
      { $pull: { friendRequests: user._id } }
    );

    return res.status(200).json({
      message: "Friend request deleted successfully",
      success: true,
    });
  };

  // ✅ Unfriend user
  unFriend = async (req: Request, res: Response, next: NextFunction) => {
    const { friendId } = req.params;
    const user = req.user;

    // Check friend exists
    const friend = await this.userRepository.getOne({ _id: friendId });
    if (!friend) throw new NotFoundException("User not found");

    // Remove each other from friend lists
    await this.userRepository.update(
      { _id: user._id },
      { $pull: { friends: friendId } }
    );

    await this.userRepository.update(
      { _id: friendId },
      { $pull: { friends: user._id } }
    );

    return res.status(200).json({
      message: "Unfriended successfully",
      success: true,
    });
  };

  // ✅ Block user
  blockUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const user = req.user;

    if (userId === user._id.toString())
      throw new BadRequestException("You can't block yourself");

    const userToBlock = await this.userRepository.getOne({ _id: userId });
    if (!userToBlock) throw new NotFoundException("User not found");

    // Remove any existing friendship or requests
    await this.userRepository.update(
      { _id: user._id },
      {
        $pull: { friends: userId, friendRequests: userId },
        $addToSet: { blockedUsers: userId },
      }
    );

    return res.status(200).json({
      message: "User blocked successfully",
      success: true,
    });
  };
}

export default new UserService();
