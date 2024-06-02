const jwt = require('jsonwebtoken');
const staffModel = require('../model/staffModel');
require('dotenv').config()
exports.getUserIdFromAccessToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const refreshToken = authHeader && authHeader.split(' ')[1];

    if (!refreshToken) {
        return res.status(401).json({ status: 'fail', message: 'AccessToken không tồn tại' });
    }

    try {
        staffModel.checkUserByIntro((error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database query error' });
            }
            if (results) {
                if(results.categoryUser ===1){
                    req.owner = results.id;
                    next();
                }
                else{
                    return res.json({ status: 'fail', message: 'Bạn không có quyền cho hành động này' });
                }
            }else{
                return res.json({ status: 'fail', message: 'Bạn không có quyền cho hành động này' });
            }
        },refreshToken);
        // const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        // req.userId = decoded.id;
        
    } catch (error) {
        return res.status(403).json({ status: 'fail', message: 'AccessToken không hợp lệ' });
    }
};
