import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token

    if(!token) 
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided"})

        //decode the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            if(!decoded) //falsy values
                return res.status(401).json({ success: false, message: "Unauthorized: Invalid token"});

                req.userId = decoded.userId;
                next();
        } catch (error) {
            console.log("Error in verification", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
};