-- Run this in your MySQL client to set up the database

CREATE DATABASE IF NOT EXISTS trade;
USE trade;

CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)        NOT NULL,
  email       VARCHAR(150)        UNIQUE NOT NULL,   -- use college email
  password    VARCHAR(255)        NOT NULL,           -- bcrypt hash
  roll_no     VARCHAR(20)         UNIQUE NOT NULL,
  created_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
  reset_token VARCHAR(255),
  reset_token_expiry DATETIME,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS listings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),

    seller_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    status ENUM('available','sold') DEFAULT 'available'

    FOREIGN KEY (seller_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE listing_images (
    id INT AUTO_INCREMENT PRIMARY KEY,

    listing_id INT NOT NULL,

    image_url VARCHAR(500) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (listing_id)
    REFERENCES listings(id)
    ON DELETE CASCADE
);

CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    listing_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (listing_id)
    REFERENCES listings(id)
    ON DELETE CASCADE
);