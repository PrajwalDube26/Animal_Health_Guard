const jwt = require('jsonwebtoken');

const featchadmin = async(req,res,next)=>{
    try
    {
        const admin_token = req.cookies.admin_token;

        if(!admin_token)
        {
            return res.status(400).send("Please login");
        }

        const data = jwt.verify(admin_token,process.env.JWT_SECRET);
        req.admin = data;

        next();
    }
    catch(error)
    {
        res.status(400).send({message:"some problem occure"});
    }
}

module.exports = featchadmin;