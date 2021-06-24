const mysql = require('mysql2');
const dbConfig = require('config').get('db.mysql');

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

module.exports = {
    execute(query, params) {
        return new Promise(async (resolve, reject) => {
            try {
                const [rows] = await promisePool.query(query, params);
                resolve(rows);
            } catch (error) {
                reject(error);
            }
        });
    }
};