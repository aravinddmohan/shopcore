import prisma from "../../config/db.js";
import redisClient from "../../config/redis.js";

export async function addToCart(userId, productId, quantity = 1) {
  let cart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    await redisClient.del(`cart:${userId}`);

    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  }

  await redisClient.del(`cart:${userId}`);

  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
}
export async function getCart(userId) {
  const cacheKey = `cart:${userId}`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("Cache hit");
      return JSON.parse(cached);
    }
  } catch (err) {
    console.log("Redis failed, fallback to DB");
  }

  console.log("DB hit");

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!cart) return null;

  const formatted = {
    userId: cart.userId,
    items: cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    })),
  };

  try {
    await redisClient.set(cacheKey, JSON.stringify(formatted), {
      EX: 60,
    });
  } catch (err) {
    console.log("Redis set failed");
  }

  return formatted;
}

export async function updateCartItem(cartItemId, quantity) {
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!item) return null;

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  await redisClient.del(`cart:${item.cart.userId}`);

  return { success: true };
}

export async function removeCartItem(cartItemId) {
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!item) return null;

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  await redisClient.del(`cart:${item.cart.userId}`);

  return { success: true };
}
