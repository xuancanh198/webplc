const connection = require('../config/config');
const jwt = require('jsonwebtoken');

exports.createUser = (callback,data) => {
    connection.query('INSERT INTO tbl_user SET ?', data, (error, results) => {
        if (error) {
            console.error('Lỗi truy vấn cơ sở dữ liệu: ' + error.stack);
            return callback(error, null);
        }

        return callback(null, results);
    });
};
exports.updateUser = (callback, data, id) => {
    connection.query('UPDATE tbl_user SET ? WHERE id = ?', [data, id], (error, results) => {
        if (error) {
            console.error('Lỗi truy vấn cơ sở dữ liệu: ' + error.stack);
            return callback(error, null);
        }

        return callback(null, results);
    });
};
exports.deleteUser = (callback, id) => {
    connection.query('DELETE FROM tbl_user WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Lỗi truy vấn cơ sở dữ liệu: ' + error.stack);
            return callback(error, null);
        }
        return callback(null, results);
    });
};

exports.checkUsername = (callback, username, id = null,count=false) => {
    let query = 'SELECT * FROM tbl_user WHERE username = ?';
    let queryParams = [username];

    if (id !== null) {
        query += ' AND id <> ?';
        queryParams.push(id);
    }

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('Lỗi truy vấn cơ sở dữ liệu: ' + error.stack);
            return callback(error, null);
        }
        if(count===true){
            return callback(null, results);
        }
        if (results.length > 0) {
            return callback(null, true);
        }
        return callback(null, false);
    });
};

exports.getList = (callback, page = 1, limit = 10, search = null, filter = null) => {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM tbl_user';
    const queryParams = [];
    let whereClauseAdded = false;

    if (search && search.length > 0) {
        query += ' WHERE username LIKE ? OR fullname LIKE ?';
        queryParams.push(`%${search}%`, `%${search}%`);
        whereClauseAdded = true;
    }

    if (filter && filter.length > 0) {
        if (whereClauseAdded) {
            query += ' AND status = ?';
        } else {
            query += ' WHERE status = ?';
        }
        queryParams.push(filter);
    }

    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('Lỗi truy vấn cơ sở dữ liệu: ' + error.stack);
            return callback(error, null);
        }
        return callback(null, results);
    });
};

exports.checkUserByIntro= (callback, token) => {
    let query = 'SELECT * FROM tbl_user WHERE refreshToken = ?';
    let queryParams = [token];

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('Lỗi truy vấn cơ sở dữ liệu: ' + error.stack);
            return callback(error, null);
        }
        if (results.length > 0) {
            return callback(null, results[0]);
        }
        return callback(null, false);
    });
};

exports.getDetailId = (callback, id) => {
    let query = 'SELECT * FROM tbl_user WHERE id = ?';
    let queryParams = [id];

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('Lỗi truy vấn cơ sở dữ liệu: ' + error.stack);
            return callback(error, null);
        }
        if(results){
            return callback(null, results[0]);
        }
        return callback(null, false);
    });
};

exports.getListExcel = (callback) => {

    connection.query('SELECT * FROM tbl_user', (error, results) => {
        if (error) {
            console.error('Lỗi truy vấn cơ sở dữ liệu: ' + error.stack);
            return callback(error, null);
        }
        return callback(null, results);
    });
};