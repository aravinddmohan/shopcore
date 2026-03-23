import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(" Seeding started...");

  // 👤 Users
  const users = await prisma.user.createMany({
    data: [
      { email: "alice@gmail.com", password: "1234" },
      { email: "tambi@gmail.com", password: "1234" },
      { email: "alan@gmail.com", password: "1234" },
    ],
  });

  console.log(" Users seeded");

  // Categories
  const categories = await prisma.category.createMany({
    data: [{ name: "Electronics" }, { name: "Clothing" }, { name: "Books" }],
  });

  console.log(" Categories seeded");

  //  Fetch categories (needed for FK)
  const allCategories = await prisma.category.findMany();

  //  Products (bulk)
  const productsData = [];

  for (let i = 1; i <= 100; i++) {
    const randomCategory =
      allCategories[Math.floor(Math.random() * allCategories.length)];

    productsData.push({
      name: `Product ${i}`,
      description: `Description for product ${i}`,
      price: Math.floor(Math.random() * 10000),
      stock: Math.floor(Math.random() * 50),
      categoryId: randomCategory.id,
    });
  }

  await prisma.product.createMany({
    data: productsData,
  });

  console.log("Products seeded (100 items)");

  console.log(" Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
