import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return (
    <div>
      <h1>Your Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        items.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>

            <button onClick={() => dispatch(decreaseQuantity(item.id))}>
              -
            </button>

            <span> {item.quantity} </span>

            <button onClick={() => dispatch(increaseQuantity(item.id))}>
              +
            </button>

            <button onClick={() => dispatch(removeFromCart(item.id))}>
              Remove
            </button>
          </div>
        ))
      )}

      <h2>Total: ₹{totalPrice}</h2>
    </div>
  );
};

export default Cart;
