-- create database cosmetics_shop

-- ALTER DATABASE cosmetics_shop
-- CHARACTER SET utf8mb4
-- COLLATE utf8mb4_unicode_ci;

-- use cosmetics_shop


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from users


SHOW VARIABLES LIKE 'port';

SELECT USER();