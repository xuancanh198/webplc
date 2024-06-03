const staffModel = require('../model/staffModel');
const bcrypt = require('bcryptjs');
require('dotenv').config()
const jwt = require('jsonwebtoken');

exports.getList = (req, res) => {
    try {
       
        const page = Number(req.query.page)||1;
        const limit = Number(req.query.limit)||10;
        const search = req.query.search||null;
        const fitler = req.query.fitler||null;
       staffModel.getList((error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database query error' });
            }
            if (results) {
                const arr=results.map((item,index)=>{
                    let categoryNameUser;
                    if(item.categoryUser===1){
                        categoryNameUser="Quản trị viên";
                    }
                    else if(item.categoryUser===2){
                        categoryNameUser="Nhân viên";
                    }
                    else if(item.categoryUser===3){
                        categoryNameUser="Nhân viên tạm thời";
                    }
                    return {
                        id: item.id,
                        username: item.username,
                        fullname: item.fullname,
                        img: item.img,
                        note: item.note,
                        address: item.address,
                        status: item.status,
                        categoryUser:categoryNameUser,
                    };
                })
                return res.json({
                    status: "success",
                    results:arr,
                })
    
            }
        },page,limit,search,fitler)
    } catch (error) { 
        return res.json({ status: "fail", mess: "có lỗi xảy ra" });
    }
}

exports.createAcction = (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const fullname = req.body.fullname;
        const role = req.body.role;
        const img = req.body.img??" ";
        const address = req.body.address;
        const note = req.body.note;
        const dataUser = {
            username: username,
            password:bcrypt.hashSync(password, 10),
            fullname: fullname,
            img: img,
            categoryUser: role,
            note: note,
            address: address,
            status: 1
        }
        staffModel.checkUsername((error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database query error' });
            }
            if (results) {
                return res.json({
                    status: "fail",
                    mess: "Tên đăng nhập này đã có vui lòng nhập 1 tên khác",
                })
    
            }

            staffModel.createUser((error, resultsUser) => {
                if (error) {
                    return res.status(500).json({ error: 'Database query error' });
                }
                if(resultsUser){
                    return res.json({
                        status: "success",
                        mess: "Thêm thành công",
                    })
        
                }

            },dataUser)
           
        },username)
      

    } catch (error) {
        return res.json({ status: "fail", mess: "có lỗi xảy ra" });
    }
}
exports.updateAcction = (req, res) => {
    try {
        const id = req.params.id;
        const owner = req.owner;
        const fullname = req.body.fullname;
        // const role = req.body.role;
        const address = req.body.address;
        const note = req.body.note;
        const status = req.body.status;
        console.log(status)
        let dataUser= null;
        if([0, 1].includes(status)){
             dataUser = {
                status: status,
            }
        }else{
              dataUser = {
                fullname: fullname,
                // categoryUser: role,
                note: note,
                address: address,
            }
        }
       
        staffModel.getDetailId((error, resultsId) => {
            if (error) {
                return res.status(500).json({ error: 'Database query error' });
            }
            staffModel.getDetailId((error, resultsowner) => {
                if (error) {
                    return res.status(500).json({ error: 'Database query error' });
                }
                if(resultsowner.id !== 1){
                    if(resultsId.categoryUser === 1) {
                        return res.json({
                            status: "fail",
                            mess: "Bạn không có quyền cập nhật tài khoản này",
                        })
                    }
                }
               staffModel.updateUser((error, resultsUser) => {
                    if (error) {
                        return res.status(500).json({ error: 'Database query error' });
                    }
                    if(resultsUser){
                        return res.json({
                            status: "success",
                            mess: status ? (status === 1 ? "khóa người dùng thành công " :" Mở khóa người dùng thành công" ):"Cập nhật thành công",
                        })
            
                    }
        
                },dataUser,id)
               
        
            },owner)
        },id)
      
    } catch (error) {
        return res.json({ status: "fail", mess: "có lỗi xảy ra" });
    }
}
exports.deleteAcction = (req, res) => {
    try {
        const id = req.params.id;
        const owner = req.owner;
        staffModel.getDetailId((error, resultsId) => {
            if (error) {
                return res.status(500).json({ error: 'Database query error' });
            }
            staffModel.getDetailId((error, resultsowner) => {
                if (error) {
                    return res.status(500).json({ error: 'Database query error' });
                }
                if(resultsowner.id !== 1){
                    if(resultsId.categoryUser === 1) {
                        return res.json({
                            status: "fail",
                            mess: "Bạn không có quyền xóa tài khoản này",
                        })
                    }
                    staffModel.deleteUser((error, resultsUser) => {
                        if (error) {
                            return res.status(500).json({ error: 'Database query error' });
                        }
                        return res.json({
                            status:resultsUser? "success":"fail",
                            mess: resultsUser?"Xóa thành công":"Xóa thất bại",
                        })
                    },id)
                }
                return res.json({
                    status: "fail",
                    mess: "Tài khoản này không thể xóa xin vui lòng thử lại",
                })
              
            },owner)
        },id)

          
   } catch (error) {
        return res.json({ status: "fail", mess: "có lỗi xảy ra" });
    }
}
exports.login = (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        // Kiểm tra tên người dùng và xử lý kết quả
        staffModel.checkUsername((error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database query error' });
            }
            if (results.length >0) {
                bcrypt.compare(password, results[0].password, (err, isMatch) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database query error' });
                    }
                    // Kiểm tra mật khẩu
                    if (isMatch) {
                        const accessToken = generateAccessToken({ id: results.id });
                        const refreshToken = generateRefreshToken({ id: results.id });
                        const datarefreshToken ={
                            refreshToken: refreshToken
                        }
                        staffModel.updateUser((error, results) => {
                            if (error) {
                                return res.status(500).json({ error: 'Database query error' });
                            }
                            
                            return res.json({
                                status:"success",
                                mess:"Đăng nhập thành công",
                                accessToken: accessToken,
                                refreshToken:   refreshToken
                            });
                        },datarefreshToken,results[0].id)
                    } else {
                        return res.json({ 
                            status:"fail",
                            mess:"Sai mật khẩu"
                         });
                    }
                });
            } else {
                return res.json({ 
                    status:"fail",
                    mess:"Không tìm thấy tài khoản"
                 });
            }
        }, username,null,true);
    } catch (error) {
        return res.json({ 
            status:"fail",
            mess:"Có lỗi xảy ra"
         });
    }
}

exports.getNewAssettoken=(req,res)=>{
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.json({ 
                status:"fail",
                mess:"refreshToken không hợp lệ hoặc không tồn tại"
             });
        }
        jwt.verify(refreshToken, 'refreshTokenSecret', (err, decoded) => {
            if (err) {
                return res.json({ 
                    status: "fail",
                    mess: "refreshToken không hợp lệ"
                });
            }
            const userId = decoded.id;
            const accessToken = generateAccessToken({ id: results.id });
            return res.json({ 
                status: "success",
                mess: "Lấy ra user_id từ refreshToken thành công",
                accessToken: accessToken
            });
        });
    } catch (error) {
        return res.json({ 
            status:"fail",
            mess:"Có lỗi xảy ra"
         });
    }
}

exports.logout=(req,res)=>{
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.json({ 
                status:"fail",
                mess:"Có lỗi xảy ra"
             });
        }
        const datarefreshToken ={
            refreshToken: null
        }
      
        staffModel.checkUserByIntro((error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database query error' });
            }
            if (results) {
                staffModel.updateUser((error, results) => {
                    if (error) {
                        return res.status(500).json({ error: 'Database query error' });
                    }
                    
                    return res.json({
                        status:"success",
                        mess:"Đăng xuất thành công",
                    });
                },datarefreshToken,results.id)
            }
        },refreshToken);
    } catch (error) {
        return res.json({ 
            status:"fail",
            mess:"Có lỗi xảy ra"
         });
    }
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}