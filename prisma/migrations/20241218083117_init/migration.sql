-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_department_id_fkey";

-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_department_id_fkey";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "division_id" INTEGER;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "deputy_id" INTEGER,
ADD COLUMN     "division_id" INTEGER,
ALTER COLUMN "department_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Signature" ADD COLUMN     "deputy_id" INTEGER,
ADD COLUMN     "division_id" INTEGER,
ALTER COLUMN "department_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Deputy" (
    "deputy_id" SERIAL NOT NULL,
    "deputy_name" TEXT NOT NULL,
    "head_deputy" TEXT NOT NULL,

    CONSTRAINT "Deputy_pkey" PRIMARY KEY ("deputy_id")
);

-- CreateTable
CREATE TABLE "Division" (
    "division_id" SERIAL NOT NULL,
    "division_name" TEXT NOT NULL,
    "head_division" TEXT NOT NULL,
    "deputy_id" INTEGER,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("division_id")
);

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "Deputy"("deputy_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "Division"("division_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "Deputy"("deputy_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "Division"("division_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "Division"("division_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "Deputy"("deputy_id") ON DELETE SET NULL ON UPDATE CASCADE;
