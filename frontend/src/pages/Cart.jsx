import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Cart() {
  const { cart, fetchCart, updateCart, removeItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const res = await API.post("/order/place", {
        userId: 1,
      });

      const orderId = res.data.data.id;
      navigate(`/checkout/${orderId}`);
    } catch (err) {
      console.error(err);
      alert("Checkout failed ");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
        🛒 Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-28 gap-3 text-center">
          <span className="text-5xl">🛍️</span>
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Your cart is empty
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Go add something nice!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="
                  bg-white dark:bg-gray-800
                  border border-gray-100 dark:border-gray-700
                  p-5 rounded-2xl shadow-sm
                  flex justify-between items-center
                  transition-colors duration-200
                "
              >
                {/* Left */}
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ₹{item.price} / unit
                  </p>

                  {/* Quanity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateCart(item.id, item.quantity - 1)}
                      className="
                        w-8 h-8 flex items-center justify-center
                        bg-gray-100 dark:bg-gray-700
                        text-gray-800 dark:text-gray-200
                        rounded-lg font-bold text-lg
                        hover:bg-gray-200 dark:hover:bg-gray-600
                        transition-colors
                      "
                    >
                      −
                    </button>

                    <span className="w-6 text-center font-semibold text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateCart(item.id, item.quantity + 1)}
                      className="
                        w-8 h-8 flex items-center justify-center
                        bg-gray-100 dark:bg-gray-700
                        text-gray-800 dark:text-gray-200
                        rounded-lg font-bold text-lg
                        hover:bg-gray-200 dark:hover:bg-gray-600
                        transition-colors
                      "
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Right */}
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-bold text-gray-900 dark:text-white text-base">
                    ₹{item.price * item.quantity}
                  </p>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="
                      text-xs font-medium
                      text-red-500 dark:text-red-400
                      hover:text-red-700 dark:hover:text-red-300
                      hover:underline transition-colors
                    "
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sumary Panel */}
          <div
            className="
              bg-white dark:bg-gray-800
              border border-gray-100 dark:border-gray-700
              p-6 rounded-2xl shadow-sm h-fit
              transition-colors duration-200
            "
          >
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5 tracking-tight">
              Order Summary
            </h2>

            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span>Subtotal</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                ₹{total}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-5">
              <span>Shipping</span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Free
              </span>
            </div>

            <hr className="border-gray-100 dark:border-gray-700 mb-5" />

            <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white mb-6">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="
                w-full bg-green-600 hover:bg-green-700
                dark:bg-green-500 dark:hover:bg-green-600
                text-white py-3 rounded-xl
                font-semibold text-sm tracking-wide
                shadow-sm transition-colors duration-200
              "
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
