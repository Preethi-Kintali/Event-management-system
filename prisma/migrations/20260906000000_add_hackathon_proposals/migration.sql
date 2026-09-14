-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SUBMITTED_TO_MANAGER', 'MANAGER_APPROVED', 'MANAGER_REJECTED', 'CHANGES_REQUESTED', 'SUBMITTED_TO_PRINCIPAL', 'PRINCIPAL_APPROVED', 'PRINCIPAL_REJECTED', 'EVENT_CREATED');

-- CreateTable
CREATE TABLE "HackathonProposal" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "expectedParticipants" INTEGER,
    "estimatedBudget" DOUBLE PRECISION,
    "requiredManpower" INTEGER,
    "estimatedWorkingHours" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "requirements" TEXT,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedById" TEXT NOT NULL,
    "managerId" TEXT,
    "managerComment" TEXT,
    "managerReviewedAt" TIMESTAMP(3),
    "principalId" TEXT,
    "principalComment" TEXT,
    "principalReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HackathonProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HackathonProposal_organizationId_idx" ON "HackathonProposal"("organizationId");

-- CreateIndex
CREATE INDEX "HackathonProposal_submittedById_idx" ON "HackathonProposal"("submittedById");

-- CreateIndex
CREATE INDEX "HackathonProposal_managerId_idx" ON "HackathonProposal"("managerId");

-- CreateIndex
CREATE INDEX "HackathonProposal_principalId_idx" ON "HackathonProposal"("principalId");

-- CreateIndex
CREATE INDEX "HackathonProposal_status_idx" ON "HackathonProposal"("status");

-- AddForeignKey
ALTER TABLE "HackathonProposal" ADD CONSTRAINT "HackathonProposal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackathonProposal" ADD CONSTRAINT "HackathonProposal_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackathonProposal" ADD CONSTRAINT "HackathonProposal_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackathonProposal" ADD CONSTRAINT "HackathonProposal_principalId_fkey" FOREIGN KEY ("principalId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
