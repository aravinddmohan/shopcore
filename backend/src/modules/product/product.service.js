import prisma from "../../config/db.js";

export async function getAllProducts() {
  return await prisma.product.findMany();
}
