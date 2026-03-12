import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { addOrder } from "../features/orders/orderSlice";

const Checkout = () => {
  const { items } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const handlePlaceOrder = () => {
    const newOrder = {
      id: Date.now(),
      items,
      address,
      status: "Placed",
      date: new Date().toLocaleString(),
    };
    dispatch(addOrder(newOrder))
    dispatch(clearCart());
    alert("Order placed successfully!");
  };

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  if (items.length === 0) {
    return <h2>Your cart is empty</h2>;
  }

  return (
    <div>
      <h1>Checkout</h1>

      <input name="fullName" placeholder="Full Name" onChange={handleChange} />

      <input name="phone" placeholder="Phone" onChange={handleChange} />

      <input name="city" placeholder="City" onChange={handleChange} />

      <input name="state" placeholder="State" onChange={handleChange} />

      <input name="pincode" placeholder="Pincode" onChange={handleChange} />

      <button onClick={handleChange}>Place order(COD) </button>
    </div>
  );
};

export default Checkout;
