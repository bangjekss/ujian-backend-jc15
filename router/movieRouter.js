const express = require('express');
const query = require('../db');
const { checkToken } = require('../favordb');
const router = express.Router();

router.get('/get/all', async (req, res) => {
  try {
    const getMovies = await query(`
      SELECT
        m.name, 
        m.release_date, 
        m.release_month, 
        m.release_year, 
        m.duration_min, 
        m.genre, 
        m.description, 
        ms.status, 
        l.location, 
        st.time
      FROM schedules s
      JOIN movies m ON m.id = s.movie_id
      JOIN movie_status ms on ms.id = m.status
      JOIN locations l ON l.id = s.location_id
      JOIN show_times st ON st.id = s.time_id
    `);
    return res.status(200).send(getMovies);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/get', async (req, res) => {
  const { status, location, time } = req.query;
  let sql = `
    SELECT 
      m.name, 
      m.release_date, 
      m.release_month, 
      m.release_year, 
      m.duration_min, 
      m.genre, m.description, 
      ms.status, 
      l.location, 
      st.time 
    FROM schedules s 
    JOIN movies m ON m.id = s.movie_id 
    JOIN movie_status ms on ms.id = m.status 
    JOIN locations l ON l.id = s.location_id 
    JOIN show_times st ON st.id = s.time_id
  `;
  if (Object.keys(req.query).length >= 1) sql += ` WHERE`;
  if (status) sql += ` ms.status = '${status}' ${Object.keys(req.query).length >= 1 ? 'AND' : ''}`;
  if (location)
    sql += ` l.location = '${location}' ${Object.keys(req.query).length >= 1 ? 'AND' : ''}`;
  if (time) sql += ` st.time = '${time}' ${Object.keys(req.query).length >= 1 ? 'AND' : ''}`;
  if (Object.keys(req.query).length >= 1) {
    const index = sql.lastIndexOf('AND');
    const argmA = sql.slice(0, index - 1);
    const argmB = sql.slice(index + 3);
    sql = argmA + argmB;
  }
  try {
    const getMovies = await query(sql);
    return res.status(200).send(getMovies);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post('/add', checkToken, async (req, res) => {
  const {
    name,
    genre,
    release_date,
    release_month,
    release_year,
    duration_min,
    description,
  } = req.body;
  const { role } = req.user;
  if (role === 1) {
    try {
      const addMovie = await query(`
        INSERT INTO 
          movies (name, genre, release_date, release_month, release_year, duration_min, description) 
          VALUES ('${name}', '${genre}', ${release_date}, ${release_month}, ${release_year}, ${duration_min}, '${description}')
      `);
      const movieID = addMovie.insertId;
      const getMovie = await query(`SELECT * FROM movies WHERE id = ${movieID}`);
      return res.status(200).send(getMovie[0]);
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(403).send('not allowed');
  }
});

router.patch('/edit/:id', checkToken, async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const { role } = req.user;
  if (role === 1) {
    try {
      await query(`UPDATE movies SET status = ${status} WHERE id = ${id}`);
      return res.status(200).send({ id, message: 'status has been changed' });
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(403).send('not allowed');
  }
});

router.patch('/set/:id', checkToken, async (req, res) => {
  const movieID = parseInt(req.params.id);
  const { location_id, time_id } = req.body;
  const { role } = req.user;
  if (role === 1) {
    try {
      await query(`
        INSERT INTO 
          schedules (movie_id, location_id, time_id) 
          VALUES (${movieID}, ${location_id}, ${time_id})
      `);
      return res.status(200).send({ id: movieID, message: 'schedule hasa been added' });
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(403).send('not allowed');
  }
});

module.exports = router;
