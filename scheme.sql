
CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cosmetics_shop` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `cosmetics_shop`;
SET FOREIGN_KEY_CHECKS = 0;
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`,`productId`),
  KEY `productId` (`productId`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `order_items_ibfk_2` (`productId`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `shippingName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shippingPhone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shippingCity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shippingMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shippingAddress` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `promoCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shippingCost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` text COLLATE utf8mb4_unicode_ci,
  `images` text COLLATE utf8mb4_unicode_ci,
  `specs` text COLLATE utf8mb4_unicode_ci,
  `stock` int DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `categoryId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_products_category` (`categoryId`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `userId` int NULL,
  `authorName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_reviews_product` (`productId`),
  KEY `fk_reviews_user` (`userId`),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migration for databases created before checkout/shipping fields existed on `orders`.
ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `shippingName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `status`;
ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `shippingPhone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `shippingName`;
ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `shippingCity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `shippingPhone`;
ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `shippingMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `shippingCity`;
ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `shippingAddress` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `shippingMethod`;
ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `paymentMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `shippingAddress`;
ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `promoCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `paymentMethod`;
ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `discount` decimal(10,2) NOT NULL DEFAULT '0.00' AFTER `promoCode`;
ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `shippingCost` decimal(10,2) NOT NULL DEFAULT '0.00' AFTER `discount`;

SET FOREIGN_KEY_CHECKS = 1;
