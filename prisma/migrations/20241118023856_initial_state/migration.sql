-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'UNACTIVE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Letter_Status" AS ENUM ('ON_PROGRESS', 'FINISH', 'HIDE');

-- CreateEnum
CREATE TYPE "Signature_Status" AS ENUM ('NOT_ARRIVE', 'ARRIVE', 'SIGNED');

-- CreateTable
CREATE TABLE "Employee_Type" (
    "employee_type_id" SERIAL NOT NULL,
    "employee_type" TEXT NOT NULL,

    CONSTRAINT "Employee_Type_pkey" PRIMARY KEY ("employee_type_id")
);

-- CreateTable
CREATE TABLE "Letter_Type" (
    "letter_type_id" SERIAL NOT NULL,
    "letter_type" TEXT NOT NULL,

    CONSTRAINT "Letter_Type_pkey" PRIMARY KEY ("letter_type_id")
);

-- CreateTable
CREATE TABLE "Department" (
    "department_id" SERIAL NOT NULL,
    "department_name" TEXT NOT NULL,
    "department_head" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "Signature" (
    "signature_id" SERIAL NOT NULL,
    "letter_id" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "status" "Signature_Status" NOT NULL DEFAULT 'NOT_ARRIVE',
    "signed_date" TIMESTAMP(3),
    "descriptions" TEXT,

    CONSTRAINT "Signature_pkey" PRIMARY KEY ("signature_id")
);

-- CreateTable
CREATE TABLE "Letter" (
    "letter_id" TEXT NOT NULL,
    "letter_date" TIMESTAMP(3) NOT NULL,
    "sender" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "recipient" TEXT,
    "status" "Letter_Status" NOT NULL DEFAULT 'ON_PROGRESS',
    "letter_type_id" INTEGER NOT NULL,

    CONSTRAINT "Letter_pkey" PRIMARY KEY ("letter_id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employee_id" TEXT NOT NULL,
    "employee_name" TEXT,
    "password" TEXT NOT NULL,
    "birth" TIMESTAMP(3),
    "gender" "Gender" NOT NULL,
    "phone_number" TEXT,
    "email" TEXT NOT NULL,
    "address" TEXT,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "department_id" INTEGER NOT NULL,
    "employee_type_id" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_department_name_key" ON "Department"("department_name");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_letter_id_fkey" FOREIGN KEY ("letter_id") REFERENCES "Letter"("letter_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_letter_type_id_fkey" FOREIGN KEY ("letter_type_id") REFERENCES "Letter_Type"("letter_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_employee_type_id_fkey" FOREIGN KEY ("employee_type_id") REFERENCES "Employee_Type"("employee_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;
