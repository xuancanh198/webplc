const express = require('express');
const router = express.Router();
const { getUserIdFromAccessToken } = require('../middleware/checkPessmistion');
const staffController = require('../controller/staff');

router.get('/', getUserIdFromAccessToken, staffController.getList);
router.post('/create',getUserIdFromAccessToken,staffController.createAcction);
router.put('/update/:id',getUserIdFromAccessToken,staffController.updateAcction);
module.exports = router;