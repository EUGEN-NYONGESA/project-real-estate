import bcrypt from 'bcryptjs';
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/email.js';
import { User } from "../models/user.model.js";


export const signup = async (req, res) => {
    let { email, password, name } = req.body;
  
    try {
      // Validate input
      if (!email || !password || !name) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required for registration!" });
      }
  
      // Normalize email to lowercase
      email = email.toLowerCase();
  
      // Check if the email already exists
      const userAlreadyExists = await User.findOne({ email });
      if (userAlreadyExists) {
        return res
          .status(400)
          .json({ success: false, message: "The email is already registered to another user!" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Generate verification token
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
  
      // Create a new user
      const user = new User({
        email,
        password: hashedPassword,
        name,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });
  
      await user.save();
  
      // Send response
      res.status(201).json({
        success: true,
        message: "Registration successful! OTP code sent to your email for account verification",
      });
  
      // TODO: Add logic to send the OTP via email (e.g., using a mailer library)
    } catch (error) {
      console.error("Error in signup:", error.message);
      res.status(500).json({
        success: false,
        message: "Registration failed! Try again later.",
      });
    }
  };  

export const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        })

        if (!user) {
            return res.status(400).json({success: false, message: "Invalid or expired verification code"})
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user : {
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        console.log("error in veryfyEmail", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

//set invalid login credentials incase of user input wrong details
//generate the jwt token and set cookie for login request if credentials are true
//Update the last login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials"});
        }

        generateTokenAndSetCookie(res, user._id);
        user.lastlogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("Error in login", error);
        res.status(400).json({ success: false, message: error.message});
    }
};

//forgot password and reset
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        //find the user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "user not found" })
        }

        //generate reset token and its expiry
        // assign them to our  reset Password variables and save
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        //send paasword reset email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email"});

    } catch (error) {
        console.log("An error occurred. Password reset failed!", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

//Reset Password
export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });


        if(!user){
            return res.status(400).json({success: false, message: "Invalid or expired reset token"});
        }

        //update password
        const hashedPassword = await bcrypt.hash(password, 10);

        //encrypt the password in db
        // delete the reset variables(setting their values to undefine) 
        // save the user in db
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({success: true, message: "Password reset successful"});
    } catch (error) {
        console.log("Error in resetPassword", error);
        res.status(400).json({success: false, message: error.message});
    }
};

//check Auth
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if(!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user: {
            ...user._doc,
            password: undefined
        } });
    } catch (error) {
        console.log("Error in checkAuth", error);
        res.status(400).json({  success: false, message: error.message });
    }
};

//clear out the cookie so that the user is not authenticated
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ sucess: true, message: "Logged out successfully"})
};