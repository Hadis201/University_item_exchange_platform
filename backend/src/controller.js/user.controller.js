import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../model/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { upload } from "../middleware/multermiddleware.js";
import mongoose from "mongoose";
import { Product } from "../model/product.model.js";
import { Otp } from "../model/Otp.model.js";
import { sendPasswordResetEmail,sendVerificationEamil,senWelcomeEmail } from "../middleware/Email.js";
//import { sendVerificationEamil, senWelcomeEmail, sendPasswordResetEmail } from "../utils/email.js";

const generateAccessToken = async (userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })
      return { accessToken, refreshToken }
   }
   catch (err) {
      throw new ApiError(500, "something went wrong in token generation")
   }
}


 const signUp = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password, studentId, phoneNumber } = req.body;

  if ([fullName, email, userName, password, studentId, phoneNumber].some((f) => !String(f).trim())) {
    throw new ApiError(400, "All fields are required");
  }

  if (!email.includes("@student.sust.edu")) {
    throw new ApiError(400, "Please use your valid student email (@student.sust.edu)");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { userName: userName.toLowerCase() }] });
  if (existedUser) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP in MongoDB
  await Otp.findOneAndUpdate(
    { email, purpose: "signup" },
    {
      otp,
      purpose: "signup",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      userData: { fullName, email, userName, password, studentId, phoneNumber },
    },
    { upsert: true, new: true }
  );

  // Send Email
  await sendVerificationEamil(email, otp);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent to your email for verification"));
});


// const signUp = asyncHandler(async (req, res) => {
//    const { fullName = "", email = "", userName = "", password = "",studentId = "",phoneNumber = "" } = req.body

//    if ([fullName, email, userName, password,studentId,phoneNumber].some((field) => String(field).trim() === "")) {
//       throw new ApiError(400, "All fields are required")
//    }

//    const existedUser = await User.findOne({
//       $or: [{ userName }, { email }]
//    })
//    if (existedUser) {
//       throw new ApiError(400, "User with email or username already exists")
//    }


//    const user = await User.create({
//       fullName,
//       email,
//       password,
//       userName: userName.toLowerCase(),
//       studentId,
//       phoneNumber,
      
//    })

//    const createdUser = await User.findById(user.id).select(
//       "-password -refreshToken"
//    )
//    if (!createdUser) {
//       throw new ApiError(400, "something went wrong when created user")
//    }

//    return res.status(201).json(
//       new ApiResponse(201, createdUser, "user registered successfully")
//    )

// })

//verify otp and createuser
export const verifySignUpOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email, purpose: "signup" });

  if (!record) throw new ApiError(400, "No OTP request found for this email");
  if (record.otp !== otp) throw new ApiError(400, "Invalid OTP");
  if (record.expiresAt < new Date()) throw new ApiError(400, "OTP expired");

  const { fullName, userName, password, studentId, phoneNumber } = record.userData;

  //const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email,
    userName: userName.toLowerCase(),
    password,
    studentId,
    phoneNumber,
  });

  await senWelcomeEmail(email, fullName);

  // delete otp
  await Otp.deleteOne({ email, purpose: "signup" });

  return res
    .status(201)
    .json(new ApiResponse(201, { id: user._id, email: user.email }, "Signup successful and verified"));
});

export const forgetPassword = asyncHandler(async (req, res) => {
  const { userName } = req.body;

  const user = await User.findOne({ userName: userName.toLowerCase() });
  if (!user) throw new ApiError(404, "User not found");

  const email = user.email;
  if (!email.includes("@student.sust.edu")) {
    throw new ApiError(400, "Please use your valid student email (@student.sust.edu)");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.findOneAndUpdate(
    { email, purpose: "reset" },
    { otp, purpose: "reset", expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
    { upsert: true, new: true }
  );

  await sendPasswordResetEmail(email, otp);

  return res.status(200).json(new ApiResponse(200, {}, "OTP sent to your email for password reset"));
});





export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Step 1: Find OTP record
  const record = await Otp.findOne({ email, purpose: "reset" });
  if (!record) throw new ApiError(400, "No OTP found");
  if (record.otp !== otp) throw new ApiError(400, "Invalid OTP");
  if (record.expiresAt < new Date()) throw new ApiError(400, "OTP expired");

  // Step 2: Find the user
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  // Step 3: Set new password (auto-hash via userSchema.pre("save"))
  user.password = newPassword;
  await user.save(); // will trigger the pre('save') hook

  // Step 4: Delete OTP record
  await Otp.deleteOne({ email, purpose: "reset" });

  // Step 5: Respond
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successful"));
});





const loginUser = asyncHandler(async (req, res) => {
   const { userName, password } = req.body;

   if (!userName) {
      throw new ApiError(400, "username is required");
   }

   const user = await User.findOne({ userName: userName.toLowerCase() });
   if (!user) {
      throw new ApiError(404, "user not found");
   }

   const isCorrect = await user.isPasswordCorrect(password);
   if (!isCorrect) {
      throw new ApiError(401, "incorrect password");
   }

   const { accessToken, refreshToken } = await generateAccessToken(user._id);

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
   };

   return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
         new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in successfully"
         )
      );
});


const logoutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
      req.user._id, {
      $set: {
         refreshToken: undefined
      }
   },
      {
         new: true
      }
   )
   const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
   }
   return res.status(200).clearCookie("accessToken", option).clearCookie("refreshToken", option).json(
      new ApiResponse(200, {}, "user logged out successfully")
   )
})

const refreshAccesstoken = asyncHandler(async (req, res) => {
   const incomingrefreshtoken = req.cookies?.refreshToken || req.body?.refreshToken
   if (!incomingrefreshtoken) {
      throw new ApiError(401, "unathorized")
   }
   try {
      const decoded = jwt.verify(incomingrefreshtoken, process.env.REFRESH_TOKEN_SECRET)
      const user = await User.findById(decoded._id)
      if (!user || user.refreshToken !== incomingrefreshtoken) {
         throw new ApiError(401, "unathorized")
      }
      const { accessToken, refreshToken } = await generateAccessToken(user._id)
      const option = {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production'
      }
      return res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json(
         new ApiResponse(
            200,
            {
               accessToken, refreshToken
            },
            "access token refreshed successfully"
         )
      )
   } catch (error) {
      throw new ApiError(401, error?.message || "error in refresh access token")
   }
})


const changecurrentpassword = asyncHandler(async (req, res) => {
   const { oldPassword, newPassword } = req.body
   const user = await User.findById(req.user._id)
   if (!user) {
      throw new ApiError(404, "user not found")
   }
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
   if (!isPasswordCorrect) {
      throw new ApiError(400, "old password is incorrect")
   }
   user.password = newPassword
   await user.save({ validateBeforeSave: false })
   return res.status(200).json(
      new ApiResponse(200, {}, "password changed successfully")
   )
})

const updateAccountdetails = asyncHandler(async (req, res) => {
   const { fullName, email,phoneNumber,studentId } = req.body

   if (!fullName || !email || !phoneNumber || !studentId) {
      throw new ApiError(400, "fullName,email,phoneNumber,studentId are required")
   }
   const user = await User.findByIdAndUpdate(
      req.user._id,
      {
         $set: {
            fullName,
            email: email,
            phoneNumber,
            studentId
         }
      }
      , { new: true }
   ).select("-password -refreshToken")
   return res.status(200).json(
      new ApiResponse(200, user, "user details updated successfully")
   )

})


// ✅ Get all posts by logged in user
const getMyPosts = asyncHandler(async (req, res) => {
   const products = await Product.find({ owner: req.user._id }).sort({ createdAt: -1 });
   return res.status(200).json(
      new ApiResponse(200, products, "Fetched all your posts successfully")
   );
});

//get user profile

const getUserProfile = asyncHandler(async (req, res) => {
   const userId = req.user._id;

   const result = await User.aggregate([
      {
         $match: { _id: new mongoose.Types.ObjectId(userId) }  // match the logged-in user
      },
      {
         $lookup: {
            from: "products",              // collection name of Product model
            localField: "_id",             // user._id
            foreignField: "owner",         // product.owner
            as: "posts"                    // result field
         }
      },
      {
         $project: {
            password: 0,
            refreshToken: 0,
            "posts.__v": 0
         }
      },
      {
         $addFields: {
            totalPosts: { $size: "$posts" }
         }
      }
   ]);

   if (!result || result.length === 0) {
      throw new ApiError(404, "User not found");
   }

   return res.status(200).json(
      new ApiResponse(200, result[0], "User profile fetched successfully")
   );
});





// ✅ Delete one post by logged in user
const deleteMyPost = asyncHandler(async (req, res) => {
   const { productId } = req.params;
   const deleted = await Product.findOneAndDelete({ _id: productId, owner: req.user._id });

   if (!deleted) {
      throw new ApiError(404, "Post not found or you are not authorized to delete");
   }

   return res.status(200).json(
      new ApiResponse(200, {}, "Post deleted successfully")
   );
});


export{signUp,loginUser,
   logoutUser,
   refreshAccesstoken,
   changecurrentpassword,
   updateAccountdetails,
   getMyPosts,
   deleteMyPost,
   getUserProfile}