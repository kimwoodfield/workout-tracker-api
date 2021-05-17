-- phpMyAdmin SQL Dump
-- version 4.9.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 17, 2021 at 03:32 AM
-- Server version: 5.7.26
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `workout_tracker`
--

-- --------------------------------------------------------

--
-- Table structure for table `Exercise`
--

CREATE TABLE `Exercise` (
  `id` int(10) UNSIGNED NOT NULL,
  `exercise_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exercise_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Exercise`
--

INSERT INTO `Exercise` (`id`, `exercise_name`, `exercise_type`) VALUES
(203, 'Bench Press', 'Chest'),
(204, 'Incline Press', 'Chest'),
(205, 'Dumbell Flies', 'Chest'),
(206, 'Cable Flies', 'Chest'),
(207, 'Push ups', 'Chest'),
(208, 'Pull ups', 'Back'),
(209, 'Seated Rows', 'Back'),
(210, 'Squats', 'Legs'),
(211, 'Leg Press', 'Legs'),
(212, 'Calf Raises', 'Legs'),
(213, 'Shoulder Press', 'Shoulders'),
(214, 'Hamstring Curl', 'Legs'),
(215, 'Leg Extensions', 'Legs'),
(216, 'Leg Extension', 'Legs'),
(217, 'Dips', 'Arms'),
(218, 'Bodyweight Squats', 'Legs'),
(219, 'Bodyweight Lunges', 'Legs'),
(222, 'Barbell Bicep Curls', 'Arms'),
(223, 'Dumbell Bicep Curls', 'Arms'),
(224, 'Tricep Pushdowns', 'Arms'),
(225, 'Tricep Extensions', 'Arms'),
(226, 'Running', 'Legs'),
(227, 'Bodyweight Calf Raises', 'Legs'),
(228, 'Barbell Rows', 'Back'),
(229, 'Lat Pulldown', 'Back'),
(230, 'Concentration Curls', 'Arms'),
(231, 'Cable Curls', 'Arms');

-- --------------------------------------------------------

--
-- Table structure for table `Routine`
--

CREATE TABLE `Routine` (
  `id` int(10) UNSIGNED NOT NULL,
  `routine_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Routine`
--

INSERT INTO `Routine` (`id`, `routine_name`) VALUES
(76, 'Chest'),
(77, 'Back'),
(78, 'Legs'),
(80, 'Push'),
(81, 'Pull');

-- --------------------------------------------------------

--
-- Table structure for table `RoutineExercise`
--

CREATE TABLE `RoutineExercise` (
  `id` int(10) UNSIGNED NOT NULL,
  `routine_id` int(10) UNSIGNED NOT NULL,
  `exercise_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `RoutineExercise`
--

INSERT INTO `RoutineExercise` (`id`, `routine_id`, `exercise_id`) VALUES
(29, 76, 203),
(30, 76, 204),
(31, 76, 205),
(32, 76, 206),
(33, 76, 207),
(34, 77, 205),
(35, 77, 206),
(36, 77, 208),
(37, 77, 210),
(38, 77, 208),
(39, 78, 210),
(40, 78, 211),
(41, 78, 214),
(42, 78, 215),
(43, 78, 212),
(44, 78, 203),
(45, 78, 204),
(46, 78, 205),
(47, 78, 206),
(48, 78, 207),
(49, 80, 203),
(50, 80, 213),
(51, 80, 224),
(52, 80, 225),
(53, 80, 208),
(54, 81, 228),
(55, 81, 229),
(56, 81, 222),
(57, 81, 222),
(58, 81, 208);

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
(31, 'marcello@tafe.com', 'Marcello Brocchi', 'Mbrocchi', '$2b$10$7Y1qroLfFkjf86/KEuJwEuqB9OGZEOLy9OfpmzxgTSOM.21HBmIPi', 'General');

-- --------------------------------------------------------

--
-- Table structure for table `Workout`
--

CREATE TABLE `Workout` (
  `id` int(10) UNSIGNED NOT NULL,
  `workout_date` datetime NOT NULL,
  `routine_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Workout`
--

INSERT INTO `Workout` (`id`, `workout_date`, `routine_id`, `user_id`) VALUES
(130, '2021-05-04 09:18:32', 76, 3),
(132, '2021-05-10 20:20:39', 80, 3),
(133, '2021-05-10 20:21:20', 81, 3),
(134, '2021-05-10 20:22:06', 81, 3),
(135, '2021-05-10 20:22:28', 77, 3),
(136, '2021-05-15 14:08:32', 76, 3),
(137, '2021-05-15 17:44:12', 76, 3);

-- --------------------------------------------------------

--
-- Table structure for table `WorkoutExercise`
--

CREATE TABLE `WorkoutExercise` (
  `id` int(10) UNSIGNED NOT NULL,
  `workout_id` int(10) UNSIGNED NOT NULL,
  `exercise_id` int(10) UNSIGNED NOT NULL,
  `sets` int(4) NOT NULL,
  `weight` int(6) NOT NULL,
  `reps` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `WorkoutExercise`
--

INSERT INTO `WorkoutExercise` (`id`, `workout_id`, `exercise_id`, `sets`, `weight`, `reps`) VALUES
(82, 130, 203, 4, 100, 36),
(83, 130, 204, 4, 100, 36),
(84, 130, 205, 4, 17, 36),
(85, 130, 206, 4, 21, 36),
(86, 130, 207, 4, 0, 36),
(92, 132, 203, 4, 100, 36),
(93, 132, 213, 4, 40, 36),
(94, 132, 224, 4, 21, 36),
(95, 132, 225, 4, 21, 36),
(96, 132, 208, 4, 0, 36),
(97, 133, 228, 4, 60, 36),
(98, 133, 229, 4, 55, 36),
(99, 133, 222, 4, 12, 36),
(100, 133, 222, 4, 5, 21),
(101, 133, 208, 4, 0, 36),
(102, 134, 228, 4, 60, 36),
(103, 134, 229, 4, 55, 36),
(104, 134, 222, 4, 21, 36),
(105, 134, 222, 4, 12, 36),
(106, 134, 208, 4, 0, 36),
(107, 135, 205, 4, 21, 36),
(108, 135, 206, 4, 21, 36),
(109, 135, 208, 4, 0, 36),
(110, 135, 210, 4, 60, 36),
(111, 135, 208, 4, 0, 36),
(112, 136, 203, 4, 100, 36),
(113, 136, 204, 4, 100, 36),
(114, 136, 205, 4, 21, 36),
(115, 136, 206, 4, 21, 36),
(116, 136, 207, 4, 0, 36),
(117, 137, 203, 4, 100, 36),
(118, 137, 204, 4, 100, 36),
(119, 137, 205, 4, 21, 36),
(120, 137, 206, 4, 21, 36),
(121, 137, 207, 4, 0, 36);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Exercise`
--
ALTER TABLE `Exercise`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Routine`
--
ALTER TABLE `Routine`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `RoutineExercise`
--
ALTER TABLE `RoutineExercise`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_exerciseID` (`exercise_id`),
  ADD KEY `fk_routineID` (`routine_id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Workout`
--
ALTER TABLE `Workout`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_routine_id` (`routine_id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indexes for table `WorkoutExercise`
--
ALTER TABLE `WorkoutExercise`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_workout_id` (`workout_id`),
  ADD KEY `fk_exercise_id` (`exercise_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Exercise`
--
ALTER TABLE `Exercise`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=232;

--
-- AUTO_INCREMENT for table `Routine`
--
ALTER TABLE `Routine`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `RoutineExercise`
--
ALTER TABLE `RoutineExercise`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `Workout`
--
ALTER TABLE `Workout`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

--
-- AUTO_INCREMENT for table `WorkoutExercise`
--
ALTER TABLE `WorkoutExercise`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `RoutineExercise`
--
ALTER TABLE `RoutineExercise`
  ADD CONSTRAINT `fk_exerciseID` FOREIGN KEY (`exercise_id`) REFERENCES `Exercise` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_routineID` FOREIGN KEY (`routine_id`) REFERENCES `Routine` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Workout`
--
ALTER TABLE `Workout`
  ADD CONSTRAINT `fk_routine_id` FOREIGN KEY (`routine_id`) REFERENCES `Routine` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `WorkoutExercise`
--
ALTER TABLE `WorkoutExercise`
  ADD CONSTRAINT `fk_exercise_id` FOREIGN KEY (`exercise_id`) REFERENCES `Exercise` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_workout_id` FOREIGN KEY (`workout_id`) REFERENCES `Workout` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
