import userinfoauth from "../models/auth.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const signup = async (req, res) => {
    try {
        const { phone,password } = req.body;

        // Check if phone number already exists
        const isPhoneExist = await userinfoauth.findOne({ phone });
        if (isPhoneExist) {
            return res.status(201).json({ status: false, message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with empty userinfoids
        const newUser = new userinfoauth({
            phone,
            password: hashedPassword,
        });

        // Save the new user
        const result = await newUser.save();
        if (result) {
            // Create JWT token
            const token = jwt.sign(
                { id: result._id, phone: result.phone },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION }
            );

            // Set the cookie with the JWT
            res.cookie('sessionid', token, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', // Secure in production
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            // Return success response
            const { password: _, ...userWithoutPassword } = result._doc
            return res.status(200).json({ 
                status: true, 
                message: "User created and signed in successfully", 
                data: userWithoutPassword
            });
        } else {
            return res.status(201).json({ status: false, message: "User creation failed" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
};

const signin = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const user = await userinfoauth.findOne({ phone });
        if (!user) {
            return res.status(201).json({ status: false, message: "Invalid phone number or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(201).json({ status: false, message: "Invalid phone number or password" });
        }
        
        const token = jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        res.cookie('sessionid', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // true if in production, false otherwise
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
        });

        // Exclude the password field from the user object
        const { password: _, ...userWithoutPassword } = user.toObject(); 

        return res.status(200).json({ status: true, message: "Signin successful", data: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.cookie('sessionid', '', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // true if in production, false otherwise
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 0
        });
        return res.status(200).json({ status: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
};

const updateInfoById = async(req,res)=>{
    try {
        const {id} = req.params
        const {amount} = req.body
        if(amount>=50){
            const isExist = await userinfoauth.findById({_id:id})
            if(!isExist){
                return res.status(201).json({ status: false, message: "invalid user" });
            }
            if(amount == 50){
                isExist.spinleft +=5
            }else if(amount == 60){
                isExist.spinleft +=7
            }else if(amount == 70){
                isExist.spinleft +=9
            }else if(amount == 80){
                isExist.spinleft +=11
            }else if(amount == 90){
                isExist.spinleft +=13
            }
            const result = await isExist.save()
            const { password: _, ...userWithoutPassword } = result._doc; 
            return res.status(201).json({ status: true, message: "valid user",data:userWithoutPassword });
        }
    } catch (error) {
        return res.status(201).json({ status: false, message: "invalid user",error:error });
    }
} 
const updatedetailsById = async(req,res)=>{
    try {
        const {id} = req.params
        const {result} = req.body
            const isExist = await userinfoauth.findById({_id:id})
            if(!isExist){
                return res.status(201).json({ status: false, message: "invalid user" });
            }
            isExist.spinleft -=1
            if(isExist.score + result <0){
                isExist.score = 0
            }else{
                isExist.score += result
            }
            const resultback = await isExist.save()
            const { password: _, ...userWithoutPassword } = resultback._doc; 
            return res.status(201).json({ status: true, message: "valid user",data:userWithoutPassword });
    } catch (error) {
        return res.status(201).json({ status: false, message: "invalid user",error:error });
    }
} 
const updateScoressById = async(req,res)=>{
    try {
        const {id} = req.params
        const {scores} = req.body
            const isExist = await userinfoauth.findById({_id:id})
            if(!isExist){
                return res.status(201).json({ status: false, message: "invalid user" });
            }
            isExist.score = scores 
            const resultback = await isExist.save()
            const { password: _, ...userWithoutPassword } = resultback._doc; 
            return res.status(201).json({ status: true, message: "valid user",data:userWithoutPassword });
    } catch (error) {
        return res.status(201).json({ status: false, message: "invalid user",error:error });
    }
} 

export {updateScoressById,updatedetailsById,updateInfoById,signup,signin,logout}