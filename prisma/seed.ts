import prisma from "@/lib/prisma";
import generateEmployeeId from "@/utils/generateId";
import hashPassword from "@/utils/hashedPassword";

async function main() {
  try {
    await prisma.employee_Type.createMany({
      data: [
        {
          employee_type: "Superadmin",
        },
        {
          employee_type: "Secretary",
        },
        {
          employee_type: "Receptionist",
        },
        {
          employee_type: "Division",
        },
      ],
    });

    console.log("successfully seeding data employee type");

    await prisma.letter_Type.createMany({
      data: [{ letter_type: "Internal" }, { letter_type: "External" }],
    });
    console.log("successfully seeding data letter type");

    await prisma.deputy.create({
      data: {
        deputy_name: "Airport Facilities and Equipment Services",
        head_deputy: "Boedi Coer Tjahjo Sadpotroe"
      },
    });
    console.log("successfully seeding data deputy");
    
    await prisma.division.create({
      data: {
        division_name: "Airport Equipment",
        head_division: "Eddy Samsul "
      },
    });
    console.log("successfully seeding data division");
    
    await prisma.department.create({
      data: {
        department_name: "Electronics & Tech Services",
        department_head: "Mahendra Tri Yuswanto"
      },
    });
    console.log("successfully seeding data department");
    

    const employeeId = generateEmployeeId();
    const hashedPassword = await hashPassword("password");

    await prisma.employee.create({
      data: {
        employee_id: employeeId,
        status: "ACTIVE",
        employee_name: "superadmin",
        email: "superadmin@example.com",
        gender: "MALE",
        password: hashedPassword,
        address: "streetofgods",
        birth: new Date(),
        employee_type_id: 1,
        deputy_id: 1,
        phone_number: "88888888",
        createdAt: new Date(),
      },
    });
    console.log("successfully seeding data superadmin");
  } catch (error: any) {
    console.log("Error while seeding data : ", error.meesage);
  } finally {
    prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Failed to seed database:");
  console.error(error);
  process.exit(1);
});
