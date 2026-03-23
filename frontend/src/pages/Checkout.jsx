import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useState } from "react";

export default function Checkout() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const res = await API.post("/payment/pay", {
        orderId: Number(orderId),
      });

      if (res.data.status === "SUCCESS") {
        alert("Payment Successful 😈");
        navigate("/orders");
      } else {
        alert("Payment Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div
        className="
          bg-white dark:bg-gray-800
          border border-gray-100 dark:border-gray-700
          rounded-2xl shadow-sm p-6
          transition-colors duration-200
        "
      >
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
          💳 Checkout
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
          Complete your payment below
        </p>

        {/* Order Info */}
        <div
          className="
            bg-gray-50 dark:bg-gray-700/50
            border border-gray-100 dark:border-gray-700
            rounded-xl p-4 mb-6
          "
        >
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
            Order ID
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            #{orderId}
          </p>
        </div>

        {/* Payment Fields */}
        <div className="space-y-3 mb-6">
          {/* Card Number */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="
                w-full
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                border border-gray-200 dark:border-gray-600
                rounded-xl px-4 py-2.5
                text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                transition-colors duration-200
              "
            />
          </div>

          {/* Expiry + CVV */}
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                Expiry
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="
                  w-full
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  border border-gray-200 dark:border-gray-600
                  rounded-xl px-4 py-2.5
                  text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                  transition-colors duration-200
                "
              />
            </div>
            <div className="w-1/2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                CVV
              </label>
              <input
                type="text"
                placeholder="•••"
                className="
                  w-full
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  border border-gray-200 dark:border-gray-600
                  rounded-xl px-4 py-2.5
                  text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                  transition-colors duration-200
                "
              />
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`
            w-full py-3 rounded-xl font-semibold text-sm
            transition-colors duration-200 shadow-sm
            ${
              loading
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
            }
          `}
        >
          {loading ? "Processing..." : "Pay Now 💸"}
        </button>
      </div>
    </div>
  );
}
