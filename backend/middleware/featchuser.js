const jwt = require('jsonwebtoken');

const featchuser = async(req,res,next)=>{
    try
    {
        const token = req.cookies.token;

        if(!token)
        {
            return res.status(400).send("Please login");
        }

        const data = jwt.verify(token,process.env.JWT_SECRET);
        req.user = data;

        next();
    }
    catch(error)
    {
        res.status(400).send({message:"some problem occure"});
    }
}

module.exports = featchuser;