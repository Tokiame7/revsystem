// app.js
const express = require('express');
const bodyParser = require('body-parser');
const { getConnection } = require('./db');
const app = express();

// 中间件
app.use(bodyParser.json());

// 查询预订记录
app.get('/reservations', async (req, res) => {
    const { custName } = req.query;

    try {
        const [rows] = await getConnection().execute(
            'SELECT * FROM RESERVATIONS WHERE custName = ?',
            [custName]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('数据库查询失败');
    }
});

// 插入预订记录
app.post('/reservations', async (req, res) => {
    const { custName, resvType, resvKey } = req.body;

    try {
        // 检查客户是否存在
        const [customerCount] = await getConnection().execute(
            'SELECT COUNT(*) FROM CUSTOMERS WHERE custName = ?',
            [custName]
        );

        if (customerCount[0]['COUNT(*)'] === 0) {
            return res.status(400).send('客户不存在');
        }

        // 插入预订记录
        const [result] = await getConnection().execute(
            'INSERT INTO RESERVATIONS (custName, resvType, resvKey) VALUES (?, ?, ?)',
            [custName, resvType, resvKey]
        );
        res.status(201).send('预订插入成功');
    } catch (err) {
        console.error(err);
        res.status(500).send('数据库插入失败');
    }
});

// 更新预订记录
app.put('/reservations', async (req, res) => {
    const { custName, newResvType, newResvKey } = req.body;

    try {
        // 检查预订编号是否已存在
        const [count] = await getConnection().execute(
            'SELECT COUNT(*) FROM RESERVATIONS WHERE resvKey = ?',
            [newResvKey]
        );

        if (count[0]['COUNT(*)'] > 0) {
            return res.status(400).send('新的预订编号已存在');
        }

        // 更新预订记录
        const [result] = await getConnection().execute(
            'UPDATE RESERVATIONS SET resvType = ?, resvKey = ? WHERE custName = ?',
            [newResvType, newResvKey, custName]
        );
        res.send('预订更新成功');
    } catch (err) {
        console.error(err);
        res.status(500).send('数据库更新失败');
    }
});

// 删除预订记录
app.delete('/reservations', async (req, res) => {
    const { resvKey } = req.body;

    try {
        const [result] = await getConnection().execute(
            'DELETE FROM RESERVATIONS WHERE resvKey = ?',
            [resvKey]
        );
        res.send('预订删除成功');
    } catch (err) {
        console.error(err);
        res.status(500).send('数据库删除失败');
    }
});

// 查询客户的完整预订信息
app.get('/detailed-travel-info', async (req, res) => {
    const { custName } = req.query;

    const query = `
        SELECT R.custName AS Customer, 
               GROUP_CONCAT(
                   CASE 
                       WHEN R.resvType = 1 THEN CONCAT('Flight: ', F.FromCity, ' -> ', F.ArivCity, ' (', F.flightNum, ')')
                       WHEN R.resvType = 2 THEN CONCAT('Hotel: ', H.location, ' (', H.price, ')')
                       WHEN R.resvType = 3 THEN CONCAT('Bus: ', B.location, ' (', B.price, ')')
                   END ORDER BY R.resvType SEPARATOR ' | ') AS TravelRoute
        FROM RESERVATIONS R
        LEFT JOIN FLIGHTS F ON R.resvType = 1 AND SUBSTRING(R.resvKey, 1, 5) = F.flightNum
        LEFT JOIN HOTELS H ON R.resvType = 2 AND R.resvKey LIKE CONCAT('H-', H.location, '-%')
        LEFT JOIN BUS B ON R.resvType = 3 AND R.resvKey LIKE CONCAT('B-', B.location, '-%')
        WHERE R.custName = ?
        GROUP BY R.custName
    `;

    try {
        const [rows] = await getConnection().execute(query, [custName]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('数据库查询失败');
    }
});

// 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
