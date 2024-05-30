const notificationModel = require('../model/notificationModel');
const moment = require('moment');
const currentTime = moment();

exports.getList = (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        let search = req.query.search || null;
        let startFilter = req.query.startFitler || null;
        let endilter = req.query.endFitler || null;
        if(search !== null){
            search = moment(search, 'YYYY-MM-DD').format('YYYY-MM-DD');
        }
        if(startFilter !== null && endilter !== null){
            if(startFilter>endilter){
                return res.json({ status: "fail", mess: "Thời gian bắt đầu không được lớn hơn thời gian kết thúc" });
            }
            startFilter = moment(startFilter, 'YYYY-MM-DD').startOf('day').add(1, 'second').format('YYYY-MM-DD HH:mm:ss');
            endilter = moment(endilter, 'YYYY-MM-DD').endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }
        notificationModel.getList((error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database query error' });
            }
            if (results) {
          
                notificationModel.countList((error, resultsCount) => {
                    if (error) {
                        return res.status(500).json({ error: 'Database query error' });
                    }
                    if (results) {
                        return res.json({
                            status: "success",
                            results: results,
                            totalItems:resultsCount
                        })
        
                    }
                }, page, limit, search, startFilter,endilter)
            }
        }, page, limit, search,startFilter,endilter)
    } catch (error) {
        return res.json({ status: "fail", mess: "có lỗi xảy ra" });
    }
}
