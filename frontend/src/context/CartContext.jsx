import { createContext, useContext, useState } from "react";
import API from "../services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  //  fetch cart
  const fetchCart = async () => {
    const res = await API.get("/cart/1");
    setCart(res.data.items || []);
  };

  //  add to cart
  const addToCart = async (productId) => {
    await API.post("/cart/add", {
      userId: 1,
      productId,
      quantity: 1,
    });
    fetchCart();
  };

  //  update quantity
  const updateCart = async (cartItemId, quantity) => {
    await API.put("/cart/update", {
      cartItemId,
      quantity,
    });
    fetchCart();
  };

  //  remove item
  const removeItem = async (cartItemId) => {
    await API.delete("/cart/remove", {
      data: { cartItemId },
    });
    fetchCart();
  };

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, addToCart, updateCart, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

// custo
export const useCart = () => useContext(CartContext);
