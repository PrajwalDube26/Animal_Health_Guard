const User=require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register=async(req,res)=>{
    try {
       const {name,email,password,role,phone,location} = req.body;

       const user_by_email = await User.findOne({email});
       if(user_by_email)
       {
            return res.status(400).send({message:"user already exist"});
       }

       const hashed_password = await bcrypt.hash(password,12);

        const register_user=new User({
            name,
            email,
            password:hashed_password,
            role,
            phone,
            location
        });

        const registered_user = await register_user.save();

        const token = jwt.sign({
            id:registered_user._id
            }
            ,process.env.JWT_SECRET
            ,{expiresIn:"7d"}
        );

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"None",
            maxAge:7*24*60*60*1000
        });
        
        res.status(201).send({message:"user register succesfully",token});

    }
    catch (err) {
        res.status(400).send({message:"error occuredin register",error:err});
    }
    
};

const login=async(req,res)=>{
    try {
        const {email,password} = req.body;

        const user_by_email = await User.findOne({email});

        if (!user_by_email) 
        {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user_by_email.password);

        if(isMatch)
        {
            const token = jwt.sign({
                id:user_by_email._id
                }
                ,process.env.JWT_SECRET
                ,{expiresIn:"7d"}
            );

            res.cookie("token",token,{
                httpOnly:true,
                secure:true,
                sameSite:"None",
                maxAge:7*24*60*60*1000
            });

            res.status(200).send({message:"Login Succesfully",token});
        }
        else
        {
            res.status(404).send("User not found");
        }
    }
    catch (err) 
    {
        res.status(400).send({message:"error occured in login",error:err});
    }
    
};


//login required

const user_profile=async(req,res)=>{
    try {
        const id=req.user.id;

        const user_by_id=await User.findById(id).select("-password");

        if(user_by_id)
        {
            res.status(200).send(user_by_id);
        }
        else
        {
            res.status(404).send("User not found");
        }
    }
    catch (error) {
        res.status(400).send(error);
    }

};


//login required

const user_update=async(req,res)=>{
    try {
        const id=req.user.id;
        const {name,role,phone,location} = req.body;

        const user_by_id=await User.findByIdAndUpdate(id,{
            name,
            role,
            phone,
            location
        });

        const updated_user=await User.findById(id).select("-password");

        if(user_by_id)
        {
            res.status(200).send({message:"User updated successfully",updated_user});
        }
        else
        {
            res.status(404).send("User not found");
        }
    }
    catch (error) {
        res.status(400).send(error);
    }

};


module.exports={register,login,user_profile,user_update};