CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE countries (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE institutions (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    name VARCHAR(255) NOT NULL,
    country_id BIGINT REFERENCES countries(id),
    state_region VARCHAR(255),
    city VARCHAR(255),
    type VARCHAR(255),
    estimated_living_cost_annual NUMERIC(19, 2)
);

CREATE INDEX idx_institution_country ON institutions(country_id);

CREATE TABLE programs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    name VARCHAR(255) NOT NULL,
    institution_id BIGINT NOT NULL REFERENCES institutions(id),
    education_level VARCHAR(255),
    duration_years DOUBLE PRECISION,
    total_tuition NUMERIC(19, 2),
    admission_requirements TEXT
);

CREATE INDEX idx_program_institution ON programs(institution_id);

CREATE TABLE careers (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    title VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    description TEXT
);

CREATE TABLE career_pathways (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    program_id BIGINT NOT NULL REFERENCES programs(id),
    career_id BIGINT NOT NULL REFERENCES careers(id),
    explanation TEXT
);
