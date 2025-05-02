-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('TRADING', 'MARKETPLACE');

-- CreateTable
CREATE TABLE "TradingPost" (
    "id" TEXT NOT NULL,
    "hasPieces" TEXT NOT NULL,
    "needsPieces" TEXT NOT NULL,
    "type" "PostType" NOT NULL DEFAULT 'TRADING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "TradingPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TradingPost" ADD CONSTRAINT "TradingPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
