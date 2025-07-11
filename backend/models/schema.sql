-- This script defines the database schema for the rating project.
-- Execute this in your MySQL database to create the tables.

-- Table for Normal Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `address` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table for Admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `address` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table for Store Owners
CREATE TABLE IF NOT EXISTS `owners` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `address` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table for Stores (links to owners table)
CREATE TABLE IF NOT EXISTS `stores` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `address` TEXT,
  `owner_id` VARCHAR(36),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`owner_id`) REFERENCES `owners`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Table for Ratings (links to users table)
CREATE TABLE IF NOT EXISTS `ratings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `user_id` VARCHAR(36) NOT NULL,
  `store_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `user_store_unique` (`user_id`, `store_id`)
) ENGINE=InnoDB;

-- Optional: Create a default admin user.
INSERT INTO `admins` (`id`, `name`, `email`, `password_hash`)
VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Admin User', 'admin@example.com', '$2a$10$gCLi7T7D44pM.zFCa0DRPeiA4VogH2GwsOq2./IZ2s3jA4s1b2.om')
ON DUPLICATE KEY UPDATE `name` = `name`;
