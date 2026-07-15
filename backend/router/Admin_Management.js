const express=require('express');
const router=express.Router();

const {register,login,admin_profile,admin_update,logout} = require('../controller/admin')
const featchadmin = require('../middleware/featchadmin');


router.post('/Signup',register);
router.post('/Login',login);

router.get("/getadmin",featchadmin,admin_profile);
router.put("/edit_admin",featchadmin,admin_update);

router.post("/logout",featchadmin,logout);

module.exports=router;