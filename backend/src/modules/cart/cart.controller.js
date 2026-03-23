import { addToCart as addToCartService } from "./cart.service.js";
import { getCart } from "./cart.service.js";
import { updateCartItem } from "./cart.service.js";
import { removeCartItem } from "./cart.service.js";

export async function addToCart(req, res) {
  try {
    const { userId, productId, quantity } = req.body;

    const result = await addToCartService(userId, productId, quantity);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function viewCart(req, res) {
  try {
    const { userId } = req.params;

    const cart = await getCart(Number(userId));

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function updateCart(req, res) {
  try {
    const { cartItemId, quantity } = req.body;

    const result = await updateCartItem(cartItemId, quantity);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
}

export async function removeItem(req, res) {
  try {
    const { cartItemId } = req.body;

    const result = await removeCartItem(cartItemId);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Remove failed" });
  }
}
