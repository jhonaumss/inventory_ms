import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { setupInterceptors } from "../api/setupInterceptors";

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
}

function DashboardPage() {
  const { token, logout } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const api = setupInterceptors(logout);

    const fetchItems = async () => {
      try {
        const res = await api.get<InventoryItem[]>("/inventory");
        setItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchItems();
  }, [token, logout]);

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardPage;
