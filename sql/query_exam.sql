SELECT * FROM backend_2021.users;

select * from locations;
select * from movie_status;
select * from movies;
select * from roles;
select * from schedules;
select * from show_times;
select * from users;
select * from status;

SELECT 
	u.uid, s.status
FROM users u 
JOIN status s ON s.id = u.status;

select * from movies;
select * from locations;
select * from movie_status;
select * from schedules;
select * from show_times;
SELECT
	m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description, ms.status, l.location, st.time
FROM schedules s
JOIN movies m ON m.id = s.movie_id
JOIN movie_status ms on ms.id = m.status
JOIN locations l ON l.id = s.location_id
JOIN show_times st ON st.id = s.time_id;

select * from schedules order by location_id asc;
select * from locations;
select * from show_times;
SELECT * FROM movies ORDER BY id DESC;

select * from users;
select * from roles;

SELECT
	*
FROM users u
JOIN roles r ON r.id = u.role;

