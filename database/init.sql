CREATE TABLE IF NOT EXISTS books (
    image_url TEXT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    publish_date TEXT
);

CREATE TABLE IF NOT EXISTS stories (
    title TEXT NOT NULL,
    author TEXT,
    description TEXT,
    pdf_path TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT,
    password TEXT
);

INSERT INTO users (username, password) VALUES ('admin', 'VerySecretPassword');

COPY books
FROM '/docker-entrypoint-initdb.d/books.csv'
DELIMITER ','
CSV HEADER;

