-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('TOP', 'HEART', 'BASE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fragrance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "sizeMl" INTEGER NOT NULL,
    "concentration" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "collectionId" TEXT,

    CONSTRAINT "Fragrance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FragranceNote" (
    "id" TEXT NOT NULL,
    "fragranceId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "type" "NoteType" NOT NULL,

    CONSTRAINT "FragranceNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "fragranceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");

-- CreateIndex
CREATE INDEX "Collection_isActive_idx" ON "Collection"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Fragrance_slug_key" ON "Fragrance"("slug");

-- CreateIndex
CREATE INDEX "Fragrance_isActive_idx" ON "Fragrance"("isActive");

-- CreateIndex
CREATE INDEX "Fragrance_isFeatured_idx" ON "Fragrance"("isFeatured");

-- CreateIndex
CREATE INDEX "Fragrance_collectionId_idx" ON "Fragrance"("collectionId");

-- CreateIndex
CREATE INDEX "Fragrance_priceCents_idx" ON "Fragrance"("priceCents");

-- CreateIndex
CREATE INDEX "Fragrance_concentration_idx" ON "Fragrance"("concentration");

-- CreateIndex
CREATE INDEX "Fragrance_createdAt_idx" ON "Fragrance"("createdAt");

-- CreateIndex
CREATE INDEX "FragranceNote_noteId_idx" ON "FragranceNote"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "FragranceNote_fragranceId_noteId_type_key" ON "FragranceNote"("fragranceId", "noteId", "type");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_fragranceId_idx" ON "OrderItem"("fragranceId");

-- AddForeignKey
ALTER TABLE "Fragrance" ADD CONSTRAINT "Fragrance_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FragranceNote" ADD CONSTRAINT "FragranceNote_fragranceId_fkey" FOREIGN KEY ("fragranceId") REFERENCES "Fragrance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FragranceNote" ADD CONSTRAINT "FragranceNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_fragranceId_fkey" FOREIGN KEY ("fragranceId") REFERENCES "Fragrance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
