const express = require('express');
const router = express.Router();

const {create_alert,get_alert_by_userid,get_alert_by_alertid,delete_alert_by_alertid,update_alert_by_alertid} = require('../controller/alert');
const featchuser = require('../middleware/featchuser');

router.post("/create_alert",featchuser,create_alert);

router.get("/get_alert_by_userid",featchuser,get_alert_by_userid);
router.get("/get_alert_by_alertid/:id",get_alert_by_alertid);

router.delete("/delete_alert_by_alertid/:id",featchuser,delete_alert_by_alertid);
router.put("/update_alert_by_alertid/:id",featchuser,update_alert_by_alertid);

module.exports = router;