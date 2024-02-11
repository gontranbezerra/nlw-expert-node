/*
  Warnings:

  - You are about to drop the `PollOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PollOption" DROP CONSTRAINT "PollOption_pollId_fkey";

-- DropTable
DROP TABLE "PollOption";

-- CreateTable
CREATE TABLE "pollOption" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "pollOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pollOption" ADD CONSTRAINT "pollOption_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
