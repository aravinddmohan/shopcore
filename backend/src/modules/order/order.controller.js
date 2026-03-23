import { placeOrder } from "./order.service.js";
import { getOrderHistory } from "./order.service.js";
export async function createOrder(req, res) {
  try {
    const { userId } = req.body;

    const order = await placeOrder(userId);

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

export async function orderHistory(req, res) {
  try {
    const userId = Number(req.params.userId);

    const orders = await getOrderHistory(userId);

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}
