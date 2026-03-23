import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import { useTheme } from "./context/ThemeContext";

function Navbar() {
  const location = useLocation();
  const { toggleTheme, dark } = useTheme();
  const navLink = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-white dark:bg-gray-800 text-black dark:text-white">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold text-blue-600 tracking-tight">
          🛒 ShopCore
        </h1>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link to="/" className={navLink("/")}>
            Products
          </Link>
          <Link to="/orders" className={navLink("/orders")}>
            Orders
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold shadow-sm transition"
          >
            Cart
          </Link>

          {/* Toggletheme */}
          <button
            onClick={toggleTheme}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
        <Navbar />

        <div className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/:orderId" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
