const express = require('express');
const router = express.Router();
const query = require('../db');
const { checkToken, createToken, validation } = require('../favordb');

router.get('/', async (req, res) => {
  try {
    const getUsers = await query(`SELECT * FROM users`);
    return res.status(200).send(getUsers);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post('/register', validation, async (req, res) => {
  const { username, email, password } = req.body;
  const uid = Date.now();
  try {
    const post_data = await query(`
      INSERT INTO 
        users (uid, username, email, password, role, status) 
        VALUES (${uid},'${username}', '${email}', '${password}', 2, 1)
    `);
    const data = await query(`
      SELECT 
        uid,
        username, 
        email 
      FROM users 
      WHERE id = ${post_data.insertId}
    `);
    const encrypt = {
      uid: data[0].uid,
      role: data[0].role,
    };
    const newData = { ...data[0] };
    const token = createToken(encrypt);
    newData.token = token;
    return res.status(200).send(newData);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post('/login', async (req, res) => {
  const { user, password } = req.body;
  let sql;
  const regexEmail = /[\w\-\.]+(@[\w\-]+\.)+[\w\-\.]{2,4}$/;
  if (user.match(regexEmail)) {
    sql = `SELECT * FROM users WHERE email = '${user}' AND password = '${password}' AND status = 1`;
  } else {
    sql = `SELECT * FROM users WHERE username = '${user}' AND password = '${password}' AND status = 1`;
  }
  try {
    const getUser = await query(sql);
    const encrypt = {
      uid: getUser[0].uid,
      role: getUser[0].role,
    };
    const newData = { ...getUser[0] };
    const token = createToken(encrypt);
    newData.token = token;
    return res.status(200).send(newData);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.patch('/deactive', checkToken, async (req, res) => {
  const { uid } = req.user;
  try {
    const getUser = await query(`SELECT * FROM users WHERE uid = ${uid}`);
    const userID = getUser[0].id;
    await query(`UPDATE users SET status = 2 WHERE id = ${userID}`);
    const user = await query(`
      SELECT 
        u.uid, 
        s.status 
      FROM users u 
      JOIN status s ON s.id = u.status 
      WHERE u.id = ${userID}
    `);
    return res.status(200).send(user[0]);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.patch('/active', checkToken, async (req, res) => {
  const { uid } = req.user;
  try {
    const getUser = await query(`SELECT * FROM users WHERE uid = ${uid}`);
    const userID = getUser[0].id;
    await query(`UPDATE users SET status = 1 WHERE id = ${userID}`);
    const user = await query(`
      SELECT 
        u.uid, 
        s.status 
      FROM users u 
      JOIN status s ON s.id = u.status 
      WHERE u.id = ${userID}
    `);
    return res.status(200).send(user[0]);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.patch('/close', checkToken, async (req, res) => {
  const { uid } = req.user;
  try {
    const getUser = await query(`SELECT * FROM users WHERE uid = ${uid}`);
    const userID = getUser[0].id;
    await query(`UPDATE users SET status = 3 WHERE id = ${userID}`);
    const user = await query(`
      SELECT 
        u.uid, 
        s.status 
      FROM users u 
      JOIN status s ON s.id = u.status 
      WHERE u.id = ${userID}
    `);
    return res.status(200).send(user[0]);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
