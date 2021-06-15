-- phpMyAdmin SQL Dump
-- version 4.9.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jun 15, 2021 at 03:10 AM
-- Server version: 5.7.26
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `workout_tracker`
--

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `email`, `full_name`, `username`, `password`, `role`) VALUES
(3, 'kimwoodfield@hotmail.com', 'Kim Woodfield', 'Kwoodfield', '$2b$10$AvTIxhP785W3SHsCs9v2SujQNP4oVVyFr3oBdl1rp/rbFt.01Zbv2', 'Admin'),
(28, 'lachlan@tafe.com', 'Lachlan Stephan', 'Lstephan', '$2b$10$wIxbRU5lMowYGWfK29kzvuOZkh00EDNs.5EXD52MSwP9YFN1Itv7e', 'General'),
(30, 'fiona@tafe.com', 'Fiona Wrigley', 'Fwrigley', '$2b$10$SGCjNxvxWaxtMrrq7u1tmOXpew/5AQhBpLL.ragHgNwCPPIwLli4a', 'General'),
(31, 'marcello@tafe.com', 'Marcello Brocchi', 'Mbrocchi', '$2b$10$7Y1qroLfFkjf86/KEuJwEuqB9OGZEOLy9OfpmzxgTSOM.21HBmIPi', 'General'),
(32, 'matt@tafe.com', 'Matt Tafe', 'MTafe123', '$2b$10$W1Mx.2Uqo599zAx2UsOnO.D5u3PA887HwTHNcKfLVZwLgCEE9EpUC', 'General'),
(33, 'jimmy@tafe.com', 'Jimmy Barnes', 'jbarnes123', '$2b$10$ZKHh30.ZOl0k7wvmaBLW4uwfqqTEMgL29wSm7zznVrGxe3e3CPQDm', 'General'),
(53, 'fmercury@gmail.com', 'Freddy Mercury', 'Fmercury', '$2b$10$oD9ia/BNpxmHZG0hu4sYHOjYith9ovedVN.s/slhFfPPxhhRUjlNa', 'General'),
(54, 'johnperry@tafe.com', 'John Perry', 'Fragspawn', '$2b$10$fDN48H3rtrbi2BOhLWgJQ..udR8pqVdXlbChmrQ9hMPMH..JSA9b.', 'Admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;
