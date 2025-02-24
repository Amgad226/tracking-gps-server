-- CreateTable
CREATE TABLE `events_v2` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user` VARCHAR(191) NOT NULL,
    `battary` DOUBLE NOT NULL,
    `speed` DOUBLE NOT NULL,
    `long` DOUBLE NOT NULL,
    `lat` DOUBLE NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `day` INTEGER NOT NULL,
    `hour` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
