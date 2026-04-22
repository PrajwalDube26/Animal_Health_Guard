const User=require('../models/User');

const register=async(req,res)=>{
    try {
       const {name,email,password,role,phone,location} = req.body;

        const register_user=new User({
            name,
            email,
            password,
            role,
            phone,
            location
        });

        const saved_user = await register_user.save()
        
        res.status(201).send("user register succesfully",saved_user);

    }
    catch (err) {
        res.status(400).send(err);
    }
    
};

const login=async(req,res)=>{
    try {
        const {name,email,password} = req.body;

        const user_by_email = await User.find(email);

        if(user_by_email.password==password)
        {
            res.status(200).send("Login Succesfully");
        }
        else
        {
            res.status(400).send("password and email missmatch");
        }
    }
    catch (err) 
    {
        res.status(400).send(err);
    }
    
};

const user_profile=async(req,res)=>{
    try {
        const {id}=req.param;

        const user_by_id=await User.findById(id);

        if(user_by_id)
        {
            res.status(200).send(user_by_id);
        }
        else
        {
            res.status(400).send("User not found");
        }
    }
    catch (error) {
        res.status(400).send(error);
    }

    

};

const user_update=async(req,res)=>{
    try {
        const {id}=req.param;
        const {name,role,phone,location} = req.body;

        const user_by_id=await User.findByIdAndUpdate(id,set({
            name,
            role,
            phone,
            location
        }));

        if(user_by_id)
        {
            res.status(200).send(user_by_id);
        }
        else
        {
            res.status(400).send("User not found");
        }
    }
    catch (error) {
        res.status(400).send(error);
    }

};