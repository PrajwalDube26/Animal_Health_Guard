const express = require('express');
const cookieparse = require('cookie-parser');
var cors = require('cors')
const app = express();

const user_auth_router = require("./router/User_Management");
const farm_router = require("./router/farm_manage");
const alert_route = require('./router/Alert_manage');
const record_route = require('./router/Record_manage');
const bio_assign_route = require('./router/Bio_assig_manage');
const traning_module_route = require('./router/traning_module_manage');
const user_traning_route = require('./router/User_traning_manage');
const admin_auth_router = require("./router/Admin_Management");
const User_Alert_route = require('./router/User_Alert_manage');
const Farm_Assignment_route = require('./router/Farm_Assignment_manage');

require('dotenv').config();

const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

mongoose.connect(mongoURI)
  .then(() => { console.log("connection succesful to database") })
  .catch((err) => { console.log(err) });

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());              //for JSON data
app.use(express.urlencoded({ extended: true }));  //for form-data / x-www-form-urlencoded
app.use(cookieparse());

app.use("/api/auth", user_auth_router);
app.use("/api/farm", farm_router);
app.use("/api/alert", alert_route);
app.use("/api/record", record_route);
app.use("/api/bio_assig", bio_assign_route);
app.use("/api/traning_module", traning_module_route);
app.use("/api/user_traning", user_traning_route);
app.use("/api/admin", admin_auth_router);
app.use("/api/User_Alert", User_Alert_route);
app.use("/api/Farm_Assignment", Farm_Assignment_route);

app.listen(port, () => {
  console.log(`listening at port ${port}`)
});