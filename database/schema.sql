CREATE DATABASE IF NOT EXISTS moah DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE moah;

CREATE TABLE IF NOT EXISTS account
(
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(128) UNIQUE,
    password   CHAR(64),
    nickname   VARCHAR(32)   NULL     DEFAULT NULL,
    username   VARCHAR(32),
    bio        VARCHAR(1024) NULL     DEFAULT NULL,
    avatar     VARCHAR(10)   NULL     DEFAULT NULL,
    created_at DATETIME,
    flag       TINYINT       NOT NULL DEFAULT 0,
    session    CHAR(36)      NULL     DEFAULT NULL,
    last_login TIMESTAMP     NULL     DEFAULT NULL,
    FULLTEXT KEY (email, nickname, username, bio)
);
