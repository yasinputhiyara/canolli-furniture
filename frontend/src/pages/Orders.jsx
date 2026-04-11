import { useSelector } from "react-redux";

const Orders = () => {
  const { orders } = useSelector((state) => state.orders);

  if (orders.length === 0) {
    return <h2>No orders yet</h2>;
  }

  return (
    <div>
      <h1>My Orders</h1>

      {orders.map((order) => {
        const items = order.orderItems || order.items || [];
        const orderId = order._id || order.id;
        const status = order.orderStatus || order.status;
        const date = order.createdAt ? new Date(order.createdAt).toLocaleString() : order.date;

        return (
          <div key={orderId} style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount || "N/A"}</p>

            <div style={{ marginTop: "10px" }}>
              {items.map((item) => (
                <div key={item.product || item.id} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "5px" }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width: "40px", height: "40px", objectFit: "cover" }} />}
                  <p>{item.name} x {item.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;