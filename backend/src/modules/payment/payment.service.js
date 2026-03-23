import prisma from "../../config/db.js";

export async function processPayment(orderId) {
  return await prisma.$transaction(async (tx) => {
    // get order with items
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) throw new Error("Order not found");

    // create payment record
    const payment = await tx.payment.create({
      data: {
        orderId,
        status: "PENDING",
        paymentMethod: "CARD",
      },
    });

    //simulate payment
    const isSuccess = Math.random() > 0.3;

    // handle result
    if (isSuccess) {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS" },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: "COMPLETED" },
      });

      return { message: "Payment successful", status: "SUCCESS" };
    }

    // Failed- rollback stock
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });

    await tx.order.update({
      where: { id: orderId },
      data: { status: "FAILED" },
    });

    return { message: "Payment failed", status: "FAILED" };
  });
}
