-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 28, 2026 at 12:38 AM
-- Server version: 8.0.46-cll-lve
-- PHP Version: 8.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nativese_pikachu`
--

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id_history` int NOT NULL,
  `keys_id` varchar(33) DEFAULT NULL,
  `user_do` varchar(33) DEFAULT NULL,
  `info` mediumtext NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id_history`, `keys_id`, `user_do`, `info`, `created_at`, `updated_at`) VALUES
(1, '10', 'nativepro', 'PUGB|Hg9I2|1|1', '2026-03-01 18:42:48', '2026-03-01 18:42:48'),
(2, '20', 'nativepro', 'PUGB|xQfdz|1|1', '2026-03-05 19:59:50', '2026-03-05 19:59:50'),
(3, '21', 'nativepro', 'PUGB|DFPjC|60|2', '2026-03-27 13:20:59', '2026-03-27 13:20:59'),
(4, '31', 'nativepro', 'PUGB|dDghx|1|1', '2026-03-28 16:44:11', '2026-03-28 16:44:11'),
(5, '56', 'nativepro', 'PUGB|J6DSW|1|1', '2026-04-04 19:08:58', '2026-04-04 19:08:58'),
(6, '81', 'nativepro', 'PUGB|pxeVX|1|1', '2026-07-08 18:28:48', '2026-07-08 18:28:48');

-- --------------------------------------------------------

--
-- Table structure for table `keys_code`
--

CREATE TABLE `keys_code` (
  `id_keys` int NOT NULL,
  `game` varchar(32) NOT NULL,
  `user_key` varchar(32) DEFAULT NULL,
  `user_pass` varchar(32) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `expired_date` datetime DEFAULT NULL,
  `max_devices` int DEFAULT NULL,
  `devices` mediumtext,
  `status` tinyint(1) DEFAULT '1',
  `registrator` varchar(32) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `keys_code`
--

INSERT INTO `keys_code` (`id_keys`, `game`, `user_key`, `user_pass`, `duration`, `expired_date`, `max_devices`, `devices`, `status`, `registrator`, `created_at`, `updated_at`) VALUES
(1, 'PUGB', 'GBKeyNative', NULL, 360, '2027-02-24 19:00:28', 10, NULL, 1, 'nativepro', '2026-03-01 18:42:48', '2026-04-15 17:02:44'),
(2, 'PUGB', 'AchenkGanteng', NULL, 30, '2026-08-13 11:01:54', 2, '4b47cb50-fe62-388d-9ebf-7e83bcf76473', 1, 'nativepro', '2026-03-01 18:42:48', '2026-07-14 11:01:54'),
(3, 'PUGB', '5onfOJC0NAdElrjVMqsZ', NULL, 45, '2026-04-15 20:01:23', 1, 'da1033b4-e7b6-3ece-825c-20fda8006757', 1, 'nativepro', '2026-03-01 18:42:48', '2026-03-01 20:01:23'),
(4, 'PUGB', 'zvxueQAFo7qwfZsUYaMn', NULL, 15, '2026-03-17 00:08:08', 1, '3b6e2f1d-78fc-3d87-aff7-18f1f9e2af6f', 1, 'nativepro', '2026-03-01 18:42:48', '2026-03-04 22:13:49'),
(5, 'PUGB', 'MaOS8LwFPTWsbpYqnrD9', NULL, 15, NULL, 1, NULL, 1, 'nativepro', '2026-03-01 18:42:48', '2026-03-01 18:50:54'),
(6, 'PUGB', 'GhbXkU5EpuDo1NyxrRq3', NULL, 30, '2026-06-20 20:59:33', 2, '076bf201-df67-3191-81c2-36e8a494a983,895b78f2-74af-3a41-8980-f739528d0492', 1, 'nativepro', '2026-03-01 18:42:48', '2026-05-22 19:40:43'),
(7, 'PUGB', 'wF3pz1vd2IMVY7sRrSlh', NULL, 7, '2026-03-08 18:58:53', 1, 'cc389e0e-93f0-3cd7-bbd6-f9e387f7eacd', 1, 'nativepro', '2026-03-01 18:42:48', '2026-03-01 18:58:53'),
(8, 'PUGB', 'KshHdtz8j9qfL14RnBrF', NULL, 1, '2026-03-05 05:27:41', 1, 'd61f1f0c-9ec9-3f98-8c7c-f3aca8be2f31', 1, 'nativepro', '2026-03-01 18:42:48', '2026-03-04 05:27:41'),
(9, 'PUGB', 'sCpa7cfLjwQNuPlkd0UV', NULL, 1, '2026-03-09 13:08:37', 1, '93ef6168-086a-3665-832c-f32abc3affc9', 1, 'nativepro', '2026-03-01 18:42:48', '2026-03-08 13:08:37'),
(10, 'PUGB', '1N0f2Ja3j7L45unxpoBH', NULL, 1, '2026-03-06 02:36:28', 1, '3c7ce033-cb38-34e3-84f0-69ec48d29e71', 1, 'nativepro', '2026-03-01 18:42:48', '2026-03-05 02:36:28'),
(11, 'PUGB', 'xQfdzw4tqLMrhsD80uP3', NULL, 1, '2026-03-09 20:50:10', 1, '7a75cbfd-897d-3bbe-9131-3596ee68792a', 1, 'nativepro', '2026-03-05 19:59:49', '2026-03-08 20:50:10'),
(13, 'PUGB', 'w5ISc4lJZYrankm2uzL0', NULL, 40, '2026-04-27 22:56:47', 2, '1a3ee7f1-468f-3b78-935e-65de42b22f59,72513376-6220-3617-800c-b7abf9dd22d3', 1, 'nativepro', '2026-03-05 19:59:50', '2026-03-26 11:49:42'),
(14, 'PUGB', 'F2fS7cENk4i8CnxaQsL0', NULL, 7, '2026-03-26 21:36:47', 2, '171e446b-a8e4-3fa1-8562-78bab0bdbb2a', 1, 'nativepro', '2026-03-05 19:59:50', '2026-03-19 21:36:47'),
(15, 'PUGB', 'uJarxVUhtopzBWg0iEMq', NULL, 1, '2026-03-28 09:34:43', 1, 'a6b1d4e6-1f41-3978-8aec-347d02c8f304', 1, 'nativepro', '2026-03-05 19:59:50', '2026-03-27 09:34:43'),
(16, 'PUGB', 'UmnCrGdL4uh3P08EBtTc', NULL, 1, '2026-03-19 09:21:51', 1, '05e3ad2e-3841-3c26-bbf8-f1bed4cbd780', 1, 'nativepro', '2026-03-05 19:59:50', '2026-03-18 09:21:51'),
(18, 'PUGB', '5zecUoKTjhEiGL3QVBIC', NULL, 30, '2026-04-11 19:49:29', 3, '26541d69-f022-3ee2-92c5-e1cbadaabdc4', 1, 'nativepro', '2026-03-05 19:59:50', '2026-03-12 19:49:29'),
(19, 'PUGB', 'NewUpdate7Day', NULL, 7, '2026-03-19 02:05:05', 100, '819f263d-ddf1-35fb-9564-4b3ec6ab3af4,d3963e23-f530-356e-bdbb-5da77c04e670,cd6b5422-a103-3926-bc76-ef0c21c17a25,100a8161-240f-315f-a2cb-63b2c9a8ecf8,66d338c3-d843-3910-ba49-51d42dd8e342,92fa2e8a-6ac2-3b19-aef3-f2cf2f683b49,776ce1b6-814a-3270-b1ee-279979828ec3,22747518-6293-3f06-8f9e-991e0930a09e,b0d4e2cc-45dc-38fc-84cc-4f347d18b860,9c116d65-fe7f-33b9-bbd5-93d879bf5df9,2e7229e6-4a47-3ce9-b8bb-080742f3a255,efcd38b2-ca2d-3a3d-9b04-4fe440e01cbf,9777c287-d0c3-31d5-a5e1-3872e8452e1d', 1, 'nativepro', '2026-03-05 19:59:50', '2026-03-16 21:37:16'),
(20, 'PUGB', 'Gn8yqJMmpkFRZ526LETD', NULL, 30, '2026-04-04 20:14:29', 1, 'f895e8ae-830e-3c75-939c-a91b2b752b4a', 1, 'nativepro', '2026-03-05 19:59:50', '2026-03-05 20:14:29'),
(21, 'PUGB', 'DFPjCUELlWTyh1w5Q80i', NULL, 60, '2026-05-27 16:58:33', 2, 'b5b0ec25-f858-31a0-8b8b-5e7c3fb9e4be,14661f52-d460-3275-bf7a-5c49220e56f7', 1, 'nativepro', '2026-03-27 13:20:59', '2026-05-13 22:53:05'),
(22, 'PUGB', 'dDghxmes6aIfnirEJ1UA', NULL, 1, '2026-03-29 17:07:58', 1, '82609ed3-0f66-3fb6-bdb2-048b327c7c15', 1, 'nativepro', '2026-03-28 16:44:10', '2026-03-28 17:51:01'),
(23, 'PUGB', 'OVmy3clwsx0WS8QH1hFf', NULL, 20, '2026-04-18 22:36:32', 2, '69eb09c6-d7f8-3b21-9c91-04c95d31ce1f', 1, 'nativepro', '2026-03-28 16:44:10', '2026-03-29 22:36:32'),
(24, 'PUGB', 'qV6MF39jx41sXmiezQDp', NULL, 1, '2026-04-02 09:14:26', 1, 'e25fbee7-9332-3800-a504-abe8d29982fe', 1, 'nativepro', '2026-03-28 16:44:10', '2026-04-01 09:14:26'),
(25, 'PUGB', 'k2sZU7wFQr9MvXf4BI0R', NULL, 1, '2026-04-05 06:23:48', 1, 'd6f915cd-5ab8-3b1a-bf85-39d632ae6d02', 1, 'nativepro', '2026-03-28 16:44:10', '2026-04-04 06:23:48'),
(26, 'PUGB', 'w3tGAQSsOdFrRboiENXm', NULL, 38, '2026-05-12 15:04:12', 2, NULL, 1, 'nativepro', '2026-03-28 16:44:10', '2026-06-12 22:20:19'),
(28, 'PUGB', '3FKApyc40kfM5mas8Tnq', NULL, 2, '2026-04-07 09:39:09', 1, '0143d51d-58d0-3a00-bb42-bd52b59ddf81', 1, 'nativepro', '2026-03-28 16:44:10', '2026-04-05 09:39:09'),
(29, 'PUGB', 'eg1LkzpSHYjnxa3uJsEV', NULL, 1, '2026-04-08 12:34:50', 1, 'd27deee8-9702-31bf-b5e9-256e069520d3', 1, 'nativepro', '2026-03-28 16:44:10', '2026-04-07 12:34:50'),
(30, 'PUGB', 'i1Gm5B8NzlwP4YWQbfAa', NULL, 30, '2026-05-07 19:25:02', 2, '1db78bb2-d5f3-3e01-b145-2e02c2c27937', 1, 'nativepro', '2026-03-28 16:44:10', '2026-04-07 19:25:02'),
(32, 'PUGB', 'J6DSWgQwdLrcKlFGoEsZ', NULL, 3, '2026-04-15 13:17:46', 1, '3c9aa7f6-75b5-3288-99bf-0ad8e43b024e', 1, 'nativepro', '2026-04-04 19:08:58', '2026-04-12 14:21:48'),
(33, 'PUGB', 'VKyHxsF4JhACBX9Ud8vT', NULL, 1, '2026-04-13 20:30:47', 1, 'ec486016-e16e-355e-982e-6ddc2e6b4450', 1, 'nativepro', '2026-04-04 19:08:58', '2026-04-12 20:30:47'),
(34, 'PUGB', 'J6ylRrVgZTYKoqDSMPfW', NULL, 1, '2026-04-16 15:14:51', 1, '48a945d0-3a1c-34a0-977a-689ce51ee03d', 1, 'nativepro', '2026-04-04 19:08:58', '2026-04-15 16:44:05'),
(35, 'PUGB', 'HJhcU3tjQFAYv2BPxGEp', NULL, 1, '2026-04-16 17:21:01', 1, 'e8f63339-eeb7-3741-9d41-da2aace5ad9e', 1, 'nativepro', '2026-04-04 19:08:58', '2026-04-15 17:21:01'),
(36, 'PUGB', 'LIeKfytuvpQcq1xOdj6G', NULL, 1, '2026-04-16 18:13:08', 1, '199fbd83-4700-36da-8710-b1a9ad15fd41', 1, 'nativepro', '2026-04-04 19:08:58', '2026-04-15 18:13:08'),
(37, 'PUGB', 'nrQ2eKylwNA7uUsdDSMO', NULL, 30, '2026-05-15 19:25:26', 2, '0e5bfd8d-f035-3b72-ade0-fb98c0a47e10,088da15d-7f0a-3908-88a4-775caa5d5c20', 1, 'nativepro', '2026-04-04 19:08:58', '2026-05-13 18:34:51'),
(39, 'PUGB', '9rhRDn3Iyf5NeP6KWgcZ', NULL, 30, '2026-05-21 23:13:32', 2, '79eba631-0d12-308e-9f16-fb06b624e178', 1, 'nativepro', '2026-04-04 19:08:58', '2026-04-21 23:13:32'),
(40, 'PUGB', 'YDtuxgVPpWIqNeAomE5y', NULL, 22, '2026-05-16 17:18:18', 2, '948e67e2-d3ef-39b8-a4ce-28d7713d9cbc,ad0a4cd9-303f-3945-878a-11a20de664df', 1, 'nativepro', '2026-04-04 19:08:58', '2026-04-24 22:51:41'),
(41, 'PUGB', 'mzqhMFlUcXjxRrbJyNdf', NULL, 1, '2026-04-30 12:04:53', 1, '6bc0f302-537f-3f1f-abf9-5ace4d2c58a5', 1, 'nativepro', '2026-04-04 19:08:58', '2026-04-29 12:04:53'),
(42, 'PUGB', 'Trial7Day', NULL, 7, '2026-05-07 01:00:09', 100, 'e259dbf1-a169-3b73-b8fe-77d3821ab89a,9702759a-ffee-3b7e-878c-261db54d99cd,934611d8-c1d3-36e8-851d-535d1b3f93be,f339eb48-9431-3276-a19e-effef1a8af99,c75862b4-4448-3895-8c4c-c8c51cdd4ce3,a78680fc-0e96-3a05-82f5-30322b87ee78,d5b82df3-bfe4-36b1-aaec-d96b7434aaaa,048f5780-b16b-325e-8232-bbe26ea7eb53,f7ef0477-8fa0-3303-8dd9-bc558ad87b0e,c6cc97a2-8dc5-371d-ad3c-2ef34764d598', 1, 'nativepro', '2026-04-04 19:08:58', '2026-05-02 14:16:46'),
(44, 'PUGB', '1O9m4nYiFEA3pHP0oU27', NULL, 3, '2026-05-13 14:35:11', 1, 'fe992eef-b48d-3541-ad9a-394687457aba', 1, 'nativepro', '2026-04-04 19:08:58', '2026-05-10 14:35:11'),
(45, 'PUGB', 'AcxFreeKey', NULL, 30, '2026-06-10 23:13:08', 200, '869af433-fa08-3ad2-9023-2b35da526a3b,e851c037-e09e-3062-bc07-390ae0fd629d,3f5d0205-6d59-32b5-a741-88fd22a87d1a,82878d49-1791-3627-8572-0f7d54447857,a0308c9f-da23-306d-849a-639f03b71aa8,27dec012-42d7-334b-9e78-3d31878d0c54,4fc026fc-15cd-3959-88e8-29c9fc287052,f17cd675-9a41-31be-b3ce-55bd2c3b778d,bb108267-f00f-32a2-abae-904bf82225b4,fcd25801-2c5e-3b51-ab66-9c64ab4dc487,55045388-1c43-37dc-9474-2ce83c5f392f,4610ac4c-06fe-331c-9ac5-8f9262dcf998,1498f58b-2265-3c57-89b3-6c33f2fe39f0,ca205071-f9be-32b0-803b-65326f80cb51,5be5f69a-87ac-3c8c-8688-5d12a35b3039,ed500a15-c2fa-33c1-a589-8ea1453fb6b8,7ebc7fab-f5b2-312a-affa-131b8a70e30b,4030da8b-0125-3ee3-a1f4-eb8871fee4e2,697910a1-88d5-351c-ab67-d075a7d91569,cbe13049-e928-3305-a5ce-5c3e3e634538,b6d359de-82bd-3f19-91e6-d82fb306f5f5,7710ba43-080c-3690-a734-ab8d0df9c23d,7d33e090-17de-3e94-a3f6-bfdcc86d6931,34384fbd-c14e-3491-b233-a8613ff4f91b,6f34c7dc-8285-3d13-a2ad-defa82a761b4,c45b3679-e211-3825-aa39-871b4ac5f25f,a087221a-f322-38e2-a850-67509bf0f249,b1bd8ea9-e955-37d3-b9f0-f5bb74acb015,0c7f6f55-f13d-316b-897b-d0bab79765e3,a8afa99d-93f8-3ed7-a0f3-b84e6d1fc842,95e002c9-6966-35df-8beb-e6a6a8ef8cd6,262c61f7-a412-3541-91a2-73464863f132,02c9bf65-5bfa-304d-9e41-debfc8b6950d,870d0d2a-41dd-3938-a078-692910da59bb,a0b13bdc-dc4e-368e-8718-acbb089140fa,2e295ee1-4bd4-3ee6-86b6-e52415d43e36,58b37b28-884b-312c-8791-13a1a70f1b4c,2c0b7241-759a-3216-8841-290acb6e6d5f,a72302a1-a5f7-37f3-ab30-732f843b5a30,9c9d7aa9-928b-3164-8103-626ea1f28258,ff9f60e0-7c15-301d-9914-3d680dd801b2,838b4a4d-37a1-3f71-80cc-4a54be86a8d3,5782894f-9472-38b7-8607-a4974b2ca570,c06b025b-cf79-3882-b3fe-b77304b6b7fa,207e4633-2875-3fb0-aef0-66d830af565d,21f648a3-6a46-334b-8b67-746d83616fcf,a22c7330-dd87-32a7-bd6a-f8fe06e3c92d,eeff2e54-bda0-3637-96cd-f673fc5fae8a,0d581535-3873-337d-9889-94169aee90df,5cdea1fa-6d7c-31b1-85fe-b55cf77f9010,ee29aaa2-770b-39ec-9ff5-c83f105030b1,78e64f73-0538-344d-b6cc-297f90813a7d,228788fc-40c8-359e-81c4-733ededd9e46,76126326-d2fc-3255-9596-9c0559208330,4ff30e52-d17f-394d-a404-7ab7cd32d0c7', 1, 'nativepro', '2026-04-04 19:08:58', '2026-06-10 13:08:05'),
(46, 'PUGB', 'Wi1FgQmf4rd5csjyRoC6', NULL, 3, '2026-05-22 17:16:55', 2, 'e7215e77-9fe4-37e4-b525-30274ae1e3d0,96b38c5c-768e-3528-9740-203314280719', 1, 'nativepro', '2026-04-04 19:08:58', '2026-05-20 09:44:14'),
(47, 'PUGB', 'NwOrFLp2g7XxnKu6sWcq', NULL, 3, '2026-06-01 20:09:36', 100, 'cc19d71b-d743-3527-9b21-2b95b806bd3f,d6d4776e-da29-3513-b927-9f4c954ce35f,1ebd9af5-5b34-3c3a-aaf4-b6eca7fe52db,b4151a8f-8af4-3383-bb2f-716f7e123be8,3fa15ed3-5e30-30c9-bd6f-ad7abc754182,76f847ad-a8e6-3584-81cd-89098e2ca88f,eb38cd9e-9d7e-3af6-9d4b-008b45beb91d,33995a59-4017-37fb-b062-a9cf1abec6cc,e54a6e62-bace-39d4-a9da-95aa6c2884c0', 1, 'nativepro', '2026-04-04 19:08:58', '2026-06-01 01:11:18'),
(49, 'PUGB', 'PILsVZaSqveb72dTCokD', NULL, 30, '2026-07-09 16:01:01', 2, '1d5e6a5d-0bd1-35bb-abe9-f5130a98a8ae', 1, 'nativepro', '2026-04-04 19:08:58', '2026-07-07 22:01:51'),
(50, 'PUGB', 'rFp8cnj7NYJgsTDZOuwk', NULL, 30, '2026-07-13 04:40:37', 2, '44d71b75-5cdd-3d42-ba1d-666341865fed,c275ec70-96d0-3862-9ddd-fa4ca5870ae0', 1, 'nativepro', '2026-04-04 19:08:58', '2026-06-16 23:22:51'),
(51, 'PUGB', 'JHStOXvEBLIKo4VRsfdw', NULL, 30, '2026-07-13 17:45:04', 2, '0c0d33f4-2486-3181-8116-a550b06f88e0', 1, 'nativepro', '2026-04-04 19:08:58', '2026-07-09 15:32:09'),
(52, 'PUGB', 'kfIdq2zAsogVGv7ma0RE', NULL, 20, '2026-07-04 09:12:16', 2, '582e5324-23b3-3873-b3f4-a8c06c261bf9,ce8897df-f4c7-394d-baea-4579af809dd8', 1, 'nativepro', '2026-04-04 19:08:58', '2026-06-14 23:51:18'),
(53, 'PUGB', 'fQTpCFxDHZjdAbW5hKtX', NULL, 60, '2026-09-02 23:40:30', 2, NULL, 1, 'nativepro', '2026-04-04 19:08:58', '2026-07-13 07:27:38'),
(55, 'PUGB', 'PUBGxNINJA', NULL, 3, '2026-07-11 19:25:31', 100, '223eeaab-5621-3024-99e2-8657425f5324,4ca5afb8-8357-36d2-9d97-052fa12eff2f,6147e6b0-3622-3314-bbd2-f91e2d030a9a,c7814c55-c6d0-37f7-a075-7652314f6fa3,9e7d148d-240f-31bb-ad0a-fcafb085df04,b89c8e55-07b7-3198-8fe1-9524de1c5756,8f617bb8-75e6-32f2-ac71-73a36407b9fa,02f9ea2b-8851-3da1-aafb-c0bf669cca0a,74bfedfc-4666-3f68-b35e-3a7701f72d3a,8df66973-1d82-3fa9-8a98-ce65bfcd2346,92b9e4c7-5737-3109-aad7-c9513c5dc752,fd761c62-c295-37ed-8cdb-292d0da5d33a,f3813604-d047-3c8b-9966-231a6deaf28b,3529481d-3c7f-303a-8c48-9e39cb30672e,88d5fe4b-b03f-32e3-87a9-5970b3610e20', 1, 'nativepro', '2026-04-04 19:08:58', '2026-07-10 18:34:47'),
(56, 'PUGB', 'fIrQ3u5PyODNT8AEp2Rv', NULL, 30, '2026-08-09 21:15:26', 5, '2f615e1a-a212-356a-b518-c80a96d25457', 1, 'nativepro', '2026-04-04 19:08:58', '2026-07-10 21:15:26'),
(57, 'PUGB', 'pxeVX5aOivwSgLRfP1WZ', NULL, 1, '2026-07-13 05:04:28', 1, 'b6ab2953-2146-31e2-87b8-f6f7ae1ded27', 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-12 05:04:28'),
(58, 'PUGB', 'U6KZhGiNYEHFODW5CeSd', NULL, 30, '2026-08-13 23:59:16', 3, '0b5f63df-9ee2-313b-b7be-3c063ad9820e', 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-25 15:28:05'),
(59, 'PUGB', 'Nu5GotzVqCegr9FmnXaA', NULL, 60, '2026-09-21 21:22:11', 5, '6f4b091c-be0c-3e9d-9ef1-0100f3709261', 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-23 21:22:11'),
(60, 'PUGB', 'Awc8slBryhK37VzJ5uFG', NULL, 3, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-26 08:32:34'),
(61, 'PUGB', '5dDT0UJy9cPrSXB8w37L', NULL, 65, '2026-10-05 21:22:28', 3, '46fae5fc-c102-3793-afe2-90b0e878007c,b3c33558-b17a-3cb2-a06e-741d1311402f', 1, 'nativepro', '2026-07-08 18:28:48', '2026-08-19 00:09:54'),
(62, 'PUGB', 'eDP4pJXF6RyA0acmZIgL', NULL, 1, '2026-08-06 08:13:19', 1, 'b44f9bee-ed3d-3734-a3af-f8030faa8ece', 1, 'nativepro', '2026-07-08 18:28:48', '2026-08-05 08:13:19'),
(63, 'PUGB', 'l9wsreGZ5DcbBOYHm3MN', NULL, 30, '2026-09-06 07:26:52', 2, 'a22b9068-9e98-3ac9-b2f1-459a449ebdee,169abc2c-067c-33d9-9991-ca7d9ca59568', 1, 'nativepro', '2026-07-08 18:28:48', '2026-08-12 01:58:23'),
(64, 'PUGB', 'EHaKzeUdng1hTbXjps28', NULL, 30, '2026-09-18 05:17:03', 3, 'c216e256-c53c-3d03-b9ed-8efe07b1649b', 1, 'nativepro', '2026-07-08 18:28:48', '2026-08-19 05:17:03'),
(65, 'PUGB', 'goatnhqW4bZ06UDLmxA7', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(66, 'PUGB', 'uiocjY9W1LXE83gTPhNy', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(67, 'PUGB', 'BNIxvk9uwqLMbEHQp8z2', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(68, 'PUGB', 'tYFpKcCrybw73e0sEZQV', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(69, 'PUGB', 'zLVra9vABdXu0jcFsiCe', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(70, 'PUGB', 'yED4xgRz6MNJfdjGOF3b', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(71, 'PUGB', '8XBML7h1CN9jF5Et63zm', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(72, 'PUGB', 'qJ6D53ec9ahTiWtuo8YV', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(73, 'PUGB', 'fjziMNdy7pbnlcUPq3OQ', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(74, 'PUGB', 'nsXKl7OQyuW2roh83bqe', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(75, 'PUGB', 'EzCUVLZMurPDT74gJ5FO', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(76, 'PUGB', 'zlOFhKIdrPg25JDy0wSZ', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(77, 'PUGB', 'dky6b5un9xYG4AqhSBoL', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(78, 'PUGB', 'Oh7g0ZbYaJBktpyPEj9L', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(79, 'PUGB', 'pugdwMheoy7KvQPxk2Ic', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(80, 'PUGB', 'u4iY5rUg2WKtyOFpIxvV', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48'),
(81, 'PUGB', 'HxdP3Rh645vQIm9SLVey', NULL, 1, NULL, 1, NULL, 1, 'nativepro', '2026-07-08 18:28:48', '2026-07-08 18:28:48');

-- --------------------------------------------------------

--
-- Table structure for table `referral_code`
--

CREATE TABLE `referral_code` (
  `id_reff` int NOT NULL,
  `code` varchar(128) DEFAULT NULL,
  `set_saldo` int DEFAULT NULL,
  `used_by` varchar(66) DEFAULT NULL,
  `created_by` varchar(66) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_users` int NOT NULL,
  `fullname` varchar(155) DEFAULT NULL,
  `username` varchar(66) NOT NULL,
  `level` int DEFAULT '2',
  `saldo` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `uplink` varchar(66) DEFAULT NULL,
  `password` varchar(155) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_users`, `fullname`, `username`, `level`, `saldo`, `status`, `uplink`, `password`, `created_at`, `updated_at`) VALUES
(9, 'NativePro', 'nativepro', 1, 99980009, 1, 'fahmyzzx', '$2y$10$Bd9LXsPLQLaMT3jDUzZQb.dgNB504Tjbl.ymDNd6EvypexD4S3Vni', '2026-03-01 18:29:58', '2026-07-08 18:28:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id_history`);

--
-- Indexes for table `keys_code`
--
ALTER TABLE `keys_code`
  ADD PRIMARY KEY (`id_keys`),
  ADD UNIQUE KEY `user_key` (`user_key`);

--
-- Indexes for table `referral_code`
--
ALTER TABLE `referral_code`
  ADD PRIMARY KEY (`id_reff`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_users`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id_history` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `keys_code`
--
ALTER TABLE `keys_code`
  MODIFY `id_keys` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `referral_code`
--
ALTER TABLE `referral_code`
  MODIFY `id_reff` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
