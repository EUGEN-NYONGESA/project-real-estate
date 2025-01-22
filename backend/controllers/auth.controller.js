import bcrypt from 'bcryptjs';
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/email.js';


export const signup = async (req, res) => {
    const {email, password, name} = req.body;

    try {
        if(!email || !password || !name) {
            throw new Error("Fill all the required fields");
        }

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours
        })
        await user.save();

        //jwt and set cookie
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc, //spread the user document
                password: undefined //Keep the password undefined
            },
        });

    } catch (error) {
        res.status(400).json({success: false, message: error.message})
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
        
    } catch (error) {
        
    }
}

//clear out the cookie so that the user is not authenticated
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ sucess: true, message: "Logged out successfully"})
};