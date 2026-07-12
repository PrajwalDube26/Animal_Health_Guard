const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isadmin = async(req,res,next)=>{
    try {
        const token = req.cookies.token;

        if(!token)
        {
            return res.status(401).send("Please login");
        }

        const user = jwt.verify(token,process.env.JWT_SECRET);

        const id = user.id;

        const full_user = await User.findById(id);

        if(!full_user)
        {
            return res.status(404).json({message:"user not find"});
        }

        if(full_user.role !== "admin")
        {
            return res.status(403).json({ message:"you are not admin"});
        }

        next();
    } catch (error) {
        return res.status(500).json({ message:"some problem occurred" });
    }
    
};

module.exports = isadmin;