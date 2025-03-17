/*
  Warnings:

  - You are about to drop the column `rideId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `Ride` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[rentalId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rentalId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_rideId_fkey";

-- DropForeignKey
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_bikeId_fkey";

-- DropForeignKey
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_userId_fkey";

-- DropIndex
DROP INDEX "Payment_rideId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "rideId",
ADD COLUMN     "rentalId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Ride";

-- CreateTable
CREATE TABLE "Rental" (
    "rentalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bikeId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("rentalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_rentalId_key" ON "Payment"("rentalId");

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("bikeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("rentalId") ON DELETE RESTRICT ON UPDATE CASCADE;
