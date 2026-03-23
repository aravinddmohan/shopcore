import { useEffect, useState } from "react";
import API from "../services/api";

// Small helper to color the status badge based on order status
function StatusBadge({ status }) {
  const styles = {
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    confirmed:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    delivered:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  const cls =
    styles[status?.toLowerCase()] ??
    "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      {status}
    </span>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/order/1").then((res) => {
      setOrders(res.data.data);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-1 py-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
        📦 Your Orders
      </h1>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-28 gap-3 text-center">
          <span className="text-5xl">🧾</span>
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No orders yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Place your first order from the cart!
          </p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="
              bg-white dark:bg-gray-800
              border border-gray-100 dark:border-gray-700
              rounded-2xl shadow-sm
              p-5 transition-colors duration-200
            "
          >
            {/* Order Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5 font-medium uppercase tracking-wide">
                  Order
                </p>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  #{order.orderId}
                </h3>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <StatusBadge status={order.status} />
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  ₹{order.totalAmount}
                </p>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-100 dark:border-gray-700 mb-4" />

            {/* Items */}
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
              Items
            </p>

            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      × {item.quantity}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
