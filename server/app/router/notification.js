const express = require('express');
const router = express.Router();
const notificationController =require('../controller/notification');
router.get('/login',notificationController.login);
// router.post('/get-new-assettoken',notificationController.getNewAssettoken);
// router.post('/logout',notificationController.logout);
module.exports = router;