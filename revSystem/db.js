// db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

// 读取环境变量
dotenv.config();

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: root,
    password: 1234,
    database: resvervationsystem,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 获取数据库连接
const getConnection = () => {
    return pool.promise();
};

module.exports = { getConnection };
