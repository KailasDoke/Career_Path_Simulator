INSERT INTO countries (created_at, updated_at, name, code) VALUES 
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'India', 'IN'),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'United States', 'US');

INSERT INTO institutions (created_at, updated_at, name, country_id, city, type) VALUES
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'IIT Bombay', (SELECT id FROM countries WHERE code = 'IN'), 'Mumbai', 'PUBLIC_UNIVERSITY'),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Stanford University', (SELECT id FROM countries WHERE code = 'US'), 'Stanford', 'PRIVATE_UNIVERSITY');

INSERT INTO programs (created_at, updated_at, name, institution_id, education_level, duration_years) VALUES
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'B.Tech Computer Science', (SELECT id FROM institutions WHERE name = 'IIT Bombay'), 'BACHELORS', 4.0),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'BS Computer Science', (SELECT id FROM institutions WHERE name = 'Stanford University'), 'BACHELORS', 4.0);

INSERT INTO careers (created_at, updated_at, title, domain) VALUES
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Software Engineer', 'IT'),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Data Scientist', 'IT');
