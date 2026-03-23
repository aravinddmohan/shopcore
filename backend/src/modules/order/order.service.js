import prisma from "../../config/db.js";

export async function placeOrder(userId) {
  return await prisma.$transaction(async (tx) => {
    //  get cart with items
    const cart = await tx.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }
    let totalAmount = 0;

    // LOCK products one by one
    for (const item of cart.items) {
      const lockedProduct = await tx.$queryRaw`
        SELECT * FROM "Product"
        WHERE id = ${item.productId}
        FOR UPDATE
      `;

      const product = lockedProduct[0];

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      totalAmount += item.quantity * product.price;
    }
    //  create order
    const order = await tx.order.create({
      data: {
        userId,
        status: "PENDING",
        totalAmount,
      },
    });

    //  create order items + update stock
    for (const item of cart.items) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
        },
      });

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });
}

export async function getOrderHistory(userId) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map((order) => ({
    orderId: order.id,
    status: order.status,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      price: item.priceAtPurchase,
      quantity: item.quantity,
    })),
  }));
}
