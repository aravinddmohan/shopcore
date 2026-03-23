import { useEffect, useState } from "react";
import API from "../services/api";
import { useCart } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    API.get("/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  return (
    <div className="px-1">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
        Products
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="
              bg-white dark:bg-gray-800
              border border-gray-100 dark:border-gray-700
              rounded-2xl shadow-sm hover:shadow-md
              transition-all duration-200
              p-4 flex flex-col
              group
            "
          >
            {/* Image Placeholder */}
            <div
              className="
                h-40 rounded-xl mb-4
                bg-gray-100 dark:bg-gray-700
                flex items-center justify-center
                transition-colors duration-200
              "
            >
              <span className="text-gray-400 dark:text-gray-500 text-sm">
                No Image
              </span>
            </div>

            {/* Product Name */}
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
              {p.name}
            </h3>

            {/* Price */}
            <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-2">
              ₹{p.price}
            </p>

            {/* Spacer */}
            <div className="grow" />

            {/* Button */}
            <button
              onClick={() => addToCart(p.id)}
              className="
                mt-4 w-full
                bg-yellow-400 hover:bg-yellow-500
                dark:bg-yellow-400 dark:hover:bg-yellow-500
                text-gray-900
                py-2 rounded-xl
                font-semibold text-sm
                transition-colors duration-200
                shadow-sm
              "
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-28 gap-3 text-center">
          <span className="text-5xl">📦</span>
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No products found
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
