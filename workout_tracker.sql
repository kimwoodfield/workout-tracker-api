-- phpMyAdmin SQL Dump
-- version 4.9.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 18, 2021 at 07:54 AM
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

-- --------------------------------------------------------

--
-- Table structure for table `Routine`
--

CREATE TABLE `Routine` (
  `id` int(10) UNSIGNED NOT NULL,
  `routine_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `RoutineExercise`
--

CREATE TABLE `RoutineExercise` (
  `id` int(10) UNSIGNED NOT NULL,
  `routine_id` int(10) UNSIGNED NOT NULL,
  `exercise_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Routine`
--
ALTER TABLE `Routine`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `RoutineExercise`
--
ALTER TABLE `RoutineExercise`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Workout`
--
ALTER TABLE `Workout`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `WorkoutExercise`
--
ALTER TABLE `WorkoutExercise`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

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