import express from "express"
import { logout, signin, signup, updatedetailsById, updateInfoById, updateScoressById } from "../controllers/AuthController.js"
import jwt from "jsonwebtoken"
import authenticate from "../middleware/checkAuth.js"

const router = express.Router()

router.post('/signup',signup)
router.post('/signin',signin)
router.post('/updateInfoById/:id',updateInfoById)
router.post('/updatedetailsById/:id',updatedetailsById)
router.post('/updateScoressById/:id',updateScoressById)
router.post('/logout',authenticate,logout)
router.get('/checkUserAuth',(req,res)=>{
    try {
        const token = req.cookies.sessionid;

        if (!token) {
            return res.status(201).json({status:false,message:'1not a valid user'})
        }
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(201).json({status:false,message:'2not a valid user'})
            }
            
            req.user = decoded;
            return res.status(201).json({status:true,message:'valid user'})
        });
    } catch (error) {
        return res.status(201).json({status:false,message:'3not a valid user'})
    }
})

export default router