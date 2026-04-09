const express=require('express');
const app=express();
const auth_router=require("./router/User_Management");

app.use("/api/auth",auth_router);

// app.get('/',(req,res)=>{
//     res.send("Hello World");
//     res.end();
// });

// app.get("/animal",(req,res)=>{
//     res.send("hello animal");
//     res.end();
// });

app.listen(5000,()=>{
    console.log(`listening at port 5000`)
});