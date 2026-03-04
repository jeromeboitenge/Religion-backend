/*
  Warnings:

  - Added the required column `name_en` to the `Church` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Comitium` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Curia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Diocese` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Praesidium` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Regio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Senatus` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add columns as nullable
ALTER TABLE "Diocese" ADD COLUMN "name_en" TEXT;
ALTER TABLE "Diocese" ADD COLUMN "name_rw" TEXT;
ALTER TABLE "Diocese" ADD COLUMN "name_fr" TEXT;
ALTER TABLE "Diocese" ADD COLUMN "description_en" TEXT;
ALTER TABLE "Diocese" ADD COLUMN "description_rw" TEXT;
ALTER TABLE "Diocese" ADD COLUMN "description_fr" TEXT;

ALTER TABLE "Church" ADD COLUMN "name_en" TEXT;
ALTER TABLE "Church" ADD COLUMN "name_rw" TEXT;
ALTER TABLE "Church" ADD COLUMN "name_fr" TEXT;
ALTER TABLE "Church" ADD COLUMN "address_en" TEXT;
ALTER TABLE "Church" ADD COLUMN "address_rw" TEXT;
ALTER TABLE "Church" ADD COLUMN "address_fr" TEXT;

ALTER TABLE "Senatus" ADD COLUMN "name_en" TEXT;
ALTER TABLE "Senatus" ADD COLUMN "name_rw" TEXT;
ALTER TABLE "Senatus" ADD COLUMN "name_fr" TEXT;
ALTER TABLE "Senatus" ADD COLUMN "description_en" TEXT;
ALTER TABLE "Senatus" ADD COLUMN "description_rw" TEXT;
ALTER TABLE "Senatus" ADD COLUMN "description_fr" TEXT;

ALTER TABLE "Regio" ADD COLUMN "name_en" TEXT;
ALTER TABLE "Regio" ADD COLUMN "name_rw" TEXT;
ALTER TABLE "Regio" ADD COLUMN "name_fr" TEXT;
ALTER TABLE "Regio" ADD COLUMN "description_en" TEXT;
ALTER TABLE "Regio" ADD COLUMN "description_rw" TEXT;
ALTER TABLE "Regio" ADD COLUMN "description_fr" TEXT;

ALTER TABLE "Comitium" ADD COLUMN "name_en" TEXT;
ALTER TABLE "Comitium" ADD COLUMN "name_rw" TEXT;
ALTER TABLE "Comitium" ADD COLUMN "name_fr" TEXT;
ALTER TABLE "Comitium" ADD COLUMN "description_en" TEXT;
ALTER TABLE "Comitium" ADD COLUMN "description_rw" TEXT;
ALTER TABLE "Comitium" ADD COLUMN "description_fr" TEXT;

ALTER TABLE "Curia" ADD COLUMN "name_en" TEXT;
ALTER TABLE "Curia" ADD COLUMN "name_rw" TEXT;
ALTER TABLE "Curia" ADD COLUMN "name_fr" TEXT;
ALTER TABLE "Curia" ADD COLUMN "description_en" TEXT;
ALTER TABLE "Curia" ADD COLUMN "description_rw" TEXT;
ALTER TABLE "Curia" ADD COLUMN "description_fr" TEXT;

ALTER TABLE "Praesidium" ADD COLUMN "name_en" TEXT;
ALTER TABLE "Praesidium" ADD COLUMN "name_rw" TEXT;
ALTER TABLE "Praesidium" ADD COLUMN "name_fr" TEXT;
ALTER TABLE "Praesidium" ADD COLUMN "description_en" TEXT;
ALTER TABLE "Praesidium" ADD COLUMN "description_rw" TEXT;
ALTER TABLE "Praesidium" ADD COLUMN "description_fr" TEXT;

ALTER TABLE "Group" ADD COLUMN "name_en" TEXT;
ALTER TABLE "Group" ADD COLUMN "name_rw" TEXT;
ALTER TABLE "Group" ADD COLUMN "name_fr" TEXT;
ALTER TABLE "Group" ADD COLUMN "description_en" TEXT;
ALTER TABLE "Group" ADD COLUMN "description_rw" TEXT;
ALTER TABLE "Group" ADD COLUMN "description_fr" TEXT;

-- Step 2: Copy existing data to new fields
UPDATE "Diocese" SET "name_en" = "name", "description_en" = "description";
UPDATE "Church" SET "name_en" = "name", "address_en" = "address";
UPDATE "Senatus" SET "name_en" = "name", "description_en" = "description";
UPDATE "Regio" SET "name_en" = "name", "description_en" = "description";
UPDATE "Comitium" SET "name_en" = "name", "description_en" = "description";
UPDATE "Curia" SET "name_en" = "name", "description_en" = "description";
UPDATE "Praesidium" SET "name_en" = "name", "description_en" = "description";
UPDATE "Group" SET "name_en" = "name", "description_en" = "description";

-- Step 3: Make name_en columns NOT NULL
ALTER TABLE "Diocese" ALTER COLUMN "name_en" SET NOT NULL;
ALTER TABLE "Church" ALTER COLUMN "name_en" SET NOT NULL;
ALTER TABLE "Senatus" ALTER COLUMN "name_en" SET NOT NULL;
ALTER TABLE "Regio" ALTER COLUMN "name_en" SET NOT NULL;
ALTER TABLE "Comitium" ALTER COLUMN "name_en" SET NOT NULL;
ALTER TABLE "Curia" ALTER COLUMN "name_en" SET NOT NULL;
ALTER TABLE "Praesidium" ALTER COLUMN "name_en" SET NOT NULL;
ALTER TABLE "Group" ALTER COLUMN "name_en" SET NOT NULL;
