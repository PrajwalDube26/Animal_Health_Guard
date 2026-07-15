const express = require('express');
const router = express.Router();

const {create_alert,get_alert_by_adminid,get_alert_by_alertid,delete_alert_by_alertid,update_alert_by_alertid} = require('../controller/alert');
const featchadmin = require('../middleware/featchadmin');

router.post("/create_alert",featchadmin,create_alert);

router.get("/get_alert_by_adminid",featchadmin,get_alert_by_adminid);
router.get("/get_alert_by_alertid/:id",get_alert_by_alertid);

router.delete("/delete_alert_by_alertid/:id",featchadmin,delete_alert_by_alertid);
router.put("/update_alert_by_alertid/:id",featchadmin,update_alert_by_alertid);

module.exports = router;