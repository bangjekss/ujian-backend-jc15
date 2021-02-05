const query = require('../db');

const validation = async (req, res, next) => {
  const { username, email, password } = req.body;
  const regexUsername = /[\w\-\.]{6,}$/;
  const regexEmail = /[\w\-\.]+(@[\w\-]+\.)+[\w\-\.]{2,4}$/;
  const regexPassword = /(?=.*[\d])(?=.*[`~!@#$%^&*\(\)\-_]).{6,}/;
  if (username.match(regexUsername) && email.match(regexEmail) && password.match(regexPassword)) {
    const data_username = await query(`SELECT username FROM users WHERE username = '${username}'`);
    const data_email = await query(`SELECT email FROM users WHERE email = '${email}'`);
    if (data_username.length === 0 && data_email.length === 0) {
      next();
    } else {
      return res.status(403).send('username or email already taken');
    }
  } else {
    return res.status(403).send('username or email or password is not valid');
  }
};

module.exports = validation;
