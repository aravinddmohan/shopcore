import { processPayment } from "./payment.service.js";

export async function payOrder(req, res) {
  try {
    const { orderId } = req.body;

    const result = await processPayment(orderId);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}
