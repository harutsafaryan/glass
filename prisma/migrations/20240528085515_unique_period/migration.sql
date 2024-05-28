/*
  Warnings:

  - A unique constraint covering the columns `[todoId,period]` on the table `Periodicity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Periodicity_todoId_period_key" ON "Periodicity"("todoId", "period");
