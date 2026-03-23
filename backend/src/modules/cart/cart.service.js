import prisma from "../../config/db.js";

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
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  }

  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
}

export async function getCart(userId) {
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: true, // JOIN
        },
      },
    },
  });

  if (!cart) return null;

  return {
    userId: cart.userId,
    items: cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    })),
  };
}

export async function updateCartItem(cartItemId, quantity) {
  if (quantity <= 0) {
    // delete instead
    return await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
}

export async function removeCartItem(cartItemId) {
  return await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
}