import { useSelector } from "react-redux";

const Orders = () => {
  const { orders } = useSelector((state) => state.orders);

  if (orders.length === 0) {
    return <h2>No orders yet</h2>;
  }

  return (
    <div>
      <h1>My Orders</h1>

      {orders.map((order) => (
        <div key={order.id} style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Date:</strong> {order.date}</p>

          {order.items.map((item) => (
            <div key={item.id}>
              <p>{item.name} x {item.quantity}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Orders;