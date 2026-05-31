-- CreateTable
CREATE TABLE "ResourceFolder" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceRating" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceRating_pkey" PRIMARY KEY ("id")
);

-- Add folderId column (nullable first for backfill)
ALTER TABLE "Resource" ADD COLUMN "folderId" TEXT;

-- Create default folders for groups that have resources
INSERT INTO "ResourceFolder" ("id", "groupId", "name", "createdBy", "createdAt", "updatedAt")
SELECT
    gen_random_uuid()::text,
    g."id",
    'General',
    g."createdBy",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "StudyGroup" g
WHERE EXISTS (
    SELECT 1 FROM "Resource" r WHERE r."groupId" = g."id"
);

-- Assign all existing resources to their group's General folder
UPDATE "Resource" r
SET "folderId" = f."id"
FROM "ResourceFolder" f
WHERE r."groupId" = f."groupId"
  AND f."name" = 'General'
  AND r."folderId" IS NULL;

-- Remove any orphaned resources without a folder
DELETE FROM "Resource" WHERE "folderId" IS NULL;

-- Make folderId required
ALTER TABLE "Resource" ALTER COLUMN "folderId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "ResourceFolder_groupId_idx" ON "ResourceFolder"("groupId");

-- CreateIndex
CREATE INDEX "ResourceRating_resourceId_idx" ON "ResourceRating"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceRating_resourceId_userId_key" ON "ResourceRating"("resourceId", "userId");

-- AddForeignKey
ALTER TABLE "ResourceFolder" ADD CONSTRAINT "ResourceFolder_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceFolder" ADD CONSTRAINT "ResourceFolder_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "ResourceFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceRating" ADD CONSTRAINT "ResourceRating_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceRating" ADD CONSTRAINT "ResourceRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
