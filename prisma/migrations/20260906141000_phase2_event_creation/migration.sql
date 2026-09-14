-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "proposalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Event_proposalId_key" ON "Event"("proposalId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "HackathonProposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
